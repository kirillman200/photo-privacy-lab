import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const host = '127.0.0.1';
const port = 4321;
const dist = resolve(process.cwd(), 'dist');
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
};

const publicFile = (urlPath) => {
  const cleanPath = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^([/\\])+/, '');
  const requested = resolve(dist, cleanPath || 'index.html');
  if (requested !== dist && !requested.startsWith(`${dist}\\`) && !requested.startsWith(`${dist}/`)) return null;
  if (existsSync(requested) && statSync(requested).isFile()) return requested;
  const indexFile = join(requested, 'index.html');
  return existsSync(indexFile) && statSync(indexFile).isFile() ? indexFile : null;
};

const server = createServer((request, response) => {
  const file = publicFile(request.url || '/');
  const target = file || join(dist, '404.html');
  response.writeHead(file ? 200 : 404, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  response.end(readFileSync(target));
});

server.listen(port, host);
const close = () => server.close(() => process.exit(0));
process.on('SIGINT', close);
process.on('SIGTERM', close);
