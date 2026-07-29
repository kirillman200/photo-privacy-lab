import { describe, expect, it } from 'vitest';
import {
  CONTENT_SIGNAL,
  HOMEPAGE_DISCOVERY_LINKS,
  acceptsMarkdown,
  createMarkdownResponse,
  htmlToMarkdown,
} from '../worker/agent-discovery';

const homepage = `<!doctype html>
  <html>
    <head>
      <title>Photo &amp; Test</title>
      <meta name="description" content="A privacy test page.">
      <script>throw new Error("must not be included")</script>
    </head>
    <body><main><h1>Photo review</h1><p>Read the <a href="/access.md">access guide</a>.</p></main></body>
  </html>`;

describe('agent discovery helpers', () => {
  it('negotiates Markdown media ranges', () => {
    expect(acceptsMarkdown('text/markdown')).toBe(true);
    expect(acceptsMarkdown('text/html, text/markdown; q=0.8')).toBe(true);
    expect(acceptsMarkdown('text/markdown;q=0')).toBe(false);
    expect(acceptsMarkdown('text/html')).toBe(false);
  });

  it('converts useful HTML structure without executable content', () => {
    const markdown = htmlToMarkdown(homepage);
    expect(markdown).toMatch(/^# Photo & Test$/m);
    expect(markdown).toMatch(/^> A privacy test page\.$/m);
    expect(markdown).toMatch(/^# Photo review$/m);
    expect(markdown).toContain('[access guide](/access.md)');
    expect(markdown).not.toContain('must not be included');
  });

  it('creates a Markdown response with token and cache variant headers', async () => {
    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      ETag: '"homepage"',
      Link: HOMEPAGE_DISCOVERY_LINKS,
      'Content-Signal': CONTENT_SIGNAL,
    });
    const response = createMarkdownResponse(
      new Response(homepage, { headers }),
      headers,
      homepage,
      'GET',
    );

    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept');
    expect(response.headers.get('ETag')).toBeNull();
    expect(response.headers.get('Link')).toContain('rel="service-doc"');
    expect(response.headers.get('Link')).toContain('/.well-known/agent-skills/index.json');
    expect(response.headers.get('Content-Signal')).toBe(
      'ai-train=no, search=yes, ai-input=yes',
    );
    expect(response.headers.get('x-markdown-tokens')).toMatch(/^\d+$/);
    expect(await response.text()).toMatch(/^# Photo & Test$/m);
  });
});
