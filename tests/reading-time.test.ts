import { describe, expect, it } from 'vitest';
import { guides, type GuidePage } from '../src/data/site';
import { readingTime } from '../src/lib/reading-time';

const guide = (paragraph: string): GuidePage => ({
  slug: 'example', title: 'Title', description: 'Description', audience: 'Audience',
  sections: [{ heading: '', paragraphs: [paragraph] }],
});

describe('guide reading time', () => {
  it('rounds 200-word boundaries up and has a one-minute minimum', () => {
    expect(readingTime(guide(''))).toBe('1 min');
    expect(readingTime(guide(Array(200).fill('word').join(' ')))).toBe('1 min');
    expect(readingTime(guide(Array(201).fill('word').join(' ')))).toBe('2 min');
  });
  it('counts visible body labels and table and checklist text, not link URLs or template fields', () => {
    const item = guide(Array(198).fill('word').join(' '));
    item.title = Array(500).fill('ignored').join(' ');
    item.sections[0].paragraphs.push('[one](https://example.com/two/three)');
    item.sections[0].checklist = ['one'];
    expect(readingTime(item)).toBe('1 min');
    item.sections[0].table = { afterParagraph: 0, headers: ['one'], rows: [] };
    expect(readingTime(item)).toBe('2 min');
  });
  it('distinguishes a short audited guide from an expanded guide', () => {
    expect(readingTime(guides.find((item) => item.slug === 'photo-sharing-checklist-for-parents')!)).toBe('1 min');
    expect(Number.parseInt(readingTime(guides.find((item) => item.slug === 'metadata-removal-reverse-image-search')!))).toBeGreaterThan(1);
  });
});
