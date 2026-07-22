import { ascii, concatBytes, makePngChunk, sanitizeFileStem, writeU32LE } from './binary';
import { privateFindings, scanBytes } from './metadata';
import type { CleanResult, ScanResult, VerificationReport } from './types';

const makeOrientationExif = (orientation: number): Uint8Array => {
  const tiff = new Uint8Array([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00,
    0x12, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, orientation & 0xff, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ]);
  const payload = concatBytes(new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]), tiff);
  const segment = new Uint8Array(payload.length + 4);
  segment.set([0xff, 0xe1], 0);
  new DataView(segment.buffer).setUint16(2, payload.length + 2, false);
  segment.set(payload, 4);
  return segment;
};

const cleanJpeg = (bytes: Uint8Array, orientation: number): { bytes: Uint8Array; preservedOrientation: boolean } => {
  const parts: Uint8Array[] = [bytes.slice(0, 2)];
  let offset = 2;
  let insertedOrientation = false;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error('Malformed JPEG marker sequence.');
    const markerStart = offset;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++]!;
    if (marker === 0xda) {
      if (orientation >= 2 && orientation <= 8 && !insertedOrientation) {
        parts.push(makeOrientationExif(orientation));
        insertedOrientation = true;
      }
      parts.push(bytes.slice(markerStart));
      break;
    }
    if (marker === 0xd9) {
      parts.push(bytes.slice(markerStart, offset));
      break;
    }
    if (marker >= 0xd0 && marker <= 0xd7) {
      parts.push(bytes.slice(markerStart, offset));
      continue;
    }
    if (offset + 2 > bytes.length) throw new Error('Truncated JPEG segment.');
    const length = (bytes[offset]! << 8) | bytes[offset + 1]!;
    const end = offset + length;
    if (length < 2 || end > bytes.length) throw new Error('Unsafe JPEG segment length.');
    const isExifOrXmp = marker === 0xe1;
    const isIptc = marker === 0xed;
    const isComment = marker === 0xfe;
    if (!isExifOrXmp && !isIptc && !isComment) parts.push(bytes.slice(markerStart, end));
    offset = end;
  }
  return { bytes: concatBytes(...parts), preservedOrientation: insertedOrientation };
};

const cleanPng = (bytes: Uint8Array): Uint8Array => {
  const parts: Uint8Array[] = [bytes.slice(0, 8)];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  const drop = new Set(['eXIf', 'tEXt', 'zTXt', 'iTXt', 'tIME']);
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset, false);
    const type = ascii(bytes, offset + 4, 4);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new Error('Unsafe PNG chunk length.');
    if (!drop.has(type)) parts.push(bytes.slice(offset, end));
    offset = end;
    if (type === 'IEND') break;
  }
  return concatBytes(...parts);
};

const cleanWebp = (bytes: Uint8Array): Uint8Array => {
  const chunks: Uint8Array[] = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = ascii(bytes, offset, 4);
    const length = view.getUint32(offset + 4, true);
    const paddedEnd = offset + 8 + length + (length % 2);
    if (paddedEnd > bytes.length) throw new Error('Unsafe WebP chunk length.');
    if (type !== 'EXIF' && type !== 'XMP ') {
      const chunk = bytes.slice(offset, paddedEnd);
      if (type === 'VP8X' && length >= 10) chunk[8] = chunk[8]! & ~0x0c;
      chunks.push(chunk);
    }
    offset = paddedEnd;
  }
  const payload = concatBytes(new TextEncoder().encode('WEBP'), ...chunks);
  return concatBytes(new TextEncoder().encode('RIFF'), writeU32LE(payload.length), payload);
};

export const cleanPrivacyBytes = (input: ArrayBuffer | Uint8Array, fileName: string): CleanResult => {
  const original = input instanceof Uint8Array ? input : new Uint8Array(input);
  const scan = scanBytes(original, fileName);
  if (scan.animated) throw new Error('Animated WebP is not supported for privacy cleaning.');
  let bytes: Uint8Array;
  let preservedOrientation = false;
  if (scan.format === 'jpeg') ({ bytes, preservedOrientation } = cleanJpeg(original, scan.orientation));
  else if (scan.format === 'png') bytes = cleanPng(original);
  else bytes = cleanWebp(original);
  const extension = scan.format === 'jpeg' ? 'jpg' : scan.format;
  const cleanName = `${sanitizeFileStem(fileName)}-clean.${extension}`;
  const verification = scanBytes(bytes, cleanName);
  if (privateFindings(verification).length) throw new Error('Output verification found a remaining private metadata category.');
  return {
    bytes,
    mimeType: scan.mimeType,
    extension,
    mode: 'privacy-clean',
    preservedOrientation,
    pixelDataPreserved: scan.format === 'jpeg',
    verification,
  };
};

export const reportText = (scan: ScanResult): string => {
  const report = buildSafeReport(scan);
  const lines = [
    'Photo Privacy Lab - Clean-copy verification',
    `Verified: ${report.verifiedAt}`,
    `File: ${report.file.name}`,
    `Format: ${report.file.format.toUpperCase()}`,
    `Dimensions: ${report.file.dimensions}`,
    `Result: ${report.result === 'clean' ? 'No supported private metadata found' : 'Attention needed'}`,
    '',
    ...report.checks.map((check) => `${check.category}: ${check.status.replace('-', ' ')} - ${check.note}`),
    '',
    report.limitation,
  ];
  return lines.join('\n');
};

export const buildSafeReport = (scan: ScanResult) => {
  // Imported lazily at module evaluation time would complicate the worker bundle; keep this wrapper explicit.
  const checks = [
    ['GPS coordinates', scan.findings.some((f) => f.id.startsWith('gps'))],
    ['Capture time', scan.findings.some((f) => f.id.startsWith('capture-time') || f.id === 'png-time')],
    ['Device and owner information', scan.findings.some((f) => ['device-model', 'device-serial', 'owner', 'copyright', 'image-id'].includes(f.id))],
    ['Comments and descriptions', scan.findings.some((f) => ['comment', 'user-comment', 'description', 'png-text'].includes(f.id))],
    ['XMP packet', scan.structures.xmp],
    ['IPTC metadata', scan.structures.iptc],
    ['Embedded thumbnail', scan.structures.embeddedThumbnail],
  ] as const;
  const mapped: VerificationReport['checks'] = checks.map(([category, present]) => ({ category, status: present ? 'present' as const : 'not-found' as const, note: present ? 'This category needs attention.' : 'No supported field was found.' }));
  mapped.push({ category: 'Orientation', status: scan.orientation === 1 ? 'not-found' : 'preserved', note: scan.orientation === 1 ? 'No rotation instruction is required.' : 'A minimal display-orientation instruction remains.' });
  mapped.push({ category: 'ICC color profile', status: scan.structures.iccProfile ? 'preserved' : 'not-found', note: scan.structures.iccProfile ? 'Color profile is present.' : 'No ICC profile was found.' });
  return {
    version: 1 as const,
    verifiedAt: new Date().toISOString(),
    file: { name: scan.fileName, format: scan.format, size: scan.size, dimensions: scan.width && scan.height ? `${scan.width} x ${scan.height}` : 'Not reported' },
    checks: mapped,
    result: mapped.some((item) => item.status === 'present') ? 'attention-needed' as const : 'clean' as const,
    limitation: 'This report checks supported hidden-data structures. It does not analyze visible people, text, landmarks, reflections, or context.',
  };
};

export { sanitizeFileStem, makePngChunk };
