# Photo Privacy Lab

A browser-local photo-sharing safety workflow built with Astro, Vue, TypeScript, Vitest, Playwright, and Cloudflare Workers Static Assets.

[Live app](https://exif.utilitas.app) | [Security policy](SECURITY.md)

No environment variables, runtime secrets, database credentials, or browser-exposed API keys are required. The public AdSense publisher ID is committed in the page metadata, loader URL, and `ads.txt` by design.

## What works

- JPEG, PNG, and static WebP privacy scanning
- Risk-based GPS, device, time, owner, comment, XMP, IPTC, preview, orientation, ICC, and PNG C2PA container reporting
- JPEG compressed-data-preserving privacy cleaning
- PNG and static WebP metadata-chunk cleaning, including PNG C2PA `caBX` removal
- Fresh flattened exports and a manual redaction canvas
- Independent output rescanning with safe text and JSON reports
- Sequential background-worker batch cleaning with ZIP export
- Exact 10 MB per-file limit, with 20 files and 100 MB combined per batch
- Six materially distinct tool routes, twelve guides, and trust pages

## Local development

```powershell
npm install
npm run dev
```

Run the full local contract:

```powershell
npm run validate
npm run test:e2e
npm run deploy:dry
```

## Deployment

The generated `dist/` directory and `worker/index.js` response-security layer are deployed. The production origin and Cloudflare custom domain are declared in source as `https://exif.utilitas.app`. Authenticate Wrangler and run `npm run deploy`. A local build or Git commit is not a deployment.

After deployment, verify headers, the custom 404 status, representative desktop and mobile routes, private-path failures, sitemap URLs, and the no-image-network-request browser test against the live origin.

The production deploy command also verifies the public IndexNow ownership key and submits every canonical URL from the generated sitemap. Run `npm run indexnow:preview` to inspect the payload without making a network request. Run `npm run indexnow:send` to notify IndexNow again after an already-published content change.

The production configuration disables `workers.dev` and preview URLs so search engines see one canonical public origin.

## Important limitations

Metadata verification does not analyze visible people, text, addresses, landmarks, reflections, or posting context. High-risk use needs an appropriate threat model and independent review. See `/limitations/` and `/methodology/`.
