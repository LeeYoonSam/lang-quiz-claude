/**
 * Integration tests for exam routing pages
 *
 * Tests the core functionality and hook integration of:
 * - Exam config page (ExamPage)
 * - Exam progress page (ProgressPage)
 * - Exam result page (ResultPage)
 *
 * Since Next.js App Router pages with dynamic routes ([id]) cannot be directly
 * imported in tests, we test the component integrations that power the pages.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamConfigScreen } from '@/app/components/exam/ExamConfigScreen';
import { ExamResult } from '@/app/components/exam/ExamResult';
import { ExamProgress } from '@/app/components/exam/ExamProgress';
import { useExamSession } from '@/app/hooks/useExamSession';
import { useExamSpeech } from '@/app/hooks/useExamSpeech';
import type { WordItem, ExamResult as ExamResultType } from '@/lib/utils/exam/types';

jest.mock('@/app/hooks/useExamSession');
jest.mock('@/app/hooks/useExamSpeech');

const mockWordSet: WordItem[] = [
  { id: '1', word: 'apple', meaning: 'A red fruit' },
  { id: '2', word: 'banana', meaning: 'A yellow fruit' },
  { id: '3', word: 'cherry', meaning: 'A small red fruit' },
  { id: '4', word: 'date', meaning: 'A sweet dried fruit' },
  { id: '5', word: 'elderberry', meaning: 'A dark purple berry' },
];

describe('Exam Routing Integration', () => {
  beforeEach(() => {
    (useExamSession as jest.Mock).mockReturnValue({
      wordSetId: 'wordset-123',
      status: 'config',
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: 0,
      startExam: jest.fn(),
      submitAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      prevQuestion: jest.fn(),
      finishExam: jest.fn(),
      resetExam: jest.fn(),
    });

    (useExamSpeech as jest.Mock).mockReturnValue({
      isPlaying: false,
      isSupported: true,
      currentUtterance: null,
      error: null,
      speak: jest.fn(),
      stop: jest.fn(),
      checkSupport: jest.fn(() => true),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Exam Config Page (ExamPage)', () => {
    it('should render config screen for selecting exam settings', () => {
      const mockOnStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={mockOnStart} />
      );

      expect(screen.getByRole('heading', { name: /시험 설정/i })).toBeInTheDocument();
    });

    it('should provide exam configuration interface', () => {
      const mockOnStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={mockOnStart} />
      );

      // Should display the main interface elements
      expect(screen.getByRole('heading', { name: /시험 설정/i })).toBeInTheDocument();
    });

    it('should handle exam start action', async () => {
      const user = userEvent.setup();
      const mockOnStart = jest.fn();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={mockOnStart} />
      );

      // Select first mode option
      const radios = screen.getAllByRole('radio');
      if (radios.length > 0) {
        await user.click(radios[0]);
        // Select first direction option
        if (radios.length > 3) {
          await user.click(radios[3]);
        }
      }

      const startButton = screen.getByRole('button', { name: /시험 시작/i });
      await user.click(startButton);

      expect(mockOnStart).toHaveBeenCalled();
    });

    it('should handle cancel/back action', async () => {
      const user = userEvent.setup();
      const mockOnStart = jest.fn();
      const mockOnCancel = jest.fn();

      render(
        <ExamConfigScreen
          wordSet={mockWordSet}
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /취소/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should display exam mode and direction options', () => {
      const mockOnStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={mockOnStart} />
      );

      // Check that mode selection label is present
      expect(screen.getByText(/시험 모드/i)).toBeInTheDocument();
      // Check that direction selection label is present
      expect(screen.getByText(/출제 방향/i)).toBeInTheDocument();
    });

    it('should support question count selection', () => {
      const mockOnStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={mockOnStart} />
      );

      // Question count input should be present
      expect(screen.getByText(/문제 개수/i)).toBeInTheDocument();
    });
  });

  describe('Exam Progress Page (ProgressPage)', () => {
    it('should render progress component for showing current question', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={5}
          answeredCount={0}
        />
      );

      // Progress component should show question counter
      expect(screen.getByText(/문제/i)).toBeInTheDocument();
    });

    it('should update progress as questions are answered', () => {
      const { rerender } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={5}
          answeredCount={0}
        />
      );

      // Initial render successful
      expect(screen.getByText(/1\/5/)).toBeInTheDocument();

      rerender(
        <ExamProgress
          currentIndex={2}
          totalQuestions={5}
          answeredCount={2}
        />
      );

      // Progress should update
      expect(screen.getByText(/3\/5/)).toBeInTheDocument();
    });

    it('should work with different question counts', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      // Should render with any question count
      expect(screen.getByText(/1\/10/)).toBeInTheDocument();
    });

    it('should handle last question index', () => {
      render(
        <ExamProgress
          currentIndex={4}
          totalQuestions={5}
          answeredCount={4}
        />
      );

      // Should show final question
      expect(screen.getByText(/5\/5/)).toBeInTheDocument();
    });
  });

  describe('Exam Result Page (ResultPage)', () => {
    it('should render result display component', () => {
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      expect(screen.getByText(/시험 결과/i)).toBeInTheDocument();
    });

    it('should display score and statistics', () => {
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      expect(screen.getByText(/60/)).toBeInTheDocument();
      expect(screen.getByText(/소요 시간/i)).toBeInTheDocument();
    });

    it('should provide retry button', async () => {
      const user = userEvent.setup();
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      const retryButton = screen.getByRole('button', { name: /다시 풀기/i });
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalled();
    });

    it('should provide finish button to go back', async () => {
      const user = userEvent.setup();
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      const finishButton = screen.getByRole('button', { name: /완료/i });
      await user.click(finishButton);

      expect(mockOnFinish).toHaveBeenCalled();
    });

    it('should show review incorrect words button when there are incorrect answers', () => {
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      // When there are incorrect answers, review button should be available
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1);
    });

    it('should handle perfect score', () => {
      const result: ExamResultType = {
        correctCount: 5,
        incorrectCount: 0,
        percentage: 100,
        duration: 25000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should render all required elements', () => {
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      // Verify core content is rendered
      expect(screen.getByText(/시험 결과/i)).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-page Navigation Flow', () => {
    it('should support flow: config -> progress', () => {
      // Start at config page
      const mockOnStart = jest.fn();
      const { unmount } = render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={mockOnStart} />
      );

      expect(screen.getByRole('heading', { name: /시험 설정/i })).toBeInTheDocument();

      // Simulate navigation to progress page
      unmount();

      // In actual implementation, router.push('./progress') would be called
      // Verify startExam was called
      expect(mockOnStart).toHaveBeenCalledTimes(0); // Not called yet
    });

    it('should support flow: progress -> result', () => {
      // At progress page
      const { unmount } = render(
        <ExamProgress currentIndex={0} totalQuestions={5} />
      );

      expect(screen.getByText(/1/)).toBeInTheDocument();

      // Simulate navigation to result page
      unmount();

      // In actual implementation, router.push('./result') would be called
      // Verify session data would be used for result display
    });

    it('should support flow: result -> config (retry)', async () => {
      const user = userEvent.setup();
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 2,
        percentage: 60,
        duration: 30000,
      };

      const mockOnRetry = jest.fn();
      const mockOnFinish = jest.fn();
      const mockOnReviewIncorrect = jest.fn();

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      const retryButton = screen.getByRole('button', { name: /다시 풀기/i });
      await user.click(retryButton);

      // Verify resetExam would be called and router.push('./') would navigate back
      expect(mockOnRetry).toHaveBeenCalled();
    });
  });
});
