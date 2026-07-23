# Security policy

## Supported version

The current default branch is supported. The project has not been publicly deployed from this checkout.

## Report a vulnerability

Do not attach a real private photograph, GPS coordinate, owner field, access token, or other secret to an issue. Use a synthetic fixture and describe the browser, format, approximate size, steps, expected behavior, observed behavior, and security impact.

Use [GitHub private vulnerability reporting](https://github.com/kirillman200/photo-privacy-lab/security/advisories/new) for sensitive reports. Do not publish exploit details in a public issue.

Machine-readable reporting details are published at `https://exif.utilitas.app/.well-known/security.txt` in the RFC 9116 format.

## Security boundary

The application is static and browser-local. Only `dist/` is deployable. There is no file-upload endpoint, image-processing server, account system, database, or secret required by the browser application.

Imported files are untrusted. Parsers enforce signatures, an exact 10 MB per-file ceiling, segment or chunk boundaries, TIFF offset checks, and bounded counts. Unsafe and unsupported files fail without an output download.

## Launch checks

After deployment, verify the canonical HTTPS origin, real 404 status, security headers, content security policy behavior, representative public pages, and failures for `/.git/`, `/.env`, `/package.json`, `/tests/`, `/src/`, and source maps.
