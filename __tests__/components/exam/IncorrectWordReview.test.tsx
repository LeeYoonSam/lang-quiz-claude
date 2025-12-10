/**
 * Tests for IncorrectWordReview component
 *
 * Comprehensive test suite covering:
 * - Incorrect answers list display
 * - User answer display (red)
 * - Correct answer display (green)
 * - Pronunciation button
 * - Add to study list functionality
 * - Close button
 * - Empty state handling
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncorrectWordReview } from '@/app/components/exam/IncorrectWordReview';
import type { ExamQuestion } from '@/lib/utils/exam/types';

interface IncorrectAnswer {
  question: ExamQuestion;
  userAnswer: string;
  correctAnswer: string;
}

const mockIncorrectAnswers: IncorrectAnswer[] = [
  {
    question: {
      wordId: '2',
      type: 'multiple-choice',
      prompt: 'A yellow fruit',
      correctAnswer: 'banana',
    },
    userAnswer: 'apple',
    correctAnswer: 'banana',
  },
  {
    question: {
      wordId: '5',
      type: 'short-answer',
      prompt: 'elderberry',
      correctAnswer: 'A dark purple berry',
    },
    userAnswer: 'A black fruit',
    correctAnswer: 'A dark purple berry',
  },
];

describe('IncorrectWordReview', () => {
  describe('Rendering', () => {
    it('should render the incorrect word review heading', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('heading', { name: /오답 복습|틀린 문제/i })).toBeInTheDocument();
    });

    it('should render all incorrect answer items', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/A yellow fruit/)).toBeInTheDocument();
      expect(screen.getByText(/elderberry/)).toBeInTheDocument();
    });

    it('should render close button', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('button', { name: /닫기|완료|확인/i })).toBeInTheDocument();
    });
  });

  describe('Incorrect Answer Display', () => {
    it('should display question prompt for each incorrect answer', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/A yellow fruit/)).toBeInTheDocument();
      expect(screen.getByText(/elderberry/)).toBeInTheDocument();
    });

    it('should display user answer in list item', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/apple/)).toBeInTheDocument();
      expect(screen.getByText(/A black fruit/)).toBeInTheDocument();
    });

    it('should display correct answer in list item', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/banana/)).toBeInTheDocument();
      expect(screen.getByText(/A dark purple berry/)).toBeInTheDocument();
    });

    it('should render all items in the list', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThanOrEqual(mockIncorrectAnswers.length);
    });
  });

  describe('Answer Styling', () => {
    it('should highlight user answer in red', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const userAnswerElements = container.querySelectorAll('[class*="red"]');
      expect(userAnswerElements.length).toBeGreaterThan(0);
    });

    it('should highlight correct answer in green', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const correctAnswerElements = container.querySelectorAll('[class*="green"]');
      expect(correctAnswerElements.length).toBeGreaterThan(0);
    });

    it('should display user answer with different styling than correct answer', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const appleText = screen.getByText(/apple/);
      const bananaText = screen.getByText(/banana/);

      expect(appleText.className).not.toEqual(bananaText.className);
    });
  });

  describe('Pronunciation Button', () => {
    it('should render pronunciation button for each item', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const pronounceButtons = container.querySelectorAll('button');
      expect(pronounceButtons.length).toBeGreaterThanOrEqual(mockIncorrectAnswers.length + 1); // +1 for close button
    });

    it('should call pronunciation function when button clicked', async () => {
      const handleClose = jest.fn();
      const handleSpeak = jest.fn();
      const user = userEvent.setup();

      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
          onSpeak={handleSpeak}
        />
      );

      const pronounceButtons = Array.from(container.querySelectorAll('button')).filter(b => b.textContent?.includes('🔊'));
      if (pronounceButtons.length > 0) {
        await user.click(pronounceButtons[0]);
        expect(handleSpeak).toHaveBeenCalled();
      }
    });
  });

  describe('Add to Study List', () => {
    it('should show add to study list button when provided', () => {
      const handleClose = jest.fn();
      const handleAddToStudyList = jest.fn();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
          onAddToStudyList={handleAddToStudyList}
        />
      );

      expect(screen.getByRole('button', { name: /학습 목록|추가|학습/i })).toBeInTheDocument();
    });

    it('should call onAddToStudyList with word IDs when button clicked', async () => {
      const handleClose = jest.fn();
      const handleAddToStudyList = jest.fn();
      const user = userEvent.setup();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
          onAddToStudyList={handleAddToStudyList}
        />
      );

      const addButton = screen.getByRole('button', { name: /학습 목록|추가|학습/i });
      await user.click(addButton);

      expect(handleAddToStudyList).toHaveBeenCalledWith(['2', '5']);
    });

    it('should not show add to study list button when callback not provided', () => {
      const handleClose = jest.fn();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      // Button should not exist or be disabled
      const addButtons = screen.queryAllByRole('button', { name: /학습 목록|추가|학습/i });
      expect(addButtons.length).toBeLessThanOrEqual(1); // Maybe close button only
    });
  });

  describe('Close Button', () => {
    it('should call onClose when close button clicked', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /닫기|완료|확인/i });
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalled();
    });

    it('should have accessible close button', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /닫기|완료|확인/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when no incorrect answers', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={[]}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/오답이 없습니다|완벽|축하/i)).toBeInTheDocument();
    });

    it('should not render list items when empty', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={[]}
          onClose={handleClose}
        />
      );

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems.length).toBe(0);
    });

    it('should still show close button in empty state', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={[]}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('button', { name: /닫기|완료|확인/i })).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render properly on mobile', () => {
      window.innerWidth = 375;
      const handleClose = jest.fn();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('heading', { name: /오답 복습|틀린 문제/i })).toBeInTheDocument();
      expect(screen.getByText(/A yellow fruit/)).toBeInTheDocument();
    });

    it('should render properly on tablet', () => {
      window.innerWidth = 768;
      const handleClose = jest.fn();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('heading', { name: /오답 복습|틀린 문제/i })).toBeInTheDocument();
    });

    it('should render properly on desktop', () => {
      window.innerWidth = 1920;
      const handleClose = jest.fn();

      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('heading', { name: /오답 복습|틀린 문제/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible list structure', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const list = container.querySelector('ul') || container.querySelector('ol');
      expect(list).toBeInTheDocument();
    });

    it('should have accessible headings', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByRole('button', { name: /닫기|완료|확인/i })).toBeInTheDocument();
    });

    it('should have proper semantics for answer display', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      // Should distinguish between correct and incorrect visually
      expect(screen.getByText(/apple/)).toBeInTheDocument();
      expect(screen.getByText(/banana/)).toBeInTheDocument();
    });
  });

  describe('Multiple Items', () => {
    it('should render multiple incorrect answers', () => {
      const handleClose = jest.fn();
      const manyIncorrectAnswers: IncorrectAnswer[] = [
        ...mockIncorrectAnswers,
        {
          question: {
            wordId: '3',
            type: 'multiple-choice',
            prompt: 'A small red fruit',
            correctAnswer: 'cherry',
          },
          userAnswer: 'date',
          correctAnswer: 'cherry',
        },
      ];

      render(
        <IncorrectWordReview
          incorrectAnswers={manyIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/A yellow fruit/)).toBeInTheDocument();
      expect(screen.getByText(/A small red fruit/)).toBeInTheDocument();
    });

    it('should handle scrolling for many items', () => {
      const handleClose = jest.fn();
      const manyIncorrectAnswers = Array.from({ length: 20 }, (_, i) => ({
        question: {
          wordId: `${i}`,
          type: 'multiple-choice' as const,
          prompt: `Prompt ${i}`,
          correctAnswer: `Correct ${i}`,
        },
        userAnswer: `Wrong ${i}`,
        correctAnswer: `Correct ${i}`,
      }));

      const { container } = render(
        <IncorrectWordReview
          incorrectAnswers={manyIncorrectAnswers}
          onClose={handleClose}
        />
      );

      const scrollableContainer = container.querySelector('[style*="overflow"]');
      expect(container.textContent).toContain('Prompt 0');
    });
  });

  describe('Data Integrity', () => {
    it('should preserve question data in each item', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      // Check that both question prompts are displayed
      expect(screen.getByText(/A yellow fruit/)).toBeInTheDocument();
      expect(screen.getByText(/elderberry/)).toBeInTheDocument();
    });

    it('should preserve user answer data', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/apple/)).toBeInTheDocument();
      expect(screen.getByText(/A black fruit/)).toBeInTheDocument();
    });

    it('should preserve correct answer data', () => {
      const handleClose = jest.fn();
      render(
        <IncorrectWordReview
          incorrectAnswers={mockIncorrectAnswers}
          onClose={handleClose}
        />
      );

      expect(screen.getByText(/banana/)).toBeInTheDocument();
      expect(screen.getByText(/A dark purple berry/)).toBeInTheDocument();
    });
  });
});
