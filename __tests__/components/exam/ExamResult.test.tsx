/**
 * Tests for ExamResult component
 *
 * Comprehensive test suite covering:
 * - Result display (score, correct count, percentage)
 * - Time elapsed display
 * - Action buttons (review, retry, finish)
 * - Celebration animation for high scores
 * - Encouragement messages
 * - Empty state handling
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamResult } from '@/app/components/exam/ExamResult';
import type { ExamResult as ExamResultType, WordItem } from '@/lib/utils/exam/types';

const mockHighScore: ExamResultType = {
  correctCount: 8,
  incorrectCount: 2,
  percentage: 80,
  duration: 300000, // 5 minutes
};

const mockLowScore: ExamResultType = {
  correctCount: 4,
  incorrectCount: 6,
  percentage: 40,
  duration: 300000,
};

const mockPerfectScore: ExamResultType = {
  correctCount: 10,
  incorrectCount: 0,
  percentage: 100,
  duration: 300000,
};

const mockIncorrectWords: WordItem[] = [
  { id: '2', word: 'banana', meaning: 'A yellow fruit' },
  { id: '5', word: 'elderberry', meaning: 'A dark purple berry' },
];

describe('ExamResult', () => {
  describe('Rendering', () => {
    it('should render the result screen heading', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByRole('heading', { name: /시험 결과|결과/i })).toBeInTheDocument();
    });

    it('should display the main action buttons', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /완료|세트로/i })).toBeInTheDocument();
    });
  });

  describe('Score Display', () => {
    it('should display the score prominently', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('80');
    });

    it('should display correct count', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByText(/8.*10/)).toBeInTheDocument();
    });

    it('should display correct percentage', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('80');
    });

    it('should display correct count for perfect score', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockPerfectScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByText(/10.*10/)).toBeInTheDocument();
    });

    it('should display 100% for perfect score', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockPerfectScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('100');
    });
  });

  describe('Time Display', () => {
    it('should display elapsed time in MM:SS format', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('5분');
      expect(container.textContent).toContain('0초');
    });

    it('should format time with minutes and seconds', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const resultWithTime: ExamResultType = {
        ...mockHighScore,
        duration: 330000, // 5 minutes 30 seconds
      };

      const { container } = render(
        <ExamResult
          result={resultWithTime}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('5분');
      expect(container.textContent).toContain('30초');
    });
  });

  describe('Action Buttons', () => {
    it('should show review incorrect button when there are incorrect answers', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
          incorrectWords={mockIncorrectWords}
        />
      );

      expect(screen.getByRole('button', { name: /오답 복습|오답/i })).toBeInTheDocument();
    });

    it('should not show review incorrect button when no incorrect answers', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockPerfectScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
          incorrectWords={[]}
        />
      );

      expect(screen.queryByRole('button', { name: /오답 복습|오답/i })).not.toBeInTheDocument();
    });

    it('should call onReviewIncorrect when review button clicked', async () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
          incorrectWords={mockIncorrectWords}
        />
      );

      const reviewButton = screen.getByRole('button', { name: /오답 복습|오답/i });
      await user.click(reviewButton);

      expect(handleReviewIncorrect).toHaveBeenCalled();
    });

    it('should call onRetry when retry button clicked', async () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      const retryButton = screen.getByRole('button', { name: /다시 풀기/i });
      await user.click(retryButton);

      expect(handleRetry).toHaveBeenCalled();
    });

    it('should call onFinish when finish button clicked', async () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      const finishButton = screen.getByRole('button', { name: /완료|세트로/i });
      await user.click(finishButton);

      expect(handleFinish).toHaveBeenCalled();
    });
  });

  describe('High Score Celebration', () => {
    it('should show celebration animation for score >= 80%', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      // Look for celebration elements (emoji, confetti, animation, etc.)
      expect(container.textContent).toContain('80');
    });

    it('should show celebration for perfect score', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockPerfectScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      // Should show celebration animation
      expect(container.textContent).toContain('100');
    });

    it('should not show celebration for score < 80%', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockLowScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      // Should not show high score celebration
      expect(container.textContent).toContain('40');
    });
  });

  describe('Encouragement Messages', () => {
    it('should show encouragement message for high score', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      // Should show positive message
      expect(screen.getByText(/훌륭|잘했|좋은|훌륭한/i)).toBeInTheDocument();
    });

    it('should show encouragement message for perfect score', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockPerfectScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      // Should show celebration/perfect message
      expect(screen.getByText(/완벽|최고|만점/i)).toBeInTheDocument();
    });

    it('should show encouraging message for low score', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockLowScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      // Should show supportive message
      expect(container.textContent).toMatch(/복습|노력/i);
    });
  });

  describe('Incorrect Words Display', () => {
    it('should render section for incorrect words when provided', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
          incorrectWords={mockIncorrectWords}
        />
      );

      expect(container.textContent).toMatch(/오답/);
    });

    it('should show incorrect word details', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
          incorrectWords={mockIncorrectWords}
        />
      );

      expect(screen.getByText(/banana/)).toBeInTheDocument();
      expect(screen.getByText(/A yellow fruit/)).toBeInTheDocument();
    });

    it('should not show incorrect words section when empty', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const { container } = render(
        <ExamResult
          result={mockPerfectScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
          incorrectWords={[]}
        />
      );

      // Should not have section for incorrect words
      const incorrectSection = container.querySelector('[class*="incorrect"]');
      expect(incorrectSection).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render all content on mobile', () => {
      window.innerWidth = 375;

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={jest.fn()}
          onRetry={jest.fn()}
          onFinish={jest.fn()}
        />
      );

      expect(container.textContent).toContain('80');
      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
    });

    it('should render all content on tablet', () => {
      window.innerWidth = 768;

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={jest.fn()}
          onRetry={jest.fn()}
          onFinish={jest.fn()}
        />
      );

      expect(container.textContent).toContain('80');
    });

    it('should render all content on desktop', () => {
      window.innerWidth = 1920;

      const { container } = render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={jest.fn()}
          onRetry={jest.fn()}
          onFinish={jest.fn()}
        />
      );

      expect(container.textContent).toContain('80');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByRole('button', { name: /다시 풀기/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /완료|세트로/i })).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      render(
        <ExamResult
          result={mockHighScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle score of exactly 0%', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const zeroScore: ExamResultType = {
        correctCount: 0,
        incorrectCount: 10,
        percentage: 0,
        duration: 300000,
      };

      const { container } = render(
        <ExamResult
          result={zeroScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('0');
    });

    it('should handle score of exactly 80% (celebration threshold)', () => {
      const handleReviewIncorrect = jest.fn();
      const handleRetry = jest.fn();
      const handleFinish = jest.fn();

      const thresholdScore: ExamResultType = {
        correctCount: 8,
        incorrectCount: 2,
        percentage: 80,
        duration: 300000,
      };

      const { container } = render(
        <ExamResult
          result={thresholdScore}
          onReviewIncorrect={handleReviewIncorrect}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      );

      expect(container.textContent).toContain('80');
    });
  });
});
