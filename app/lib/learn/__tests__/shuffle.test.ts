/**
 * Tests for shuffle utility functions
 */

import { shuffleArray, shuffleWords, isShuffled } from '../shuffle';
import type { Word } from '@/app/types/learn';

describe('shuffleArray', () => {
  it('should return an array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
  });

  it('should not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    shuffleArray(original);
    expect(original).toEqual(originalCopy);
  });

  it('should contain all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('should handle empty array', () => {
    const result = shuffleArray([]);
    expect(result).toEqual([]);
  });

  it('should handle single element array', () => {
    const result = shuffleArray([1]);
    expect(result).toEqual([1]);
  });

  it('should shuffle array on multiple calls', () => {
    const input = Array.from({ length: 10 }, (_, i) => i);
    const shuffles = Array.from({ length: 5 }, () => shuffleArray(input));

    // Check that at least one shuffle is different (probability is very high)
    const allSame = shuffles.every((s) => JSON.stringify(s) === JSON.stringify(input));
    expect(allSame).toBe(false);
  });
});

describe('shuffleWords', () => {
  const mockWords: Word[] = [
    { id: '1', text: 'apple', meaning: '사과' },
    { id: '2', text: 'banana', meaning: '바나나' },
    { id: '3', text: 'cherry', meaning: '체리' },
  ];

  it('should return words array of same length', () => {
    const result = shuffleWords(mockWords);
    expect(result).toHaveLength(mockWords.length);
  });

  it('should not mutate original array', () => {
    const original = [...mockWords];
    shuffleWords(mockWords);
    expect(mockWords).toEqual(original);
  });

  it('should preserve word objects', () => {
    const result = shuffleWords(mockWords);
    expect(result.every((word) => mockWords.some((w) => w.id === word.id))).toBe(true);
  });

  it('should return all original words', () => {
    const result = shuffleWords(mockWords);
    const resultIds = result.map((w) => w.id).sort();
    const originalIds = mockWords.map((w) => w.id).sort();
    expect(resultIds).toEqual(originalIds);
  });
});

describe('isShuffled', () => {
  it('should return true if arrays are in different order', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = [2, 4, 1, 5, 3];
    expect(isShuffled(original, shuffled)).toBe(true);
  });

  it('should return false if arrays are in same order', () => {
    const original = [1, 2, 3, 4, 5];
    const same = [1, 2, 3, 4, 5];
    expect(isShuffled(original, same)).toBe(false);
  });

  it('should return false if arrays have different lengths', () => {
    const original = [1, 2, 3];
    const different = [1, 2, 3, 4];
    expect(isShuffled(original, different)).toBe(false);
  });

  it('should handle empty arrays', () => {
    expect(isShuffled([], [])).toBe(false);
  });

  it('should detect partial shuffling', () => {
    const original = [1, 2, 3, 4, 5];
    const partialShuffle = [2, 1, 3, 4, 5];
    expect(isShuffled(original, partialShuffle)).toBe(true);
  });
});
