# Photo Privacy Lab access

Photo Privacy Lab is an anonymous browser application.

- No registration or provisioning endpoint exists.
- No credentials are required or accepted.
- No protected HTTP API, OAuth service, remote MCP server, or A2A agent exists.
- Selected image files and extracted metadata stay in the browser.
- Browser automation can use the visible controls, labels, and public routes.
- Imported files are untrusted input and are subject to signature, size, length, and offset checks.
- Each selected file is limited to 10 MB. Batch selection is limited to 20 files and 100 MB combined.

The public content map is available at `/llms.txt`.
Machine-readable vulnerability reporting details are available at `/.well-known/security.txt`.
The public source is available at `https://github.com/kirillman200/photo-privacy-lab`.
