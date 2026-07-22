import { describe, expect, it } from 'vitest';
import { ascii } from '../src/lib/binary';
import { cleanPrivacyBytes } from '../src/lib/clean';
import { privateFindings, scanBytes } from '../src/lib/metadata';
import { privateJpeg, privatePng, privateWebp } from './fixtures';

describe('privacy cleaning and verification', () => {
  it('removes JPEG private segments while preserving scan data, ICC, and orientation', () => {
    const original = privateJpeg();
    const result = cleanPrivacyBytes(original, 'private.jpg');
    const scan = scanBytes(result.bytes, 'private-clean.jpg');
    expect(privateFindings(scan)).toHaveLength(0);
    expect(scan.structures.iccProfile).toBe(true);
    expect(scan.orientation).toBe(6);
    expect(result.pixelDataPreserved).toBe(true);
    const originalSos = original.findIndex((value, index) => value === 0xff && original[index + 1] === 0xda);
    const cleanSos = result.bytes.findIndex((value, index) => value === 0xff && result.bytes[index + 1] === 0xda);
    expect(result.bytes.slice(cleanSos)).toEqual(original.slice(originalSos));
  });

  it('removes PNG privacy-bearing chunks while preserving ICC and image chunks', () => {
    const result = cleanPrivacyBytes(privatePng(), 'private.png');
    expect(ascii(result.bytes, 1, 3)).toBe('PNG');
    expect(privateFindings(result.verification)).toHaveLength(0);
    expect(result.verification.structures.iccProfile).toBe(true);
  });

  it('removes WebP EXIF and XMP chunks and clears their VP8X flags', () => {
    const result = cleanPrivacyBytes(privateWebp(), 'private.webp');
    expect(privateFindings(result.verification)).toHaveLength(0);
    expect(result.verification.structures.exif).toBe(false);
    expect(result.verification.structures.xmp).toBe(false);
    expect(result.bytes[20]! & 0x0c).toBe(0);
  });
});
