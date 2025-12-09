import { generateWrongAnswers } from '@/lib/utils/exam/generateWrongAnswers';

interface WordItem {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

describe('generateWrongAnswers', () => {
  // Helper function to create word items
  const createWord = (id: string, word: string, meaning: string): WordItem => ({
    id,
    word,
    meaning,
  });

  describe('Basic Selection', () => {
    it('should generate exactly N wrong answers', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
        createWord('3', 'orange', 'An orange'),
        createWord('4', 'grape', 'A grape'),
        createWord('5', 'kiwi', 'A kiwi'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 3);

      expect(result).toHaveLength(3);
    });

    it('should return empty array when count is 0', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 0);

      expect(result).toEqual([]);
    });

    it('should exclude correct answer from wrong answers', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
        createWord('3', 'orange', 'An orange'),
        createWord('4', 'grape', 'A grape'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 3);

      expect(result).not.toContain(correctAnswer);
      expect(result).toHaveLength(3);
    });
  });

  describe('Edge Cases - Insufficient Words', () => {
    it('should return available words when requested count exceeds available words', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
        createWord('3', 'orange', 'An orange'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 5);

      // Only 2 words available (excluding correct answer)
      expect(result).toHaveLength(2);
      expect(result).not.toContain(correctAnswer);
    });

    it('should return empty array when only correct answer exists', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [createWord('1', 'apple', 'An apple')];

      const result = generateWrongAnswers(correctAnswer, words, 3);

      expect(result).toEqual([]);
    });

    it('should handle minimum valid case (exactly one alternative)', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('banana');
      expect(result).not.toContain(correctAnswer);
    });
  });

  describe('Duplicate Handling', () => {
    it('should not return duplicate wrong answers', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
        createWord('3', 'banana', 'Another banana'),
        createWord('4', 'orange', 'An orange'),
        createWord('5', 'orange', 'Another orange'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 3);

      const uniqueResults = new Set(result);
      expect(uniqueResults.size).toBe(result.length);
    });

    it('should handle word list with many duplicate words', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'apple', 'Another apple'),
        createWord('3', 'apple', 'Yet another apple'),
        createWord('4', 'banana', 'A banana'),
        createWord('5', 'banana', 'Another banana'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 2);

      expect(result).not.toContain('apple');
      const uniqueResults = new Set(result);
      expect(uniqueResults.size).toBe(result.length);
    });
  });

  describe('Randomization', () => {
    it('should return different selections on multiple calls', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
        createWord('3', 'orange', 'An orange'),
        createWord('4', 'grape', 'A grape'),
        createWord('5', 'kiwi', 'A kiwi'),
        createWord('6', 'mango', 'A mango'),
      ];

      const results = [
        generateWrongAnswers(correctAnswer, words, 3),
        generateWrongAnswers(correctAnswer, words, 3),
        generateWrongAnswers(correctAnswer, words, 3),
      ];

      // At least some results should be different (with very high probability)
      const uniqueResultSets = new Set(results.map(r => r.sort().join(',')));
      expect(uniqueResultSets.size).toBeGreaterThan(1);
    });
  });

  describe('Type Safety', () => {
    it('should return array of strings', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('1', 'apple', 'An apple'),
        createWord('2', 'banana', 'A banana'),
        createWord('3', 'orange', 'An orange'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 2);

      expect(Array.isArray(result)).toBe(true);
      expect(result.every(item => typeof item === 'string')).toBe(true);
    });

    it('should handle case-sensitive word matching', () => {
      const correctAnswer = 'Apple';
      const words: WordItem[] = [
        createWord('1', 'Apple', 'Fruit'),
        createWord('2', 'apple', 'Fruit lowercase'),
        createWord('3', 'banana', 'A banana'),
        createWord('4', 'orange', 'An orange'),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 3);

      expect(result).not.toContain('Apple');
      expect(result).toHaveLength(3);
    });
  });

  describe('Large Dataset', () => {
    it('should efficiently handle large word lists', () => {
      const correctAnswer = 'apple';
      const words: WordItem[] = [
        createWord('0', 'apple', 'An apple'),
        ...Array.from({ length: 1000 }, (_, i) =>
          createWord(`${i + 1}`, `word${i + 1}`, `Meaning ${i + 1}`)
        ),
      ];

      const result = generateWrongAnswers(correctAnswer, words, 3);

      expect(result).toHaveLength(3);
      expect(result).not.toContain(correctAnswer);
    });
  });
});
