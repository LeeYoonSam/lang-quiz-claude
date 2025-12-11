/**
 * Type Adapters Test Suite
 *
 * Tests for converting Word types to WordItem types
 */

import { wordToWordItem, wordsToWordItems } from '@/lib/utils/exam/typeAdapters';
import type { Word } from '@/app/types/learn';
import type { WordItem } from '@/lib/utils/exam/types';

describe('Type Adapters', () => {
  describe('wordToWordItem', () => {
    it('should convert a single Word to WordItem', () => {
      const word: Word = {
        id: 'word-1',
        text: 'apple',
        meaning: '사과',
      };

      const result = wordToWordItem(word);

      expect(result).toEqual({
        id: 'word-1',
        word: 'apple',
        meaning: '사과',
      });
    });

    it('should preserve id field during conversion', () => {
      const word: Word = {
        id: 'unique-id-123',
        text: 'book',
        meaning: '책',
      };

      const result = wordToWordItem(word);

      expect(result.id).toBe('unique-id-123');
    });

    it('should map text field to word field', () => {
      const word: Word = {
        id: 'word-2',
        text: 'cat',
        meaning: '고양이',
      };

      const result = wordToWordItem(word);

      expect(result.word).toBe('cat');
      expect(result.text).toBeUndefined();
    });

    it('should preserve meaning field during conversion', () => {
      const word: Word = {
        id: 'word-3',
        text: 'dog',
        meaning: '개',
      };

      const result = wordToWordItem(word);

      expect(result.meaning).toBe('개');
    });

    it('should handle optional createdAt and updatedAt fields', () => {
      const now = new Date();
      const word: Word = {
        id: 'word-4',
        text: 'elephant',
        meaning: '코끼리',
        createdAt: now,
        updatedAt: now,
      };

      const result = wordToWordItem(word);

      expect(result).toEqual({
        id: 'word-4',
        word: 'elephant',
        meaning: '코끼리',
      });
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('should handle special characters in word text', () => {
      const word: Word = {
        id: 'word-5',
        text: "don't",
        meaning: "하지 않다",
      };

      const result = wordToWordItem(word);

      expect(result.word).toBe("don't");
    });

    it('should handle unicode characters in meaning', () => {
      const word: Word = {
        id: 'word-6',
        text: 'bamboo',
        meaning: '대나무 🎋',
      };

      const result = wordToWordItem(word);

      expect(result.meaning).toBe('대나무 🎋');
    });
  });

  describe('wordsToWordItems', () => {
    it('should convert array of Words to array of WordItems', () => {
      const words: Word[] = [
        { id: 'word-1', text: 'apple', meaning: '사과' },
        { id: 'word-2', text: 'book', meaning: '책' },
        { id: 'word-3', text: 'cat', meaning: '고양이' },
      ];

      const result = wordsToWordItems(words);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: 'word-1',
        word: 'apple',
        meaning: '사과',
      });
      expect(result[1]).toEqual({
        id: 'word-2',
        word: 'book',
        meaning: '책',
      });
      expect(result[2]).toEqual({
        id: 'word-3',
        word: 'cat',
        meaning: '고양이',
      });
    });

    it('should handle empty array', () => {
      const words: Word[] = [];

      const result = wordsToWordItems(words);

      expect(result).toEqual([]);
    });

    it('should maintain order of words', () => {
      const words: Word[] = [
        { id: 'z', text: 'zebra', meaning: '얼룩말' },
        { id: 'a', text: 'apple', meaning: '사과' },
        { id: 'm', text: 'monkey', meaning: '원숭이' },
      ];

      const result = wordsToWordItems(words);

      expect(result[0].id).toBe('z');
      expect(result[1].id).toBe('a');
      expect(result[2].id).toBe('m');
    });

    it('should handle large arrays of words', () => {
      const words: Word[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `word-${i}`,
        text: `word${i}`,
        meaning: `의미${i}`,
      }));

      const result = wordsToWordItems(words);

      expect(result).toHaveLength(1000);
      expect(result[0].id).toBe('word-0');
      expect(result[999].id).toBe('word-999');
    });

    it('should not mutate original array', () => {
      const words: Word[] = [
        { id: 'word-1', text: 'apple', meaning: '사과' },
      ];
      const originalCopy = JSON.parse(JSON.stringify(words));

      wordsToWordItems(words);

      expect(words).toEqual(originalCopy);
    });

    it('should handle words with optional date fields', () => {
      const now = new Date();
      const words: Word[] = [
        { id: 'word-1', text: 'apple', meaning: '사과', createdAt: now, updatedAt: now },
      ];

      const result = wordsToWordItems(words);

      expect(result[0].createdAt).toBeUndefined();
      expect(result[0].updatedAt).toBeUndefined();
    });

    it('should handle mixed optional fields across array', () => {
      const now = new Date();
      const words: Word[] = [
        { id: 'word-1', text: 'apple', meaning: '사과', createdAt: now },
        { id: 'word-2', text: 'book', meaning: '책' },
        { id: 'word-3', text: 'cat', meaning: '고양이', updatedAt: now },
      ];

      const result = wordsToWordItems(words);

      expect(result).toHaveLength(3);
      result.forEach((item) => {
        expect(item.createdAt).toBeUndefined();
        expect(item.updatedAt).toBeUndefined();
      });
    });
  });
});
