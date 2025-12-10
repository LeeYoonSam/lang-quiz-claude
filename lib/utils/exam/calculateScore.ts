import type { ExamAnswer, ExamResult } from './types';

/**
 * Calculate exam results from an array of answers.
 * Returns correct/incorrect counts, percentage score (rounded to 1 decimal), and duration.
 *
 * @param answers - Array of exam answers with correct/incorrect status
 * @param questionCount - Total number of questions in the exam
 * @returns ExamResult with correctCount, incorrectCount, percentage, and duration
 */
export function calculateScore(
  answers: ExamAnswer[],
  questionCount: number
): ExamResult {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;

  // Calculate percentage: (correct / total) * 100, rounded to 1 decimal place
  const percentage = Math.round(((correctCount / questionCount) * 100) * 10) / 10;

  // Duration placeholder - will be calculated by exam session manager
  const duration = 0;

  return {
    correctCount,
    incorrectCount,
    percentage,
    duration,
  };
}
