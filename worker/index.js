import {
  CONTENT_SIGNAL,
  HOMEPAGE_DISCOVERY_LINKS,
  acceptsMarkdown,
  appendVary,
  createMarkdownResponse,
} from './agent-discovery.ts';

function createNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

function contentSecurityPolicy(nonce) {
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "worker-src 'self' blob:",
    "frame-src https:",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

const SECURITY_TXT_PATH = '/.well-known/security.txt';

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const headers = new Headers(response.headers);
    headers.set('Content-Signal', CONTENT_SIGNAL);
    if (url.pathname === '/' || url.pathname === '/index.html') {
      headers.set('Link', HOMEPAGE_DISCOVERY_LINKS);
    }

    if (url.pathname === SECURITY_TXT_PATH) {
      headers.set('Content-Type', 'text/plain; charset=utf-8');
    }
    if (url.pathname.endsWith('.md')) {
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
    }

    const contentType = headers.get('Content-Type') || '';
    if (!contentType.includes('text/html')) {
      return new Response(request.method === 'HEAD' ? null : response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    appendVary(headers, 'Accept');
    if (acceptsMarkdown(request.headers.get('Accept') || '')) {
      return createMarkdownResponse(response, headers, await response.text(), request.method);
    }

    const nonce = createNonce();
    headers.set('Content-Security-Policy', contentSecurityPolicy(nonce));
    const securedResponse = new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    if (request.method === 'HEAD' || !securedResponse.body) return securedResponse;

    return new HTMLRewriter()
      .on('script', {
        element(element) {
          element.setAttribute('nonce', nonce);
        },
      })
      .transform(securedResponse);
  },
};
