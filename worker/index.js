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

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) return response;

    const nonce = createNonce();
    const securedResponse = new Response(response.body, response);
    securedResponse.headers.set('Content-Security-Policy', contentSecurityPolicy(nonce));

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
