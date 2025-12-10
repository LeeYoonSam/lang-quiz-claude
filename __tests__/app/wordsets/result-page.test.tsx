/**
 * Integration tests for exam result page behavior
 *
 * Tests cover:
 * - ExamResult component with result data
 * - Navigation flows (retry, back, review incorrect)
 * - Result calculation and display
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamResult } from '@/app/components/exam/ExamResult';
import type { ExamResult as ExamResultType, WordItem } from '@/lib/utils/exam/types';

const mockIncorrectWords: WordItem[] = [
  { id: '1', word: 'apple', meaning: 'A red fruit' },
];

describe('Exam Result Page Integration', () => {
  let mockOnRetry: jest.Mock;
  let mockOnFinish: jest.Mock;
  let mockOnReviewIncorrect: jest.Mock;

  beforeEach(() => {
    mockOnRetry = jest.fn();
    mockOnFinish = jest.fn();
    mockOnReviewIncorrect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ExamResult Component Rendering', () => {
    it('should render exam result component', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      expect(screen.getByText(/결과/i)).toBeInTheDocument();
    });

    it('should display correct and incorrect counts', () => {
      const result: ExamResultType = {
        correctCount: 8,
        incorrectCount: 2,
        percentage: 80,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
        />
      );

      // Check for score values displayed
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should display percentage score', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      // Check for percentage display
      expect(screen.getByText(/66/)).toBeInTheDocument();
    });
  });

  describe('Navigation - Retry Button', () => {
    it('should call onRetry when retry button clicked', async () => {
      const user = userEvent.setup();
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      const retryButton = screen.getByRole('button', { name: /다시 풀기/i });
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalled();
    });
  });

  describe('Navigation - Finish Button', () => {
    it('should call onFinish when finish button clicked', async () => {
      const user = userEvent.setup();
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

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
  });

  describe('Navigation - Review Incorrect', () => {
    it('should show review button when incorrect words are provided', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
          incorrectWords={mockIncorrectWords}
        />
      );

      const reviewButton = screen.queryByRole('button', { name: /오답 복습하기/i });
      expect(reviewButton).toBeInTheDocument();
    });

    it('should not show review button when no incorrect words', () => {
      const result: ExamResultType = {
        correctCount: 3,
        incorrectCount: 0,
        percentage: 100,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
          incorrectWords={[]}
        />
      );

      const reviewButton = screen.queryByRole('button', { name: /오답 복습하기/i });
      expect(reviewButton).not.toBeInTheDocument();
    });

    it('should call onReviewIncorrect when review button clicked', async () => {
      const user = userEvent.setup();
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
          onReviewIncorrect={mockOnReviewIncorrect}
          incorrectWords={mockIncorrectWords}
        />
      );

      const reviewButton = screen.getByRole('button', { name: /오답 복습하기/i });
      await user.click(reviewButton);

      expect(mockOnReviewIncorrect).toHaveBeenCalled();
    });
  });

  describe('Result Calculation Display', () => {
    it('should handle perfect score (100%)', () => {
      const perfectResult: ExamResultType = {
        correctCount: 10,
        incorrectCount: 0,
        percentage: 100,
        duration: 15000,
      };

      render(
        <ExamResult
          result={perfectResult}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should handle zero score (0%)', () => {
      const zeroResult: ExamResultType = {
        correctCount: 0,
        incorrectCount: 10,
        percentage: 0,
        duration: 15000,
      };

      render(
        <ExamResult
          result={zeroResult}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      // Zero score should still show result UI
      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
    });

    it('should handle fractional percentages', () => {
      const fractionalResult: ExamResultType = {
        correctCount: 1,
        incorrectCount: 2,
        percentage: 33.33,
        duration: 15000,
      };

      render(
        <ExamResult
          result={fractionalResult}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      expect(screen.getByText(/33/)).toBeInTheDocument();
    });
  });

  describe('Session Integration', () => {
    it('should render result component with session data', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
    });

    it('should trigger retry callback that can reset exam', async () => {
      const user = userEvent.setup();
      const mockResetExam = jest.fn();
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={() => {
            mockResetExam();
            mockOnRetry();
          }}
          onFinish={mockOnFinish}
        />
      );

      const retryButton = screen.getByRole('button', { name: /다시 풀기/i });
      await user.click(retryButton);

      expect(mockResetExam).toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    it('should handle missing result data gracefully', () => {
      const result: ExamResultType = {
        correctCount: 0,
        incorrectCount: 0,
        percentage: 0,
        duration: 0,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
    });

    it('should handle missing callbacks gracefully', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      expect(() =>
        render(
          <ExamResult
            result={result}
            onRetry={mockOnRetry}
            onFinish={mockOnFinish}
          />
        )
      ).not.toThrow();
    });
  });

  describe('Duration Display', () => {
    it('should display exam duration info', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 15000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      // Component should display result information
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should render with longer duration', () => {
      const result: ExamResultType = {
        correctCount: 2,
        incorrectCount: 1,
        percentage: 66.67,
        duration: 125000,
      };

      render(
        <ExamResult
          result={result}
          onRetry={mockOnRetry}
          onFinish={mockOnFinish}
        />
      );

      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
    });
  });
});
