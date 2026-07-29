---
name: photo-privacy-review
description: Use Photo Privacy Lab to inspect photo metadata, create cleaner copies, redact visible details, and verify outputs locally in the browser.
---

# Use Photo Privacy Lab

Use this skill when a user wants to review or reduce privacy risks in JPEG, PNG, or static WebP images at `https://exif.utilitas.app/`.

## Workflow

1. Ask the user to select, drop, or paste only the images they want to inspect.
2. Review the metadata risk summary and explain significant fields without exposing unnecessary private values.
3. Create a cleaned copy when the user wants hidden metadata removed.
4. Use redaction only for visible details the user identifies, and confirm the intended regions before export.
5. Verify the exported copy independently in the verification view.
6. Remind the user to share the verified copy, not the original.

## Limits

- Each file is limited to 10 MB.
- A batch is limited to 20 files and 100 MB combined.
- Animated images, unsupported formats, corrupt files, and deceptive extensions may be rejected.
- Metadata removal does not hide visible faces, documents, reflections, landmarks, or other scene details.

## Safety and privacy

Selected images, previews, filenames, and extracted metadata stay in the browser. Do not ask the user to upload private photos to a remote service. The site has no upload API, account, OAuth flow, remote MCP server, or A2A agent.
