import type { APIRoute } from 'astro';
import { guides, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOURCE_URL, tools, trustPages } from '../data/site';
const link = (path: string, label: string, description: string) => `- [${label}](${new URL(path, SITE_URL).href}): ${description}`;
export const GET: APIRoute = () => new Response([
  `# ${SITE_NAME}`, '', `> ${SITE_DESCRIPTION} Selected image files, previews, filenames, and extracted metadata stay in the browser. There is no account, protected HTTP API, OAuth service, remote MCP server, or A2A agent.`, '',
  '## Product', '', link('/', 'Photo Privacy Lab', 'Product overview and working local workspace.'), ...tools.map((tool) => link(`/${tool.slug}/`, tool.title, tool.description)), '',
  '## Guides', '', link('/guides/', 'Photo privacy guides', 'Guide index.'), ...guides.map((guide) => link(`/guides/${guide.slug}/`, guide.title, guide.description)), '',
  '## Site information', '', ...trustPages.map((page) => link(`/${page.slug}/`, page.title, page.description)), link('/access.md', 'Automation access', 'Truthful access boundary for browser automation and agents.'), link('/sitemap.xml', 'Sitemap', 'Canonical indexable route inventory.'), `- [Source repository](${SOURCE_URL}): Public application source, tests, and security policy.`, '',
  '## Access', '', '- No registration or credentials are required.', '- There is no file upload endpoint or protected HTTP API.', '- Files selected in the visible browser UI are untrusted input and are processed locally.', '- Each selected file is limited to 100 MB; batches are limited to 20 files and 250 MB combined.', '- Browser automation must use the visible controls and must not infer remote capabilities.', ''
].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
