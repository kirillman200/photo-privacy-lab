import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { indexablePaths, SITE_URL } from '../src/data/site';

const dist = join(process.cwd(), 'dist');
const fileFor = (path: string) => path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');

describe('built public site contract', () => {
  it('builds every canonical route with unique metadata and one visible H1', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of indexablePaths) {
      const file = fileFor(path);
      expect(existsSync(file), `${path} is missing`).toBe(true);
      const html = readFileSync(file, 'utf8');
      const title = html.match(/<title>(.*?)<\/title>/)?.[1];
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
      expect(titles.has(title!)).toBe(false);
      expect(descriptions.has(description!)).toBe(false);
      titles.add(title!);
      descriptions.add(description!);
      expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
      expect(html).toContain(`rel="canonical" href="${new URL(path, SITE_URL).href}"`);
      for (const block of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) expect(() => JSON.parse(block[1]!)).not.toThrow();
    }
  });

  it('keeps sitemap, robots, and llms content synchronized with the route inventory', () => {
    const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
    const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
    const llms = readFileSync(join(dist, 'llms.txt'), 'utf8');
    for (const path of indexablePaths) expect(sitemap).toContain(new URL(path, SITE_URL).href);
    expect((sitemap.match(/<url>/g) || []).length).toBe(indexablePaths.length);
    expect(robots).toContain(new URL('/sitemap.xml', SITE_URL).href);
    expect(llms).toContain('There is no account, protected HTTP API, OAuth service, remote MCP server, or A2A agent.');
    expect(llms).toContain('Each selected file is limited to 100 MB');
    expect(SITE_URL).toBe('https://exif.utilitas.app');
    expect(sitemap).not.toContain('workers.dev');
  });

  it('ships security headers, a true 404 asset, social media assets, and raster icons', () => {
    const headers = readFileSync(join(dist, '_headers'), 'utf8');
    expect(headers).toContain('Strict-Transport-Security: max-age=31536000');
    const worker = readFileSync(join(process.cwd(), 'worker', 'index.js'), 'utf8');
    expect(worker).toContain("'strict-dynamic'");
    expect(worker).toContain("frame-ancestors 'none'");
    expect(worker).toContain("element.setAttribute('nonce', nonce)");
    for (const file of ['404.html', 'ads.txt', 'og.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest', '.well-known/security.txt']) expect(existsSync(join(dist, file)), file).toBe(true);
    expect(readFileSync(join(dist, 'ads.txt'), 'utf8').trim()).toBe('google.com, pub-7469113252837951, DIRECT, f08c47fec0942fa0');
    const homepage = readFileSync(join(dist, 'index.html'), 'utf8');
    expect(homepage).toContain('<meta name="google-adsense-account" content="ca-pub-7469113252837951">');
    expect(homepage).toContain('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7469113252837951');
    expect(homepage).toContain('crossorigin="anonymous"');
  });

  it('does not deploy source, tests, secrets, documentation, or source maps', () => {
    for (const forbidden of ['src', 'tests', '.git', '.env', 'package.json', 'PROJECT_CONTRACT.md', 'SECURITY.md']) expect(existsSync(join(dist, forbidden))).toBe(false);
    const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
    expect(walk(dist).some((file) => file.endsWith('.map'))).toBe(false);
  });
});
