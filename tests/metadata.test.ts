import { describe, expect, it } from 'vitest';
import { assertFileSize, MAX_FILE_BYTES, scanBytes } from '../src/lib/metadata';
import { privateJpeg, privatePng, privateWebp } from './fixtures';

describe('metadata scanning', () => {
  it('classifies private JPEG structures and technical fields', () => {
    const result = scanBytes(privateJpeg(), 'private.jpg');
    expect(result.format).toBe('jpeg');
    expect(result.width).toBe(32);
    expect(result.height).toBe(16);
    expect(result.orientation).toBe(6);
    expect(result.structures.xmp).toBe(true);
    expect(result.structures.iptc).toBe(true);
    expect(result.structures.iccProfile).toBe(true);
    expect(result.findings.map((item) => item.id)).toEqual(expect.arrayContaining(['device-model', 'capture-time', 'owner', 'gps', 'xmp', 'iptc', 'comment', 'icc']));
  });

  it('scans PNG text, dimensions, and ICC profile', () => {
    const result = scanBytes(privatePng(), 'private.png');
    expect(result.format).toBe('png');
    expect([result.width, result.height]).toEqual([2, 3]);
    expect(result.findings.map((item) => item.id)).toEqual(expect.arrayContaining(['png-text', 'icc']));
  });

  it('scans WebP EXIF and XMP chunks', () => {
    const result = scanBytes(privateWebp(), 'private.webp');
    expect(result.format).toBe('webp');
    expect(result.structures.exif).toBe(true);
    expect(result.structures.xmp).toBe(true);
    expect(result.orientation).toBe(6);
  });

  it('enforces an exact 100 MB per-file ceiling', () => {
    expect(MAX_FILE_BYTES).toBe(100_000_000);
    expect(() => assertFileSize(MAX_FILE_BYTES)).not.toThrow();
    expect(() => assertFileSize(MAX_FILE_BYTES + 1)).toThrow(/100 MB/);
  });

  it('rejects unsupported signatures', () => {
    expect(() => scanBytes(new Uint8Array([1, 2, 3]), 'bad.bin')).toThrow(/Unsupported/);
  });
});
