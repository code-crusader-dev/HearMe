import { describe, expect, it } from 'vitest';
import { buildTextToSignSequence, mergeCategories, seedCategories, seedClips, seedLibrary, seedSources, youtubeId } from './App.jsx';

describe('HearMe seeded content', () => {
  it('ships the requested starter ISL library', () => {
    expect(seedLibrary).toHaveLength(51);
    expect(seedLibrary.filter((item) => item.category === 'Alphabet')).toHaveLength(26);
    expect(seedLibrary.filter((item) => item.category === 'Numbers')).toHaveLength(10);
    expect(seedLibrary.filter((item) => item.category === 'Phrases')).toHaveLength(15);
  });

  it('ships starter source videos', () => {
    expect(seedSources).toHaveLength(3);
    expect(seedSources.every((source) => youtubeId(source.url))).toBe(true);
  });

  it('ships starter sentence clips', () => {
    expect(seedClips.map((clip) => clip.phrase)).toContain('How are you');
    expect(seedClips.map((clip) => clip.phrase)).toContain("What's up");
  });

  it('ships editable starter categories', () => {
    expect(seedCategories).toEqual(['Alphabet', 'Numbers', 'Phrases']);
  });
});

describe('YouTube URL parsing', () => {
  it('supports common YouTube URL shapes', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=abc123')).toBe('abc123');
    expect(youtubeId('https://youtu.be/xyz789')).toBe('xyz789');
    expect(youtubeId('https://www.youtube.com/embed/embed123')).toBe('embed123');
    expect(youtubeId('https://www.youtube.com/shorts/short123')).toBe('short123');
  });

  it('returns an empty id for unsupported links', () => {
    expect(youtubeId('https://example.com/video')).toBe('');
  });
});

describe('Category helpers', () => {
  it('merges, trims, and deduplicates category names', () => {
    expect(mergeCategories(['Alphabet', ' Numbers '], ['Alphabet', '', 'Custom'])).toEqual(['Alphabet', 'Numbers', 'Custom']);
  });
});

describe('Text-to-Sign resolution', () => {
  it('matches sentence clips before single-word signs', () => {
    const sequence = buildTextToSignSequence('How are you', seedClips, seedLibrary);
    expect(sequence).toHaveLength(1);
    expect(sequence[0].matchedBy).toBe('clip-gallery');
    expect(sequence[0].term).toBe('How are you');
  });

  it('does not use library entries for multi-word sentences', () => {
    const clips = seedClips.filter((clip) => clip.phrase !== 'How are you');
    const sequence = buildTextToSignSequence('How are you', clips, seedLibrary);
    expect(sequence.some((item) => item.term === 'How are you')).toBe(false);
    expect(sequence.every((item) => ['library-word', 'fingerspell'].includes(item.matchedBy))).toBe(true);
  });
});
