import type { GuidePage } from '../data/site';

// Count authored body text at 200 words per minute, rounded up with a one-minute minimum.
// Link labels count as visible text; URLs, source lists and template content do not.
export function readingTime(guide: GuidePage): string {
  const text = [
    guide.intro || '',
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.checklist || []),
      ...(section.table ? [...section.table.headers, ...section.table.rows.flat()] : []),
    ]),
  ].join(' ').replace(/\[([^\]]+)\]\((?:https:\/\/|\/)[^\s)]+\)/g, '$1')
    .replace(/(?:^|\s)\d+\.\s/g, ' ');
  const words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length || 0;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}
