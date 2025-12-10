import { calculateScore } from '@/lib/utils/exam/calculateScore';

interface ExamAnswer {
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
}

interface ExamResult {
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  duration: number;
}

describe('calculateScore', () => {
  describe('Perfect Score', () => {
    it('should return 100 for all correct answers', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
        { questionIndex: 2, userAnswer: 'orange', isCorrect: true },
        { questionIndex: 3, userAnswer: 'grape', isCorrect: true },
      ];

      const result = calculateScore(answers, 4);

      expect(result.percentage).toBe(100);
      expect(result.correctCount).toBe(4);
      expect(result.incorrectCount).toBe(0);
    });
  });

  describe('Zero Score', () => {
    it('should return 0 for all incorrect answers', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 1, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 2, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 3, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 4);

      expect(result.percentage).toBe(0);
      expect(result.correctCount).toBe(0);
      expect(result.incorrectCount).toBe(4);
    });
  });

  describe('Partial Scores', () => {
    it('should calculate correct percentage for 50% score', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
        { questionIndex: 2, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 3, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 4);

      expect(result.percentage).toBe(50);
      expect(result.correctCount).toBe(2);
      expect(result.incorrectCount).toBe(2);
    });

    it('should calculate correct percentage for 75% score', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
        { questionIndex: 2, userAnswer: 'orange', isCorrect: true },
        { questionIndex: 3, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 4);

      expect(result.percentage).toBe(75);
      expect(result.correctCount).toBe(3);
      expect(result.incorrectCount).toBe(1);
    });

    it('should calculate correct percentage for 33.3% score', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 2, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 3);

      // (1/3) * 100 = 33.333...
      expect(result.percentage).toBeCloseTo(33.3, 1);
      expect(result.correctCount).toBe(1);
      expect(result.incorrectCount).toBe(2);
    });
  });

  describe('Rounding and Precision', () => {
    it('should round to 1 decimal place for 66.67%', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
        { questionIndex: 2, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 3);

      // (2/3) * 100 = 66.666... should round to 66.7
      expect(result.percentage).toBeCloseTo(66.7, 1);
    });

    it('should handle repeating decimals correctly', () => {
      // Testing 1/3 = 0.333...
      const answers: ExamAnswer[] = Array.from({ length: 3 }, (_, i) => ({
        questionIndex: i,
        userAnswer: `answer${i}`,
        isCorrect: i === 0,
      }));

      const result = calculateScore(answers, 3);

      // 33.3 (rounded to 1 decimal)
      expect(result.percentage).toBeCloseTo(33.3, 1);
    });

    it('should handle precise percentages', () => {
      // 8/10 = 80%
      const answers: ExamAnswer[] = [
        ...Array.from({ length: 8 }, (_, i) => ({
          questionIndex: i,
          userAnswer: `answer${i}`,
          isCorrect: true,
        })),
        ...Array.from({ length: 2 }, (_, i) => ({
          questionIndex: i + 8,
          userAnswer: `answer${i + 8}`,
          isCorrect: false,
        })),
      ];

      const result = calculateScore(answers, 10);

      expect(result.percentage).toBe(80);
    });
  });

  describe('Return Type Structure', () => {
    it('should return object with required fields', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
      ];

      const result = calculateScore(answers, 1);

      expect(result).toHaveProperty('correctCount');
      expect(result).toHaveProperty('incorrectCount');
      expect(result).toHaveProperty('percentage');
      expect(result).toHaveProperty('duration');
    });

    it('should return correct types in result object', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
      ];

      const result = calculateScore(answers, 1);

      expect(typeof result.correctCount).toBe('number');
      expect(typeof result.incorrectCount).toBe('number');
      expect(typeof result.percentage).toBe('number');
      expect(typeof result.duration).toBe('number');
    });
  });

  describe('Consistency', () => {
    it('should ensure correctCount + incorrectCount equals total answers', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
        { questionIndex: 2, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 3);

      expect(result.correctCount + result.incorrectCount).toBe(answers.length);
    });

    it('should ensure percentage is accurate given correctCount', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 2, userAnswer: 'wrong', isCorrect: false },
        { questionIndex: 3, userAnswer: 'wrong', isCorrect: false },
      ];

      const result = calculateScore(answers, 4);

      const expectedPercentage = (result.correctCount / 4) * 100;
      expect(result.percentage).toBe(expectedPercentage);
    });
  });

  describe('Large Question Counts', () => {
    it('should handle 100 questions', () => {
      const answers: ExamAnswer[] = Array.from({ length: 100 }, (_, i) => ({
        questionIndex: i,
        userAnswer: `answer${i}`,
        isCorrect: i % 2 === 0, // 50 correct, 50 incorrect
      }));

      const result = calculateScore(answers, 100);

      expect(result.percentage).toBe(50);
      expect(result.correctCount).toBe(50);
      expect(result.incorrectCount).toBe(50);
    });

    it('should handle 1000 questions', () => {
      const answers: ExamAnswer[] = Array.from({ length: 1000 }, (_, i) => ({
        questionIndex: i,
        userAnswer: `answer${i}`,
        isCorrect: i < 750, // 75% correct
      }));

      const result = calculateScore(answers, 1000);

      expect(result.percentage).toBe(75);
      expect(result.correctCount).toBe(750);
      expect(result.incorrectCount).toBe(250);
    });
  });

  describe('Duration Calculation', () => {
    it('should include duration in result', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
      ];

      const result = calculateScore(answers, 1);

      expect(typeof result.duration).toBe('number');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single question exam', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
      ];

      const result = calculateScore(answers, 1);

      expect(result.percentage).toBe(100);
      expect(result.correctCount).toBe(1);
      expect(result.incorrectCount).toBe(0);
    });

    it('should handle two question exam with perfect score', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
      ];

      const result = calculateScore(answers, 2);

      expect(result.percentage).toBe(100);
    });

    it('should handle question count mismatch gracefully', () => {
      const answers: ExamAnswer[] = [
        { questionIndex: 0, userAnswer: 'apple', isCorrect: true },
        { questionIndex: 1, userAnswer: 'banana', isCorrect: true },
      ];

      const result = calculateScore(answers, 5);

      // Use provided question count for calculation
      expect(result.percentage).toBe((2 / 5) * 100);
    });
  });
});
