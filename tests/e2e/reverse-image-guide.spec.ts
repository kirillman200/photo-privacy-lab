import { expect, test } from '@playwright/test';

test('reverse image guide keeps the decision table accessible without widening the page', async ({ page }) => {
  await page.goto('/guides/metadata-removal-reverse-image-search/');
  await expect(page).toHaveTitle('Does Removing Metadata Stop Reverse Image Search? No');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://exif.utilitas.app/guides/metadata-removal-reverse-image-search/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Does removing metadata stop reverse image search?');
  const region = page.getByRole('region', { name: 'Which part of the sharing risk should you change?' });
  await expect(region.getByRole('columnheader')).toHaveCount(3);
  await expect(region.getByRole('rowheader')).toHaveText(['Embedded data', 'Visible clues', 'Already-public copies', 'Sharing audience']);
  await region.focus();
  await expect(region).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('.guide-prose ol li')).toHaveCount(4);
  for (const link of await page.locator('.guide-prose a[href^="/"]').all()) {
    const response = await page.request.get((await link.getAttribute('href'))!);
    expect(response.status()).toBe(200);
  }
  await page.goto('/guides/what-photo-metadata-can-reveal/');
  await page.getByRole('link', { name: 'whether removing metadata stops reverse image search', exact: true }).click();
  await expect(page).toHaveURL(/\/guides\/metadata-removal-reverse-image-search\/$/);
});
