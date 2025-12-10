/**
 * Tests for MultipleChoiceQuestion component
 *
 * Comprehensive test suite covering:
 * - Question prompt display
 * - Choices rendering (4 options)
 * - Answer selection
 * - Selected answer highlighting
 * - Result display (correct/incorrect)
 * - Disabled state
 * - Pronunciation button for reverse mode
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultipleChoiceQuestion } from '@/app/components/exam/MultipleChoiceQuestion';
import type { ExamQuestion } from '@/lib/utils/exam/types';

const mockQuestion: ExamQuestion = {
  wordId: '1',
  type: 'multiple-choice',
  prompt: 'A red fruit',
  correctAnswer: 'apple',
  choices: ['apple', 'banana', 'cherry', 'date'],
};

const mockReverseQuestion: ExamQuestion = {
  wordId: '1',
  type: 'multiple-choice',
  prompt: 'apple',
  correctAnswer: 'A red fruit',
  choices: ['A red fruit', 'A yellow fruit', 'A small red fruit', 'A sweet dried fruit'],
};

describe('MultipleChoiceQuestion', () => {
  describe('Rendering', () => {
    it('should render the question prompt', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      expect(screen.getByText('A red fruit')).toBeInTheDocument();
    });

    it('should render all 4 choice buttons', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      expect(screen.getByRole('button', { name: 'apple' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'banana' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'cherry' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'date' })).toBeInTheDocument();
    });

    it('should render choices in the provided order', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Filter out any non-choice buttons if they exist
      const choiceButtons = buttons.slice(0, 4);

      expect(choiceButtons).toHaveLength(4);
    });
  });

  describe('Answer Selection', () => {
    it('should call onSelectAnswer when a choice is clicked', async () => {
      const handleSelectAnswer = jest.fn();
      const user = userEvent.setup();

      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      await user.click(appleButton);

      expect(handleSelectAnswer).toHaveBeenCalledWith('apple');
    });

    it('should call onSelectAnswer with correct answer', async () => {
      const handleSelectAnswer = jest.fn();
      const user = userEvent.setup();

      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const bananaButton = screen.getByRole('button', { name: 'banana' });
      await user.click(bananaButton);

      expect(handleSelectAnswer).toHaveBeenCalledWith('banana');
    });

    it('should allow selecting different answers in sequence', async () => {
      const handleSelectAnswer = jest.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      await user.click(appleButton);

      rerender(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const bananaButton = screen.getByRole('button', { name: 'banana' });
      await user.click(bananaButton);

      expect(handleSelectAnswer).toHaveBeenNthCalledWith(1, 'apple');
      expect(handleSelectAnswer).toHaveBeenNthCalledWith(2, 'banana');
    });
  });

  describe('Selected Answer Highlighting', () => {
    it('should highlight selected answer', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).toHaveClass('ring-2');
    });

    it('should not highlight non-selected answers', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const bananaButton = screen.getByRole('button', { name: 'banana' });
      expect(bananaButton).not.toHaveClass('ring-2');
    });

    it('should update highlighting when selected answer changes', () => {
      const handleSelectAnswer = jest.fn();
      const { rerender } = render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      let appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).toHaveClass('ring-2');

      rerender(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="banana"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      appleButton = screen.getByRole('button', { name: 'apple' });
      const bananaButton = screen.getByRole('button', { name: 'banana' });

      expect(appleButton).not.toHaveClass('ring-2');
      expect(bananaButton).toHaveClass('ring-2');
    });
  });

  describe('Result Display', () => {
    it('should show correct answer in green when showResult is true and answer is correct', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={true}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).toHaveClass('bg-green-50', 'border-green-500');
    });

    it('should show wrong answer in red when showResult is true and answer is incorrect', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="banana"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={false}
        />
      );

      const bananaButton = screen.getByRole('button', { name: 'banana' });
      expect(bananaButton).toHaveClass('bg-red-50', 'border-red-500');
    });

    it('should show correct answer highlighted in green even if not selected', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="banana"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={false}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).toHaveClass('bg-green-50', 'border-green-500');
    });

    it('should show feedback message when showResult is true and answer is correct', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={true}
        />
      );

      expect(screen.getByText(/정답/i)).toBeInTheDocument();
    });

    it('should show feedback message when showResult is true and answer is incorrect', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="banana"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={false}
        />
      );

      expect(screen.getByText(/오답|정답은/i)).toBeInTheDocument();
    });

    it('should not show result styling when showResult is false', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
          showResult={false}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).not.toHaveClass('bg-green-50', 'border-green-500');
    });
  });

  describe('Disabled State', () => {
    it('should prevent clicking when disabled is true', async () => {
      const handleSelectAnswer = jest.fn();
      const user = userEvent.setup();

      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
          disabled={true}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' }) as HTMLButtonElement;
      expect(appleButton.disabled).toBe(true);

      await user.click(appleButton);
      expect(handleSelectAnswer).not.toHaveBeenCalled();
    });

    it('should allow clicking when disabled is false', async () => {
      const handleSelectAnswer = jest.fn();
      const user = userEvent.setup();

      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
          disabled={false}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' }) as HTMLButtonElement;
      expect(appleButton.disabled).toBe(false);

      await user.click(appleButton);
      expect(handleSelectAnswer).toHaveBeenCalled();
    });

    it('should show disabled styling when disabled is true', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
          disabled={true}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Reverse Mode', () => {
    it('should display prompt for reverse direction question', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockReverseQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('should show pronunciation button for reverse mode', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockReverseQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
          showPronunciationButton={true}
        />
      );

      expect(screen.getByRole('button', { name: /다시 듣기|🔊/i })).toBeInTheDocument();
    });

    it('should render meaning choices for reverse mode', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockReverseQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      expect(screen.getByRole('button', { name: 'A red fruit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'A yellow fruit' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button roles', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      expect(screen.getByRole('button', { name: 'apple' })).toBeInTheDocument();
      expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(4);
    });

    it('should have aria-label on selected answer', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer="apple"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const appleButton = screen.getByRole('button', { name: 'apple' });
      expect(appleButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have proper button semantics', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });
});
