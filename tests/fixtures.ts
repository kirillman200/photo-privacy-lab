import { concatBytes, makePngChunk, writeU32LE } from '../src/lib/binary';

const marker = (code: number, payload: Uint8Array): Uint8Array => {
  const output = new Uint8Array(payload.length + 4);
  output.set([0xff, code]);
  new DataView(output.buffer).setUint16(2, payload.length + 2, false);
  output.set(payload, 4);
  return output;
};

const text = (value: string) => new TextEncoder().encode(value);

const buildTiff = (): Uint8Array => {
  const model = text('Phone Test\0');
  const date = text('2026:07:18 20:42:00\0');
  const owner = text('Ava\0');
  const entryCount = 5;
  const valuesStart = 8 + 2 + entryCount * 12 + 4;
  const gpsOffset = valuesStart + model.length + date.length + owner.length;
  const output = new Uint8Array(gpsOffset + 6);
  const view = new DataView(output.buffer);
  output.set(text('II'), 0);
  view.setUint16(2, 42, true);
  view.setUint32(4, 8, true);
  view.setUint16(8, entryCount, true);
  const writeEntry = (index: number, tag: number, type: number, count: number, value: number) => {
    const offset = 10 + index * 12;
    view.setUint16(offset, tag, true);
    view.setUint16(offset + 2, type, true);
    view.setUint32(offset + 4, count, true);
    if (type === 3 && count === 1) view.setUint16(offset + 8, value, true); else view.setUint32(offset + 8, value, true);
  };
  writeEntry(0, 0x0110, 2, model.length, valuesStart);
  writeEntry(1, 0x0112, 3, 1, 6);
  writeEntry(2, 0x0132, 2, date.length, valuesStart + model.length);
  writeEntry(3, 0x013b, 2, owner.length, valuesStart + model.length + date.length);
  writeEntry(4, 0x8825, 4, 1, gpsOffset);
  view.setUint32(10 + entryCount * 12, 0, true);
  output.set(model, valuesStart);
  output.set(date, valuesStart + model.length);
  output.set(owner, valuesStart + model.length + date.length);
  view.setUint16(gpsOffset, 0, true);
  view.setUint32(gpsOffset + 2, 0, true);
  return output;
};

export const privateJpeg = (): Uint8Array => {
  const exif = marker(0xe1, concatBytes(text('Exif\0\0'), buildTiff()));
  const xmp = marker(0xe1, text('http://ns.adobe.com/xap/1.0/\0<x:xmpmeta>home</x:xmpmeta>'));
  const iptc = marker(0xed, text('Photoshop 3.0\0private caption'));
  const icc = marker(0xe2, text('ICC_PROFILE\0display-p3'));
  const comment = marker(0xfe, text('Meet at my home'));
  const sof = marker(0xc0, new Uint8Array([8, 0, 16, 0, 32, 3, 1, 0x11, 0, 2, 0x11, 0, 3, 0x11, 0]));
  const sosPayload = new Uint8Array([3, 1, 0, 2, 0, 3, 0, 0, 63, 0]);
  const sos = marker(0xda, sosPayload);
  return concatBytes(new Uint8Array([0xff, 0xd8]), exif, xmp, iptc, icc, comment, sof, sos, new Uint8Array([0x13, 0x37, 0x42, 0xff, 0xd9]));
};

export const privatePng = (): Uint8Array => {
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, 2, false);
  view.setUint32(4, 3, false);
  ihdr.set([8, 6, 0, 0, 0], 8);
  return concatBytes(signature, makePngChunk('IHDR', ihdr), makePngChunk('tEXt', text('Location\0Home')), makePngChunk('iCCP', text('Display P3\0')), makePngChunk('IDAT', new Uint8Array([1, 2, 3])), makePngChunk('IEND', new Uint8Array()));
};

const webpChunk = (type: string, payload: Uint8Array) => {
  const padding = payload.length % 2 ? new Uint8Array([0]) : new Uint8Array();
  return concatBytes(text(type), writeU32LE(payload.length), payload, padding);
};

export const privateWebp = (): Uint8Array => {
  const vp8x = new Uint8Array(10);
  vp8x[0] = 0x0c;
  vp8x[4] = 1;
  vp8x[7] = 2;
  const payload = concatBytes(text('WEBP'), webpChunk('VP8X', vp8x), webpChunk('EXIF', buildTiff()), webpChunk('XMP ', text('<xmp>private</xmp>')), webpChunk('VP8 ', new Uint8Array([1, 2, 3, 4])));
  return concatBytes(text('RIFF'), writeU32LE(payload.length), payload);
};
