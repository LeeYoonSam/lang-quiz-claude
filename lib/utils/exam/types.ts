/**
 * Word item data structure
 */
export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

/**
 * Exam question data structure
 */
export interface ExamQuestion {
  wordId: string;
  type: 'multiple-choice' | 'short-answer';
  prompt: string;
  correctAnswer: string;
  choices?: string[];
}

/**
 * User's answer to an exam question
 */
export interface ExamAnswer {
  questionIndex: number;
  userAnswer: string;
  isCorrect: boolean;
}

/**
 * Final exam result
 */
export interface ExamResult {
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  duration: number;
}
