/**
 * Exam Page Integration Tests
 *
 * Tests for type adapter usage and data conversion
 */

import { wordsToWordItems } from '@/lib/utils/exam';
import type { Word } from '@/app/types/learn';
import type { WordItem } from '@/lib/utils/exam/types';

describe('Exam Page Integration', () => {
  const mockWords: Word[] = [
    { id: '1', text: 'apple', meaning: 'A red fruit' },
    { id: '2', text: 'banana', meaning: 'A yellow fruit' },
    { id: '3', text: 'cherry', meaning: 'A small red fruit' },
    { id: '4', text: 'date', meaning: 'A sweet dried fruit' },
    { id: '5', text: 'elderberry', meaning: 'A dark purple berry' },
  ];

  describe('type conversion for exam module', () => {
    it('should convert Word data from API to WordItem format', () => {
      const result = wordsToWordItems(mockWords);

      expect(result).toHaveLength(5);
      result.forEach((item: WordItem, index: number) => {
        expect(item.id).toBe(mockWords[index].id);
        expect(item.word).toBe(mockWords[index].text);
        expect(item.meaning).toBe(mockWords[index].meaning);
      });
    });

    it('should maintain WordItem structure for exam questions', () => {
      const result = wordsToWordItems(mockWords);

      const firstWord = result[0];
      expect(firstWord).toHaveProperty('id', '1');
      expect(firstWord).toHaveProperty('word', 'apple');
      expect(firstWord).toHaveProperty('meaning', 'A red fruit');
      expect(firstWord).not.toHaveProperty('text');
    });

    it('should handle empty word list', () => {
      const result = wordsToWordItems([]);

      expect(result).toEqual([]);
    });

    it('should preserve order of words during conversion', () => {
      const shuffledWords = [mockWords[4], mockWords[2], mockWords[0], mockWords[3], mockWords[1]];
      const result = wordsToWordItems(shuffledWords);

      expect(result[0].word).toBe('elderberry');
      expect(result[1].word).toBe('cherry');
      expect(result[2].word).toBe('apple');
      expect(result[3].word).toBe('date');
      expect(result[4].word).toBe('banana');
    });

    it('should handle words with special characters', () => {
      const specialWords: Word[] = [
        { id: '1', text: "don't", meaning: 'negative' },
        { id: '2', text: 'café', meaning: 'coffee shop' },
        { id: '3', text: 'naïve', meaning: 'innocent' },
      ];

      const result = wordsToWordItems(specialWords);

      expect(result[0].word).toBe("don't");
      expect(result[1].word).toBe('café');
      expect(result[2].word).toBe('naïve');
    });

    it('should handle unicode characters in meaning', () => {
      const unicodeWords: Word[] = [
        { id: '1', text: 'bamboo', meaning: '대나무 🎋' },
        { id: '2', text: 'flower', meaning: 'ดอกไม้' },
      ];

      const result = wordsToWordItems(unicodeWords);

      expect(result[0].meaning).toBe('대나무 🎋');
      expect(result[1].meaning).toBe('ดอกไม้');
    });

    it('should ensure converted WordItems are suitable for exam use', () => {
      const result = wordsToWordItems(mockWords);

      // Check that structure matches ExamQuestion requirements
      result.forEach((item: WordItem) => {
        expect(typeof item.id).toBe('string');
        expect(typeof item.word).toBe('string');
        expect(typeof item.meaning).toBe('string');
        expect(item.id.length).toBeGreaterThan(0);
        expect(item.word.length).toBeGreaterThan(0);
        expect(item.meaning.length).toBeGreaterThan(0);
      });
    });

    it('should handle batch conversion for exam session initialization', () => {
      // Simulate loading data from API and converting for exam session
      const apiResponse = {
        id: 'wordset-1',
        name: 'Test Words',
        words: mockWords,
      };

      const examWords = wordsToWordItems(apiResponse.words);

      expect(examWords).toHaveLength(apiResponse.words.length);
      expect(examWords[0]).toHaveProperty('word', 'apple');
    });
  });

  describe('data integrity during conversion', () => {
    it('should not mutate original words during conversion', () => {
      const originalCopy = JSON.parse(JSON.stringify(mockWords));

      wordsToWordItems(mockWords);

      expect(mockWords).toEqual(originalCopy);
    });

    it('should handle large batch conversion efficiently', () => {
      const largeWordList = Array.from({ length: 500 }, (_, i) => ({
        id: `word-${i}`,
        text: `word${i}`,
        meaning: `meaning ${i}`,
      }));

      const result = wordsToWordItems(largeWordList);

      expect(result).toHaveLength(500);
      expect(result[0].word).toBe('word0');
      expect(result[499].word).toBe('word499');
    });
  });
});
