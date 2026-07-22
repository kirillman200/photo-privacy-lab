import { expect, test } from '@playwright/test';
import { privateJpeg } from '../fixtures';

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
