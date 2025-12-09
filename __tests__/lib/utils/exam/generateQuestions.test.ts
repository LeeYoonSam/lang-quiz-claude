import { generateQuestions } from '@/lib/utils/exam/generateQuestions';

interface WordItem {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

interface ExamQuestion {
  wordId: string;
  type: 'multiple-choice' | 'short-answer';
  prompt: string;
  correctAnswer: string;
  choices?: string[];
}

describe('generateQuestions', () => {
  // Helper to create word items
  const createWord = (id: string, word: string, meaning: string): WordItem => ({
    id,
    word,
    meaning,
  });

  const createWordSet = (count: number): WordItem[] => {
    return Array.from({ length: count }, (_, i) =>
      createWord(`${i}`, `word${i}`, `meaning${i}`)
    );
  };

  describe('Multiple Choice Mode', () => {
    it('should generate multiple choice questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      expect(result).toHaveLength(5);
      expect(result.every(q => q.type === 'multiple-choice')).toBe(true);
    });

    it('should include 4 choices for multiple choice questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      expect(result.every(q => q.choices && q.choices.length === 4)).toBe(true);
    });

    it('should include correct answer in choices', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      result.forEach(question => {
        expect(question.choices).toContain(question.correctAnswer);
      });
    });

    it('should use meaning as prompt in forward direction', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.prompt).toBe(wordData?.meaning);
      });
    });

    it('should use word as prompt in reverse direction', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'reverse', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.prompt).toBe(wordData?.word);
      });
    });

    it('should set correct answer to word in forward mode', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.correctAnswer).toBe(wordData?.word);
      });
    });

    it('should set correct answer to meaning in reverse mode', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'reverse', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.correctAnswer).toBe(wordData?.meaning);
      });
    });

    it('should not have duplicate choices in a question', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      result.forEach(question => {
        const uniqueChoices = new Set(question.choices);
        expect(uniqueChoices.size).toBe(question.choices?.length);
      });
    });
  });

  describe('Short Answer Mode', () => {
    it('should generate short answer questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'forward', 5);

      expect(result).toHaveLength(5);
      expect(result.every(q => q.type === 'short-answer')).toBe(true);
    });

    it('should not include choices for short answer questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'forward', 5);

      result.forEach(question => {
        expect(question.choices).toBeUndefined();
      });
    });

    it('should use meaning as prompt in forward direction', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'forward', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.prompt).toBe(wordData?.meaning);
      });
    });

    it('should use word as prompt in reverse direction', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'reverse', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.prompt).toBe(wordData?.word);
      });
    });

    it('should set correct answer to word in forward mode', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'forward', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.correctAnswer).toBe(wordData?.word);
      });
    });

    it('should set correct answer to meaning in reverse mode', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'reverse', 5);

      result.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.correctAnswer).toBe(wordData?.meaning);
      });
    });
  });

  describe('Mixed Mode', () => {
    it('should generate mixed type questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'mixed', 'forward', 10);

      expect(result).toHaveLength(10);
      const hasMultipleChoice = result.some(q => q.type === 'multiple-choice');
      const hasShortAnswer = result.some(q => q.type === 'short-answer');
      expect(hasMultipleChoice && hasShortAnswer).toBe(true);
    });

    it('should maintain 30/70 ratio (3 MC : 7 SA) in mixed mode for 10 questions', () => {
      const words = createWordSet(20);

      const result = generateQuestions(words, 'mixed', 'forward', 10);

      const multipleChoiceCount = result.filter(q => q.type === 'multiple-choice').length;
      const shortAnswerCount = result.filter(q => q.type === 'short-answer').length;

      // 30% MC, 70% SA
      expect(multipleChoiceCount).toBe(3);
      expect(shortAnswerCount).toBe(7);
    });

    it('should randomize question order in mixed mode', () => {
      const words = createWordSet(20);

      const result1 = generateQuestions(words, 'mixed', 'forward', 10);
      const result2 = generateQuestions(words, 'mixed', 'forward', 10);

      // Different runs should have different order (very high probability)
      const order1 = result1.map(q => q.type).join(',');
      const order2 = result2.map(q => q.type).join(',');

      // At least some difference in order (statistically should differ)
      // We check that not all questions are in the same order
      const differences = result1.filter((q, i) => q.wordId !== result2[i].wordId).length;
      expect(differences).toBeGreaterThan(0);
    });

    it('should apply correct direction to mixed questions', () => {
      const words = createWordSet(10);

      const resultForward = generateQuestions(words, 'mixed', 'forward', 10);
      const resultReverse = generateQuestions(words, 'mixed', 'reverse', 10);

      resultForward.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.prompt).toBe(wordData?.meaning);
        expect(question.correctAnswer).toBe(wordData?.word);
      });

      resultReverse.forEach(question => {
        const wordData = words.find(w => w.id === question.wordId);
        expect(question.prompt).toBe(wordData?.word);
        expect(question.correctAnswer).toBe(wordData?.meaning);
      });
    });
  });

  describe('Question Count', () => {
    it('should generate exact number of questions requested', () => {
      const words = createWordSet(20);

      expect(generateQuestions(words, 'multiple-choice', 'forward', 1)).toHaveLength(1);
      expect(generateQuestions(words, 'multiple-choice', 'forward', 5)).toHaveLength(5);
      expect(generateQuestions(words, 'multiple-choice', 'forward', 10)).toHaveLength(10);
    });

    it('should limit questions to available words', () => {
      const words = createWordSet(5);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 10);

      expect(result.length).toBeLessThanOrEqual(words.length);
    });

    it('should generate minimum questions even with limited words', () => {
      const words = createWordSet(4);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 4);

      expect(result).toHaveLength(4);
    });
  });

  describe('Randomization', () => {
    it('should randomize word selection', () => {
      const words = createWordSet(20);

      const result1 = generateQuestions(words, 'multiple-choice', 'forward', 10);
      const result2 = generateQuestions(words, 'multiple-choice', 'forward', 10);

      const wordIds1 = result1.map(q => q.wordId).sort().join(',');
      const wordIds2 = result2.map(q => q.wordId).sort().join(',');

      // Different selections of questions (very high probability)
      // At least some difference
      expect(result1.some((q, i) => q.wordId !== result2[i].wordId)).toBe(true);
    });

    it('should randomize multiple choice answer positions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      const correctAnswerPositions: number[] = [];
      result.forEach(question => {
        if (question.choices) {
          const position = question.choices.indexOf(question.correctAnswer);
          correctAnswerPositions.push(position);
        }
      });

      // Correct answer should appear in different positions
      const uniquePositions = new Set(correctAnswerPositions);
      expect(uniquePositions.size).toBeGreaterThan(1);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain wordId reference to original word', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      result.forEach(question => {
        const matchingWord = words.find(w => w.id === question.wordId);
        expect(matchingWord).toBeDefined();
      });
    });

    it('should not return duplicate questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'short-answer', 'forward', 10);

      const uniqueWordIds = new Set(result.map(q => q.wordId));
      expect(uniqueWordIds.size).toBe(result.length);
    });

    it('should preserve complete word data relationship', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      result.forEach(question => {
        const original = words.find(w => w.id === question.wordId);
        expect(original).toBeDefined();
        expect(question.correctAnswer).toBe(original?.word);
        expect(question.prompt).toBe(original?.meaning);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single word', () => {
      const words = createWordSet(1);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 1);

      expect(result).toHaveLength(1);
    });

    it('should handle exactly enough words for multiple choice', () => {
      const words = createWordSet(4);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 1);

      expect(result).toHaveLength(1);
      expect(result[0].choices).toHaveLength(4);
    });

    it('should handle zero questions', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 0);

      expect(result).toHaveLength(0);
    });
  });

  describe('Type Safety', () => {
    it('should return array of ExamQuestion', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      expect(Array.isArray(result)).toBe(true);
      result.forEach(q => {
        expect(q).toHaveProperty('wordId');
        expect(q).toHaveProperty('type');
        expect(q).toHaveProperty('prompt');
        expect(q).toHaveProperty('correctAnswer');
      });
    });

    it('should have correct enum values for type', () => {
      const words = createWordSet(10);

      const result = generateQuestions(words, 'mixed', 'forward', 10);

      result.forEach(q => {
        expect(['multiple-choice', 'short-answer']).toContain(q.type);
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should generate realistic vocabulary exam questions', () => {
      const words: WordItem[] = [
        { id: '1', word: 'apple', meaning: 'A red fruit' },
        { id: '2', word: 'book', meaning: 'A set of pages' },
        { id: '3', word: 'cat', meaning: 'A domestic animal' },
        { id: '4', word: 'dog', meaning: 'A pet animal' },
        { id: '5', word: 'egg', meaning: 'Chicken product' },
      ];

      const result = generateQuestions(words, 'multiple-choice', 'forward', 5);

      expect(result).toHaveLength(5);
      expect(result.every(q => q.type === 'multiple-choice')).toBe(true);
      expect(result.every(q => q.choices?.length === 4)).toBe(true);
    });

    it('should handle exam with meaningful content', () => {
      const words: WordItem[] = [
        { id: '1', word: 'study', meaning: 'Learn something', pronunciation: 'ˈstʌdi' },
        { id: '2', word: 'teacher', meaning: 'Person who teaches', pronunciation: 'ˈtiːtʃə' },
      ];

      const result = generateQuestions(words, 'short-answer', 'reverse', 2);

      expect(result).toHaveLength(2);
      expect(result.every(q => q.prompt === 'study' || q.prompt === 'teacher')).toBe(true);
    });
  });
});
