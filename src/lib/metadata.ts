import { ascii, readU16, readU32 } from './binary';
import type { Finding, ImageFormat, RiskLevel, ScanResult, VerificationReport } from './types';

export const MAX_FILE_MEGABYTES = 10;
export const MAX_FILE_BYTES = MAX_FILE_MEGABYTES * 1_000_000;
export const MAX_BATCH_MEGABYTES = 100;
export const MAX_BATCH_BYTES = MAX_BATCH_MEGABYTES * 1_000_000;
export const assertFileSize = (size: number): void => {
  if (!Number.isSafeInteger(size) || size < 0 || size > MAX_FILE_BYTES) {
    throw new Error(`This file exceeds the ${MAX_FILE_MEGABYTES} MB per-file safety limit.`);
  }
};
const decoder = new TextDecoder('utf-8', { fatal: false });

const riskDetails: Record<RiskLevel, string> = {
  critical: 'Can expose a precise location or an older hidden preview.',
  personal: 'Can identify a person, device, or account context.',
  contextual: 'Can reveal when or how the image was created.',
  technical: 'Usually helps display or describe the image.',
};

const finding = (id: string, label: string, value: string, risk: RiskLevel, description = riskDetails[risk]): Finding => ({
  id,
  label,
  value: value.trim() || 'Present',
  risk,
  description,
});

const ensureUnique = (items: Finding[]): Finding[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.id}:${item.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const detectFormat = (bytes: Uint8Array): ImageFormat => {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.length >= 8 && ascii(bytes, 1, 3) === 'PNG' && bytes[0] === 0x89) return 'png';
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
  throw new Error('Unsupported or invalid image signature. Choose a JPEG, PNG, or static WebP file.');
};

interface TiffResult {
  findings: Finding[];
  orientation: number;
  embeddedThumbnail: boolean;
  gps: { latitude?: number; longitude?: number };
}

const typeSizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

const parseTiff = (bytes: Uint8Array): TiffResult => {
  const empty: TiffResult = { findings: [], orientation: 1, embeddedThumbnail: false, gps: {} };
  if (bytes.length < 8) return empty;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const order = ascii(bytes, 0, 2);
  if (order !== 'II' && order !== 'MM') return empty;
  const little = order === 'II';
  if (readU16(view, 2, little) !== 42) return empty;

  const readValue = (entryOffset: number, type: number, count: number): unknown => {
    const size = typeSizes[type];
    if (!size || count < 0 || count > 4096) return undefined;
    const byteLength = size * count;
    const dataOffset = byteLength <= 4 ? entryOffset + 8 : readU32(view, entryOffset + 8, little);
    if (dataOffset < 0 || dataOffset + byteLength > bytes.length) return undefined;
    if (type === 2) return decoder.decode(bytes.subarray(dataOffset, dataOffset + byteLength)).replace(/\0+$/g, '');
    if (type === 3) return Array.from({ length: count }, (_, i) => readU16(view, dataOffset + i * 2, little));
    if (type === 4) return Array.from({ length: count }, (_, i) => readU32(view, dataOffset + i * 4, little));
    if (type === 5 || type === 10) {
      return Array.from({ length: count }, (_, i) => {
        const numerator = type === 10 ? view.getInt32(dataOffset + i * 8, little) : readU32(view, dataOffset + i * 8, little);
        const denominator = type === 10 ? view.getInt32(dataOffset + i * 8 + 4, little) : readU32(view, dataOffset + i * 8 + 4, little);
        return denominator ? numerator / denominator : 0;
      });
    }
    if (type === 7 || type === 1) return bytes.slice(dataOffset, dataOffset + byteLength);
    return undefined;
  };

  const parseIfd = (offset: number): Map<number, unknown> => {
    const values = new Map<number, unknown>();
    if (!Number.isSafeInteger(offset) || offset < 0 || offset + 2 > bytes.length) return values;
    const count = readU16(view, offset, little);
    if (count > 512 || offset + 2 + count * 12 + 4 > bytes.length) return values;
    for (let i = 0; i < count; i += 1) {
      const entry = offset + 2 + i * 12;
      const tag = readU16(view, entry, little);
      const type = readU16(view, entry + 2, little);
      const valueCount = readU32(view, entry + 4, little);
      values.set(tag, readValue(entry, type, valueCount));
    }
    const nextOffset = readU32(view, offset + 2 + count * 12, little);
    if (nextOffset) values.set(-1, nextOffset);
    return values;
  };

  const values = parseIfd(readU32(view, 4, little));
  const getFirstNumber = (value: unknown): number | undefined => Array.isArray(value) && typeof value[0] === 'number' ? value[0] : undefined;
  const addText = (tag: number, id: string, label: string, risk: RiskLevel) => {
    const value = values.get(tag);
    if (typeof value === 'string' && value.trim()) empty.findings.push(finding(id, label, value, risk));
  };

  addText(0x010e, 'description', 'Image description', 'personal');
  addText(0x010f, 'camera-make', 'Camera maker', 'technical');
  addText(0x0110, 'device-model', 'Device model', 'personal');
  addText(0x0131, 'software', 'Editing software', 'contextual');
  addText(0x0132, 'capture-time', 'Date and time', 'contextual');
  addText(0x013b, 'owner', 'Camera owner or artist', 'personal');
  addText(0x8298, 'copyright', 'Copyright or owner field', 'personal');
  empty.orientation = getFirstNumber(values.get(0x0112)) || 1;
  if (empty.orientation !== 1) empty.findings.push(finding('orientation', 'Orientation instruction', String(empty.orientation), 'technical', 'Needed to display stored JPEG pixels in the intended direction.'));

  const exifOffset = getFirstNumber(values.get(0x8769));
  if (exifOffset) {
    const exif = parseIfd(exifOffset);
    const addExifText = (tag: number, id: string, label: string, risk: RiskLevel) => {
      const value = exif.get(tag);
      if (typeof value === 'string' && value.trim()) empty.findings.push(finding(id, label, value, risk));
    };
    addExifText(0x9003, 'capture-time-original', 'Original capture time', 'contextual');
    addExifText(0xa420, 'image-id', 'Image identifier', 'personal');
    addExifText(0xa431, 'device-serial', 'Device serial number', 'personal');
    const userComment = exif.get(0x9286);
    if (userComment instanceof Uint8Array && userComment.length) {
      const text = decoder.decode(userComment.subarray(Math.min(8, userComment.length))).replace(/\0/g, '').trim();
      empty.findings.push(finding('user-comment', 'User comment', text || 'Present', 'personal'));
    }
  }

  const gpsOffset = getFirstNumber(values.get(0x8825));
  if (gpsOffset) {
    const gps = parseIfd(gpsOffset);
    const latParts = gps.get(2);
    const lonParts = gps.get(4);
    const latRef = gps.get(1);
    const lonRef = gps.get(3);
    if (Array.isArray(latParts) && latParts.length >= 3 && Array.isArray(lonParts) && lonParts.length >= 3) {
      const decimal = (parts: unknown[], ref: unknown) => {
        const value = Number(parts[0]) + Number(parts[1]) / 60 + Number(parts[2]) / 3600;
        return typeof ref === 'string' && /[SW]/i.test(ref) ? -value : value;
      };
      empty.gps.latitude = decimal(latParts, latRef);
      empty.gps.longitude = decimal(lonParts, lonRef);
      empty.findings.push(finding('gps', 'GPS coordinates', `${empty.gps.latitude.toFixed(6)}, ${empty.gps.longitude.toFixed(6)}`, 'critical'));
    } else {
      empty.findings.push(finding('gps', 'GPS metadata', 'Present', 'critical'));
    }
    const altitude = gps.get(6);
    if (Array.isArray(altitude) && typeof altitude[0] === 'number') empty.findings.push(finding('gps-altitude', 'GPS altitude', `${altitude[0].toFixed(1)} m`, 'critical'));
    const direction = gps.get(17);
    if (Array.isArray(direction) && typeof direction[0] === 'number') empty.findings.push(finding('gps-direction', 'Image direction', `${direction[0].toFixed(1)} degrees`, 'contextual'));
  }

  const ifd1Offset = getFirstNumber(values.get(-1));
  if (ifd1Offset) {
    const ifd1 = parseIfd(ifd1Offset);
    const thumbnailOffset = getFirstNumber(ifd1.get(0x0201));
    const thumbnailLength = getFirstNumber(ifd1.get(0x0202));
    empty.embeddedThumbnail = Boolean(thumbnailOffset && thumbnailLength && thumbnailOffset + thumbnailLength <= bytes.length);
  }
  return empty;
};

const baseResult = (name: string, format: ImageFormat, size: number): ScanResult => ({
  fileName: name,
  format,
  mimeType: format === 'jpeg' ? 'image/jpeg' : `image/${format}`,
  size,
  orientation: 1,
  animated: false,
  findings: [],
  structures: { exif: false, xmp: false, iptc: false, comments: false, embeddedThumbnail: false, iccProfile: false },
});

const scanJpeg = (bytes: Uint8Array, name: string): ScanResult => {
  const result = baseResult(name, 'jpeg', bytes.length);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error('Malformed JPEG marker sequence.');
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++]!;
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > bytes.length) throw new Error('Truncated JPEG segment.');
    const length = (bytes[offset]! << 8) | bytes[offset + 1]!;
    if (length < 2 || offset + length > bytes.length) throw new Error('Unsafe JPEG segment length.');
    const dataStart = offset + 2;
    const dataEnd = offset + length;
    if (marker === 0xe1 && ascii(bytes, dataStart, 6) === 'Exif\0\0') {
      result.structures.exif = true;
      const exif = parseTiff(bytes.subarray(dataStart + 6, dataEnd));
      result.findings.push(...exif.findings);
      result.orientation = exif.orientation;
      result.structures.embeddedThumbnail ||= exif.embeddedThumbnail;
    } else if (marker === 0xe1 && ascii(bytes, dataStart, Math.min(29, dataEnd - dataStart)).includes('http://ns.adobe.com/xap/')) {
      result.structures.xmp = true;
      result.findings.push(finding('xmp', 'XMP packet', 'Present', 'personal'));
    } else if (marker === 0xed) {
      result.structures.iptc = true;
      result.findings.push(finding('iptc', 'IPTC metadata', 'Present', 'personal'));
    } else if (marker === 0xe2 && ascii(bytes, dataStart, Math.min(12, dataEnd - dataStart)).startsWith('ICC_PROFILE')) {
      result.structures.iccProfile = true;
      result.findings.push(finding('icc', 'ICC color profile', 'Present', 'technical', 'Usually preserved to maintain intended color.'));
    } else if (marker === 0xfe) {
      result.structures.comments = true;
      const text = decoder.decode(bytes.subarray(dataStart, dataEnd)).replace(/\0/g, '').trim();
      result.findings.push(finding('comment', 'JPEG comment', text || 'Present', 'personal'));
    } else if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && dataEnd - dataStart >= 5) {
      result.height = (bytes[dataStart + 1]! << 8) | bytes[dataStart + 2]!;
      result.width = (bytes[dataStart + 3]! << 8) | bytes[dataStart + 4]!;
    }
    offset += length;
  }
  if (result.structures.embeddedThumbnail) result.findings.push(finding('embedded-thumbnail', 'Embedded thumbnail', 'Present', 'critical'));
  result.findings = ensureUnique(result.findings);
  return result;
};

const decodePngText = (type: string, data: Uint8Array): string => {
  if (type === 'zTXt') return 'Compressed text present';
  return decoder.decode(data).replace(/\0/g, ': ').slice(0, 240);
};

const scanPng = (bytes: Uint8Array, name: string): ScanResult => {
  const result = baseResult(name, 'png', bytes.length);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = readU32(view, offset, false);
    const type = ascii(bytes, offset + 4, 4);
    const dataStart = offset + 8;
    const end = dataStart + length;
    if (length > bytes.length || end + 4 > bytes.length) throw new Error('Unsafe PNG chunk length.');
    const data = bytes.subarray(dataStart, end);
    if (type === 'IHDR' && length >= 8) {
      result.width = readU32(view, dataStart, false);
      result.height = readU32(view, dataStart + 4, false);
    } else if (type === 'eXIf') {
      result.structures.exif = true;
      const exif = parseTiff(data);
      result.findings.push(...exif.findings);
      result.orientation = exif.orientation;
    } else if (['tEXt', 'zTXt', 'iTXt'].includes(type)) {
      const text = decodePngText(type, data);
      const isXmp = /xmp|adobe:ns:meta/i.test(text);
      result.structures.xmp ||= isXmp;
      result.findings.push(finding(isXmp ? 'xmp' : 'png-text', isXmp ? 'XMP packet' : 'PNG text field', text || 'Present', 'personal'));
    } else if (type === 'tIME') {
      result.findings.push(finding('png-time', 'PNG modification time', 'Present', 'contextual'));
    } else if (type === 'iCCP') {
      result.structures.iccProfile = true;
      result.findings.push(finding('icc', 'ICC color profile', 'Present', 'technical', 'Usually preserved to maintain intended color.'));
    }
    offset = end + 4;
    if (type === 'IEND') break;
  }
  result.findings = ensureUnique(result.findings);
  return result;
};

const scanWebp = (bytes: Uint8Array, name: string): ScanResult => {
  const result = baseResult(name, 'webp', bytes.length);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = ascii(bytes, offset, 4);
    const length = readU32(view, offset + 4, true);
    const dataStart = offset + 8;
    const end = dataStart + length;
    if (end > bytes.length) throw new Error('Unsafe WebP chunk length.');
    const data = bytes.subarray(dataStart, end);
    if (type === 'VP8X' && data.length >= 10) {
      result.animated = Boolean(data[0]! & 0x02);
      result.width = 1 + data[4]! + (data[5]! << 8) + (data[6]! << 16);
      result.height = 1 + data[7]! + (data[8]! << 8) + (data[9]! << 16);
    } else if (type === 'EXIF') {
      result.structures.exif = true;
      const tiffData = ascii(data, 0, Math.min(6, data.length)) === 'Exif\0\0' ? data.subarray(6) : data;
      const exif = parseTiff(tiffData);
      result.findings.push(...exif.findings);
      result.orientation = exif.orientation;
      result.structures.embeddedThumbnail ||= exif.embeddedThumbnail;
    } else if (type === 'XMP ') {
      result.structures.xmp = true;
      result.findings.push(finding('xmp', 'XMP packet', 'Present', 'personal'));
    } else if (type === 'ICCP') {
      result.structures.iccProfile = true;
      result.findings.push(finding('icc', 'ICC color profile', 'Present', 'technical', 'Usually preserved to maintain intended color.'));
    }
    offset = end + (length % 2);
  }
  if (result.animated) result.findings.push(finding('animation', 'Animation', 'Present', 'technical', 'Animated WebP cleaning is not supported in version 1.'));
  if (result.structures.embeddedThumbnail) result.findings.push(finding('embedded-thumbnail', 'Embedded thumbnail', 'Present', 'critical'));
  result.findings = ensureUnique(result.findings);
  return result;
};

export const scanBytes = (input: ArrayBuffer | Uint8Array, fileName = 'photo'): ScanResult => {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (!bytes.length) throw new Error('The selected file is empty.');
  assertFileSize(bytes.length);
  const format = detectFormat(bytes);
  if (format === 'jpeg') return scanJpeg(bytes, fileName);
  if (format === 'png') return scanPng(bytes, fileName);
  return scanWebp(bytes, fileName);
};

export const privateFindings = (scan: ScanResult): Finding[] => scan.findings.filter((item) => item.risk !== 'technical');

export const buildVerificationReport = (scan: ScanResult): VerificationReport => {
  const has = (id: string) => scan.findings.some((item) => item.id === id || item.id.startsWith(id));
  const checks: VerificationReport['checks'] = [
    { category: 'GPS coordinates', status: has('gps') ? 'present' : 'not-found', note: has('gps') ? 'Location metadata needs attention.' : 'No supported GPS field was found.' },
    { category: 'Capture time', status: has('capture-time') || has('png-time') ? 'present' : 'not-found', note: 'Checks supported EXIF and PNG time fields.' },
    { category: 'Device and owner information', status: ['device-model', 'device-serial', 'owner', 'copyright', 'image-id'].some(has) ? 'present' : 'not-found', note: 'Checks supported device, owner, and identifier fields.' },
    { category: 'Comments and descriptions', status: ['comment', 'user-comment', 'description', 'png-text'].some(has) ? 'present' : 'not-found', note: 'Checks supported comment and description fields.' },
    { category: 'XMP packet', status: scan.structures.xmp ? 'present' : 'not-found', note: 'Checks JPEG, PNG, and WebP XMP containers.' },
    { category: 'IPTC metadata', status: scan.structures.iptc ? 'present' : 'not-found', note: 'Checks JPEG APP13 metadata blocks.' },
    { category: 'Embedded thumbnail', status: scan.structures.embeddedThumbnail ? 'present' : 'not-found', note: 'Checks supported EXIF thumbnail pointers.' },
    { category: 'Orientation', status: scan.orientation === 1 ? 'not-found' : 'preserved', note: scan.orientation === 1 ? 'No rotation instruction is required.' : 'A minimal display-orientation instruction remains.' },
    { category: 'ICC color profile', status: scan.structures.iccProfile ? 'preserved' : 'not-found', note: scan.structures.iccProfile ? 'Color profile is present.' : 'No ICC profile was found.' },
  ];
  const attention = checks.some((check) => check.status === 'present');
  return {
    version: 1,
    verifiedAt: new Date().toISOString(),
    file: { name: scan.fileName, format: scan.format, size: scan.size, dimensions: scan.width && scan.height ? `${scan.width} x ${scan.height}` : 'Not reported' },
    checks,
    result: attention ? 'attention-needed' : 'clean',
    limitation: 'This report checks supported hidden-data structures. It does not analyze visible people, text, landmarks, reflections, or context.',
  };
};
