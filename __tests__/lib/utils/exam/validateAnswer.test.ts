import { validateAnswer } from '@/lib/utils/exam/validateAnswer';

describe('validateAnswer', () => {
  describe('Exact Mode - Basic Matching', () => {
    it('should return true for exact match', () => {
      const result = validateAnswer('apple', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should return false for non-matching answers', () => {
      const result = validateAnswer('orange', 'apple', 'exact');
      expect(result).toBe(false);
    });
  });

  describe('Exact Mode - Case Insensitivity', () => {
    it('should ignore uppercase difference', () => {
      const result = validateAnswer('Apple', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should ignore lowercase difference', () => {
      const result = validateAnswer('APPLE', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should ignore mixed case difference', () => {
      const result = validateAnswer('ApPlE', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should correctly reject non-matching uppercase answers', () => {
      const result = validateAnswer('BANANA', 'apple', 'exact');
      expect(result).toBe(false);
    });
  });

  describe('Exact Mode - Whitespace Handling', () => {
    it('should ignore leading whitespace', () => {
      const result = validateAnswer('  apple', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should ignore trailing whitespace', () => {
      const result = validateAnswer('apple  ', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should ignore both leading and trailing whitespace', () => {
      const result = validateAnswer('  apple  ', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should handle tab characters', () => {
      const result = validateAnswer('\tapple\t', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should handle newline characters', () => {
      const result = validateAnswer('\napple\n', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should reject when middle whitespace differs', () => {
      const result = validateAnswer('apple pie', 'applepie', 'exact');
      expect(result).toBe(false);
    });
  });

  describe('Exact Mode - Combined Case and Whitespace', () => {
    it('should handle both case and leading whitespace', () => {
      const result = validateAnswer('  APPLE', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should handle both case and trailing whitespace', () => {
      const result = validateAnswer('APPLE  ', 'apple', 'exact');
      expect(result).toBe(true);
    });

    it('should handle both case and surrounding whitespace', () => {
      const result = validateAnswer('  APPLE  ', 'apple', 'exact');
      expect(result).toBe(true);
    });
  });

  describe('Exact Mode - Multiple Words', () => {
    it('should match exact phrase', () => {
      const result = validateAnswer('apple pie', 'apple pie', 'exact');
      expect(result).toBe(true);
    });

    it('should ignore case in multi-word answers', () => {
      const result = validateAnswer('APPLE PIE', 'apple pie', 'exact');
      expect(result).toBe(true);
    });

    it('should ignore whitespace in multi-word answers', () => {
      const result = validateAnswer('  apple pie  ', 'apple pie', 'exact');
      expect(result).toBe(true);
    });

    it('should reject extra spaces in phrase', () => {
      const result = validateAnswer('apple  pie', 'apple pie', 'exact');
      expect(result).toBe(false);
    });
  });

  describe('Fuzzy Mode - Partial Matching', () => {
    it('should return true for exact match in fuzzy mode', () => {
      const result = validateAnswer('apple', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });

    it('should return true for partial match (beginning)', () => {
      const result = validateAnswer('app', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });

    it('should return true for partial match (middle)', () => {
      const result = validateAnswer('ppl', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });

    it('should return true for partial match (end)', () => {
      const result = validateAnswer('ple', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });

    it('should be case insensitive in fuzzy mode', () => {
      const result = validateAnswer('APP', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });

    it('should trim whitespace in fuzzy mode', () => {
      const result = validateAnswer('  app  ', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });

    it('should return false for non-matching partial', () => {
      const result = validateAnswer('xyz', 'apple', 'fuzzy');
      expect(result).toBe(false);
    });

    it('should handle minimum length fuzzy match', () => {
      const result = validateAnswer('a', 'apple', 'fuzzy');
      expect(result).toBe(true);
    });
  });

  describe('Empty and Edge Cases', () => {
    it('should handle empty user answer in exact mode', () => {
      const result = validateAnswer('', 'apple', 'exact');
      expect(result).toBe(false);
    });

    it('should handle empty user answer in fuzzy mode', () => {
      const result = validateAnswer('', 'apple', 'fuzzy');
      expect(result).toBe(false);
    });

    it('should handle whitespace-only answer in exact mode', () => {
      const result = validateAnswer('   ', 'apple', 'exact');
      expect(result).toBe(false);
    });

    it('should handle both empty in exact mode', () => {
      const result = validateAnswer('', '', 'exact');
      expect(result).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should return boolean type', () => {
      const result = validateAnswer('apple', 'apple', 'exact');
      expect(typeof result).toBe('boolean');
    });

    it('should handle numeric-like strings', () => {
      const result = validateAnswer('123', '123', 'exact');
      expect(result).toBe(true);
    });

    it('should handle special characters', () => {
      const result = validateAnswer('apple!', 'apple!', 'exact');
      expect(result).toBe(true);
    });
  });

  describe('Real-world Examples', () => {
    it('should validate common word answers', () => {
      const testCases = [
        { user: 'run', correct: 'run', expected: true },
        { user: 'RUN', correct: 'run', expected: true },
        { user: '  run  ', correct: 'run', expected: true },
        { user: 'running', correct: 'run', expected: false },
      ];

      testCases.forEach(({ user, correct, expected }) => {
        expect(validateAnswer(user, correct, 'exact')).toBe(expected);
      });
    });

    it('should validate Korean-English mixed content', () => {
      const result = validateAnswer('apple 사과', 'apple 사과', 'exact');
      expect(result).toBe(true);
    });

    it('should validate hyphenated words', () => {
      const result = validateAnswer('well-known', 'well-known', 'exact');
      expect(result).toBe(true);
    });

    it('should validate apostrophes', () => {
      const result = validateAnswer("it's", "it's", 'exact');
      expect(result).toBe(true);
    });
  });
});
