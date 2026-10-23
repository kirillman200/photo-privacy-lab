import JSZip from 'jszip';
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { privateJpeg } from '../fixtures';
import { cleanPrivacyBytes } from '../../src/lib/clean';

test('selection, scanning, cleaning, and verification do not transmit file-derived data', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.method()} ${request.url()} ${request.postData() || ''}`));
  await page.goto('/photo-privacy-check/');
  await expect(page.getByTestId('privacy-workbench')).toHaveAttribute('data-ready', 'true');
  requests.length = 0;
  await page.getByTestId('photo-input').setInputFiles({ name: 'private-home-photo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(privateJpeg()) });
  await expect(page.getByRole('status')).toContainText('Privacy scan complete');
  await expect(page.getByText('GPS metadata')).toBeVisible();
  await page.getByRole('button', { name: 'Privacy Clean' }).click();
  await expect(page.getByRole('status')).toContainText('ready to download');
  await expect(page.getByText('Checked categories are clean')).toBeVisible();
  const joined = requests.join('\n');
  expect(joined).not.toContain('private-home-photo.jpg');
  expect(joined).not.toContain('Phone Test');
  expect(joined).not.toContain('Meet at my home');
});

test('representative mobile navigation exposes all primary tools', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only navigation check');
  await page.goto('/guides/redact-a-screenshot-safely/');
  await page.getByText('Menu', { exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByText('Privacy check')).toBeVisible();
  await expect(page.locator('h1')).toContainText('How to redact a screenshot safely');
});

test('content pages do not hydrate the image application', async ({ page }) => {
  await page.goto('/guides/what-photo-metadata-can-reveal/');
  await expect(page.locator('h1')).toContainText('What information can photo metadata reveal?');
  await expect(page.getByTestId('photo-input')).toHaveCount(0);
});


test('batch ZIP preserves every photo when cleaned filenames collide', async ({ page }) => {
  await page.goto('/batch-metadata-remover/');
  // Punctuation creates a collision after sanitization as well as duplicate names.
  const inputs = [0, 1, 2, 3].map((value) => {
    const bytes = privateJpeg();
    bytes[bytes.length - 3] = value;
    return bytes;
  });
  await page.locator('input[type="file"][multiple]').setInputFiles(
    ['photo.jpg', 'photo.jpg', 'photo!.jpg', 'photo-clean-2.jpg'].map((name, index) => ({
      name, mimeType: 'image/jpeg', buffer: Buffer.from(inputs[index]!),
    })),
  );
  await page.getByRole('button', { name: 'Clean batch', exact: true }).click();
  const link = page.getByRole('link', { name: 'Download ZIP (4)', exact: true });
  await expect(link).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await link.click();
  const download = await downloadPromise;
  const zip = await JSZip.loadAsync(await readFile((await download.path())!));
  const photos = Object.keys(zip.files).filter((name) => name.endsWith('.jpg'));
  expect(photos).toHaveLength(4);
  const actual: string[] = [];
  for (const name of photos) {
    const bytes = await zip.file(name)!.async('uint8array');
    actual.push(Buffer.from(bytes).toString('base64'));
    expect(bytes.length).toBeGreaterThan(0);
    expect(new TextDecoder().decode(bytes)).not.toContain('Meet at my home');
  }
  expect(actual.sort()).toEqual(inputs.map((bytes) => Buffer.from(cleanPrivacyBytes(bytes, 'photo.jpg').bytes).toString('base64')).sort());
  const report = JSON.parse(await zip.file('photo-privacy-verification.json')!.async('string'));
  expect(report.files).toHaveLength(4);
  expect(report.files.every((file: { status: string }) => file.status === 'done')).toBe(true);
});
