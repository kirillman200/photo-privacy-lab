export const CONTENT_SIGNAL = 'ai-train=no, search=yes, ai-input=yes';

export const HOMEPAGE_DISCOVERY_LINKS = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</access.md>; rel="service-doc"; type="text/markdown"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
].join(', ');

export function acceptsMarkdown(acceptHeader = '') {
  return acceptHeader
    .split(',')
    .map((range) => range.trim().toLowerCase())
    .some((range) => {
      const [mediaType, ...parameters] = range.split(';').map((value) => value.trim());
      if (mediaType !== 'text/markdown') return false;
      const quality = parameters.find((parameter) => parameter.startsWith('q='));
      return !quality || Number.parseFloat(quality.slice(2)) > 0;
    });
}

function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#') return named[code.toLowerCase()] ?? entity;
    const radix = code[1]?.toLowerCase() === 'x' ? 16 : 10;
    const digits = radix === 16 ? code.slice(2) : code.slice(1);
    const point = Number.parseInt(digits, radix);
    return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
  });
}

function plainText(fragment: string) {
  return decodeHtmlEntities(fragment.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
}

export function htmlToMarkdown(html: string) {
  const title = plainText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = decodeHtmlEntities(
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || '',
  );
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;

  let markdown = body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|template|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const text = plainText(label);
      return text ? `[${text}](${href})` : '';
    })
    .replace(
      /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
      (_, level, text) => `\n${'#'.repeat(Number(level))} ${plainText(text)}\n`,
    )
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${plainText(text)}`)
    .replace(
      /<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi,
      (_, _tag, text) => `**${plainText(text)}**`,
    )
    .replace(
      /<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi,
      (_, _tag, text) => `*${plainText(text)}*`,
    )
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, text) => `\`${plainText(text)}\``)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\b[^>]*>/gi, '\n---\n')
    .replace(
      /<\/(p|div|section|article|main|nav|aside|header|footer|details|summary|ul|ol|table|tr)>/gi,
      '\n',
    )
    .replace(/<[^>]+>/g, '');

  markdown = decodeHtmlEntities(markdown)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const preamble = [title && `# ${title}`, description && `> ${description}`]
    .filter(Boolean)
    .join('\n\n');
  return `${preamble}${preamble && markdown ? '\n\n' : ''}${markdown}\n`;
}

export function appendVary(headers: Headers, value: string) {
  const values = (headers.get('Vary') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (!values.some((item) => item.toLowerCase() === value.toLowerCase())) values.push(value);
  headers.set('Vary', values.join(', '));
}

export function createMarkdownResponse(
  response: Response,
  headers: Headers,
  html: string,
  method: string,
) {
  const markdown = htmlToMarkdown(html);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('x-markdown-tokens', String(Math.ceil(markdown.length / 4)));
  headers.set('x-original-tokens', String(Math.ceil(html.length / 4)));
  appendVary(headers, 'Accept');
  for (const name of [
    'Content-Encoding',
    'Content-Length',
    'Content-Range',
    'ETag',
    'Last-Modified',
    'Transfer-Encoding',
  ]) {
    headers.delete(name);
  }
  return new Response(method === 'HEAD' ? null : markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
