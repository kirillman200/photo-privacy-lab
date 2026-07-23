# Photo Privacy Lab project contract

## Production origin

The canonical origin is `https://exif.utilitas.app`. The entire build uses this one HTTPS origin, and alternate Workers preview origins are disabled.

## Product promise

Photo Privacy Lab helps people inspect hidden photo risks, clean metadata, redact visible information, and verify the exact exported copy without transmitting selected image files or extracted metadata.

## Public boundary

The generated `dist/` directory and the small `worker/index.js` response-security layer are deployed. The static assets contain generated application pages, guides, trust pages, hashed application assets, discovery files, raster icons, the social card, security headers, and the custom 404 page. The Worker adds a fresh content security policy nonce to each HTML response and does not expose an application API.

The repository root, source, tests, local environment files, package caches, deployment state, and documentation outside `public/` are not deployed.

## Data boundary

- Selected image bytes, previews, filenames, parsed values, redaction geometry, clean copies, and reports stay in the browser.
- The static host receives ordinary page and asset requests. It does not receive selected image files.
- Google AdSense is loaded for advertising and may receive ordinary browser, page, and request information. Selected image bytes, previews, filenames, parsed values, redaction geometry, clean copies, and reports are never supplied to it.
- No first-party analytics, support, map, or error-reporting script is loaded.
- Opening OpenStreetMap is a separate, explicit user action with a warning.

## Untrusted inputs and limits

- JPEG, PNG, and static WebP only, confirmed by file signatures.
- 10 MB per file, 20 files per batch, and 100 MB total per batch.
- JPEG segment lengths, PNG chunk lengths, WebP chunk lengths, TIFF offsets, entry counts, and value counts are bounded before reads.
- Animated WebP is scanned but rejected for cleaning.

## Real capabilities

- Local metadata scanning and risk classification
- Lossless JPEG privacy cleaning with minimal orientation preservation
- PNG and static WebP privacy-bearing chunk removal
- Full flattening and visual redaction
- Output rescanning and privacy-safe text or JSON reports
- Background browser worker batch processing and ZIP export

## Unsupported capabilities

There is no account, database, upload endpoint, remote image processor, public API, OAuth service, MCP server, A2A agent, automatic face detection, automatic license plate detection, HEIC support, video support, or document support.

## Agent maturity

Level 1 only: semantic HTML, stable URLs, accessible controls, `llms.txt`, and a truthful access document. No remote or browser-native agent tool is advertised.
