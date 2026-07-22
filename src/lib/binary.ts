export const ascii = (bytes: Uint8Array, start: number, length: number): string =>
  String.fromCharCode(...bytes.subarray(start, start + length));

export const concatBytes = (...parts: Uint8Array[]): Uint8Array => {
  const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
};

export const readU16 = (view: DataView, offset: number, little = false): number => {
  if (offset < 0 || offset + 2 > view.byteLength) throw new Error('Unsafe 16-bit offset');
  return view.getUint16(offset, little);
};

export const readU32 = (view: DataView, offset: number, little = false): number => {
  if (offset < 0 || offset + 4 > view.byteLength) throw new Error('Unsafe 32-bit offset');
  return view.getUint32(offset, little);
};

export const writeU32LE = (value: number): Uint8Array => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, true);
  return bytes;
};

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

export const makePngChunk = (type: string, data: Uint8Array): Uint8Array => {
  const typeBytes = new TextEncoder().encode(type);
  const output = new Uint8Array(12 + data.length);
  const view = new DataView(output.buffer);
  view.setUint32(0, data.length, false);
  output.set(typeBytes, 4);
  output.set(data, 8);
  view.setUint32(8 + data.length, crc32(concatBytes(typeBytes, data)), false);
  return output;
};

export const sanitizeFileStem = (name: string): string => {
  const stem = name.replace(/\.[^.]+$/, '').normalize('NFKC');
  const safe = stem.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[.-]+|[.-]+$/g, '').slice(0, 80);
  return safe || 'photo';
};
