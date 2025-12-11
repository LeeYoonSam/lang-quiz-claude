/**
 * Tests for useExamSession hook
 *
 * Comprehensive test suite covering:
 * - Session state management
 * - SessionStorage persistence
 * - Question generation and navigation
 * - Answer submission and validation
 * - Exam completion and result calculation
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useExamSession } from '@/app/hooks/useExamSession';
import * as examUtils from '@/lib/utils/exam';
import type { WordItem, ExamQuestion, ExamAnswer } from '@/lib/utils/exam/types';

// Mock exam utilities
jest.mock('@/lib/utils/exam', () => ({
  generateQuestions: jest.fn(),
  generateWrongAnswers: jest.fn(),
  validateAnswer: jest.fn(),
  calculateScore: jest.fn(),
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

const mockWords: WordItem[] = [
  { id: '1', word: 'apple', meaning: 'A red fruit' },
  { id: '2', word: 'banana', meaning: 'A yellow fruit' },
  { id: '3', word: 'cherry', meaning: 'A small red fruit' },
  { id: '4', word: 'date', meaning: 'A sweet dried fruit' },
  { id: '5', word: 'elderberry', meaning: 'A dark purple berry' },
];

const mockExamQuestions: ExamQuestion[] = [
  {
    wordId: '1',
    type: 'multiple-choice',
    prompt: 'A red fruit',
    correctAnswer: 'apple',
    choices: ['apple', 'banana', 'cherry', 'date'],
  },
  {
    wordId: '2',
    type: 'short-answer',
    prompt: 'A yellow fruit',
    correctAnswer: 'banana',
  },
];

describe('useExamSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
    mockSessionStorage.setItem.mockImplementation(() => {});
    mockSessionStorage.removeItem.mockImplementation(() => {});
    mockSessionStorage.clear.mockImplementation(() => {});

    (examUtils.generateQuestions as jest.Mock).mockReturnValue(mockExamQuestions);
    (examUtils.validateAnswer as jest.Mock).mockReturnValue(true);
    (examUtils.calculateScore as jest.Mock).mockReturnValue({
      correctCount: 2,
      incorrectCount: 0,
      percentage: 100,
      duration: 60000,
    });
  });

  describe('initialization', () => {
    it('should initialize with config state', () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(result.current.status).toBe('config');
      expect(result.current.questions).toEqual([]);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.answers).toEqual([]);
      expect(result.current.mode).toBeUndefined();
    });

    it('should initialize with empty answers array', () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(Array.isArray(result.current.answers)).toBe(true);
      expect(result.current.answers).toHaveLength(0);
    });

    it('should set wordSetId correctly', () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(result.current.wordSetId).toBe('wordset-1');
    });

    it('should initialize startTime as 0', () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(result.current.startTime).toBe(0);
    });
  });

  describe('startExam', () => {
    it('should change status from config to in-progress', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(result.current.status).toBe('config');

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 10,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });
    });

    it('should generate questions with correct mode and direction', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'mixed',
          direction: 'reverse',
          questionCount: 10,
        });
      });

      await waitFor(() => {
        expect(examUtils.generateQuestions).toHaveBeenCalledWith(
          mockWords,
          'mixed',
          'reverse',
          10,
        );
      });
    });

    it('should populate questions array after start', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'short-answer',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.questions).toHaveLength(mockExamQuestions.length);
      });
    });

    it('should set currentIndex to 0 on start', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 10,
        });
      });

      await waitFor(() => {
        expect(result.current.currentIndex).toBe(0);
      });
    });

    it('should record startTime when exam begins', async () => {
      const beforeTime = Date.now();
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 10,
        });
      });

      await waitFor(() => {
        expect(result.current.startTime).toBeGreaterThanOrEqual(beforeTime);
        expect(result.current.startTime).toBeLessThanOrEqual(Date.now());
      });
    });

    it('should store mode and direction in state', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'mixed',
          direction: 'reverse',
          questionCount: 10,
        });
      });

      await waitFor(() => {
        expect(result.current.mode).toBe('mixed');
        expect(result.current.direction).toBe('reverse');
      });
    });

    it('should persist session to sessionStorage', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 10,
        });
      });

      await waitFor(() => {
        expect(mockSessionStorage.setItem).toHaveBeenCalled();
        const call = mockSessionStorage.setItem.mock.calls[0];
        expect(call[0]).toBe('exam_session_wordset-1');
      });
    });
  });

  describe('submitAnswer', () => {
    it('should add answer to answers array', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.submitAnswer('apple');
      });

      await waitFor(() => {
        expect(result.current.answers).toHaveLength(1);
      });
    });

    it('should validate answer using validateAnswer utility', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.submitAnswer('apple');
      });

      await waitFor(() => {
        expect(examUtils.validateAnswer).toHaveBeenCalledWith(
          'apple',
          mockExamQuestions[0].correctAnswer,
        );
      });
    });

    it('should record isCorrect status in answer', async () => {
      (examUtils.validateAnswer as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.submitAnswer('apple');
      });

      await waitFor(() => {
        expect(result.current.answers[0].isCorrect).toBe(true);
      });
    });

    it('should store questionIndex in answer', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.submitAnswer('apple');
      });

      await waitFor(() => {
        expect(result.current.answers[0].questionIndex).toBe(0);
      });
    });

    it('should persist session after answer submission', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.submitAnswer('apple');
      });

      await waitFor(() => {
        expect(mockSessionStorage.setItem).toHaveBeenCalled();
      });
    });
  });

  describe('nextQuestion', () => {
    it('should increment currentIndex', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.currentIndex).toBe(0);
      });

      act(() => {
        result.current.nextQuestion();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it('should not exceed total questions count', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.nextQuestion();
        result.current.nextQuestion();
        result.current.nextQuestion();
      });

      expect(result.current.currentIndex).toBeLessThanOrEqual(
        result.current.questions.length - 1,
      );
    });

    it('should persist session after navigation', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.nextQuestion();
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('prevQuestion', () => {
    it('should decrement currentIndex', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.currentIndex).toBe(0);
      });

      act(() => {
        result.current.nextQuestion();
        result.current.prevQuestion();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should not go below 0', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.currentIndex).toBe(0);
      });

      act(() => {
        result.current.prevQuestion();
        result.current.prevQuestion();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should persist session after backward navigation', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.nextQuestion();
      });

      await waitFor(() => {
        expect(result.current.currentIndex).toBe(1);
      });

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.prevQuestion();
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('finishExam', () => {
    it('should change status to completed', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.finishExam();
      });

      expect(result.current.status).toBe('completed');
    });

    it('should return ExamResult object', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      let examResult;
      act(() => {
        examResult = result.current.finishExam();
      });

      expect(examResult).toBeDefined();
      expect(examResult).toHaveProperty('correctCount');
      expect(examResult).toHaveProperty('incorrectCount');
      expect(examResult).toHaveProperty('percentage');
      expect(examResult).toHaveProperty('duration');
    });

    it('should calculate correct score', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.submitAnswer('apple');
        result.current.submitAnswer('banana');
      });

      let examResult;
      act(() => {
        examResult = result.current.finishExam();
      });

      expect(examUtils.calculateScore).toHaveBeenCalledWith(
        result.current.answers,
        2,
      );
    });

    it('should calculate duration based on startTime', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      // Wait a bit to accumulate time
      await new Promise((resolve) => setTimeout(resolve, 10));

      let examResult;
      act(() => {
        examResult = result.current.finishExam();
      });

      expect(examResult?.duration).toBeGreaterThanOrEqual(0);
    });

    it('should persist session after finish', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.finishExam();
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('resetExam', () => {
    it('should change status back to config', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.resetExam();
      });

      expect(result.current.status).toBe('config');
    });

    it('should clear questions array', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.questions.length).toBeGreaterThan(0);
      });

      act(() => {
        result.current.resetExam();
      });

      expect(result.current.questions).toEqual([]);
    });

    it('should clear answers array', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.submitAnswer('apple');
        result.current.resetExam();
      });

      expect(result.current.answers).toEqual([]);
    });

    it('should reset currentIndex to 0', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.nextQuestion();
        result.current.resetExam();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should reset startTime to 0', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.startTime).toBeGreaterThan(0);
      });

      act(() => {
        result.current.resetExam();
      });

      expect(result.current.startTime).toBe(0);
    });

    it('should remove session from sessionStorage', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      mockSessionStorage.removeItem.mockClear();

      act(() => {
        result.current.resetExam();
      });

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        'exam_session_wordset-1',
      );
    });
  });

  describe('SessionStorage Persistence', () => {
    it('should load existing session on initialization', () => {
      const existingSession = {
        wordSetId: 'wordset-1',
        mode: 'multiple-choice' as const,
        direction: 'forward' as const,
        questions: mockExamQuestions,
        currentIndex: 1,
        answers: [
          {
            questionIndex: 0,
            userAnswer: 'apple',
            isCorrect: true,
          },
        ],
        startTime: Date.now() - 30000,
        status: 'in-progress' as const,
      };

      mockSessionStorage.getItem.mockReturnValueOnce(
        JSON.stringify(existingSession),
      );

      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.answers).toHaveLength(1);
      expect(result.current.status).toBe('in-progress');
    });

    it('should use key format exam_session_{wordSetId}', async () => {
      const { result } = renderHook(() =>
        useExamSession('my-custom-set', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        const calls = mockSessionStorage.setItem.mock.calls;
        const key = calls.find((call) =>
          call[0].startsWith('exam_session_'),
        )?.[0];
        expect(key).toBe('exam_session_my-custom-set');
      });
    });

    it('should update session on every state change', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      const startCallCount = mockSessionStorage.setItem.mock.calls.length;

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.submitAnswer('apple');
      });

      await waitFor(() => {
        expect(mockSessionStorage.setItem).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty answers at finishExam', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      let examResult;
      act(() => {
        examResult = result.current.finishExam();
      });

      expect(examResult).toBeDefined();
      expect(examUtils.calculateScore).toHaveBeenCalledWith([], 2);
    });

    it('should handle navigation on single question exam', async () => {
      (examUtils.generateQuestions as jest.Mock).mockReturnValueOnce([
        mockExamQuestions[0],
      ]);

      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 1,
        });
      });

      await waitFor(() => {
        expect(result.current.questions).toHaveLength(1);
      });

      act(() => {
        result.current.nextQuestion();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should handle submitAnswer before startExam', () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      expect(result.current.status).toBe('config');

      // Should not throw
      act(() => {
        result.current.submitAnswer('apple');
      });

      expect(result.current.answers).toHaveLength(0);
    });

    it('should handle rapid successive navigation calls', async () => {
      const { result } = renderHook(() =>
        useExamSession('wordset-1', mockWords),
      );

      act(() => {
        result.current.startExam({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: 2,
        });
      });

      await waitFor(() => {
        expect(result.current.status).toBe('in-progress');
      });

      act(() => {
        result.current.nextQuestion();
        result.current.nextQuestion();
        result.current.nextQuestion();
        result.current.prevQuestion();
        result.current.prevQuestion();
      });

      expect(result.current.currentIndex).toBeGreaterThanOrEqual(0);
      expect(result.current.currentIndex).toBeLessThanOrEqual(
        result.current.questions.length - 1,
      );
    });
  });
});
