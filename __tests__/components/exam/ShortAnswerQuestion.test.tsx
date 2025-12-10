/**
 * Tests for ShortAnswerQuestion component
 *
 * Comprehensive test suite covering:
 * - Question prompt display
 * - Text input functionality
 * - Submit button states
 * - Enter key submission
 * - Result display (correct/incorrect)
 * - Auto-focus on input
 * - Disabled state
 * - Pronunciation button for reverse mode
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShortAnswerQuestion } from '@/app/components/exam/ShortAnswerQuestion';
import type { ExamQuestion } from '@/lib/utils/exam/types';

const mockQuestion: ExamQuestion = {
  wordId: '1',
  type: 'short-answer',
  prompt: 'A red fruit',
  correctAnswer: 'apple',
};

const mockReverseQuestion: ExamQuestion = {
  wordId: '1',
  type: 'short-answer',
  prompt: 'apple',
  correctAnswer: 'A red fruit',
};

describe('ShortAnswerQuestion', () => {
  describe('Rendering', () => {
    it('should render the question prompt', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      expect(screen.getByText('A red fruit')).toBeInTheDocument();
    });

    it('should render text input for answer', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });

    it('should render submit button', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      expect(screen.getByRole('button', { name: /제출|확인/i })).toBeInTheDocument();
    });

    it('should have input placeholder text', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBeTruthy();
    });
  });

  describe('Text Input', () => {
    it('should display user input in the text field', async () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'apple');

      expect(handleAnswerChange).toHaveBeenCalledWith('apple');
    });

    it('should call onAnswerChange as user types', async () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'app');

      expect(handleAnswerChange).toHaveBeenCalledWith('a');
      expect(handleAnswerChange).toHaveBeenCalledWith('ap');
      expect(handleAnswerChange).toHaveBeenCalledWith('app');
    });

    it('should accept controlled value from parent component', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      const { rerender } = render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');

      rerender(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="banana"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      expect(input.value).toBe('banana');
    });

    it('should clear input when value prop changes to empty', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      const { rerender } = render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      let input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('apple');

      rerender(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('Submit Functionality', () => {
    it('should call onSubmit when submit button clicked', async () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /제출|확인/i });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should submit when Enter key is pressed', async () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, '{Enter}');

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should disable submit button when input is empty', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /제출|확인/i }) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when input has text', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /제출|확인/i }) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });
  });

  describe('Result Display', () => {
    it('should show correct answer styling when showResult is true and isCorrect is true', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={true}
          isCorrect={true}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.className).toContain('border-green');
    });

    it('should show incorrect answer styling when showResult is true and isCorrect is false', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="banana"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={true}
          isCorrect={false}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.className).toContain('border-red');
    });

    it('should show correct answer message when showResult is true and isCorrect is true', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={true}
          isCorrect={true}
        />
      );

      expect(screen.getByText(/정답/i)).toBeInTheDocument();
    });

    it('should show incorrect answer message when showResult is true and isCorrect is false', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="banana"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={true}
          isCorrect={false}
        />
      );

      expect(screen.getByText(/오답|정답은/i)).toBeInTheDocument();
    });

    it('should display the correct answer when showResult is true', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="banana"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={true}
          isCorrect={false}
        />
      );

      expect(screen.getByText(/apple/i)).toBeInTheDocument();
    });

    it('should not show result styling when showResult is false', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={false}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.className).not.toContain('border-green');
      expect(input.className).not.toContain('border-red');
    });
  });

  describe('Auto-focus', () => {
    it('should auto-focus the input on mount', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Disabled State', () => {
    it('should prevent interaction when disabled is true', async () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          disabled={true}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);

      await user.type(input, 'apple');
      expect(handleAnswerChange).not.toHaveBeenCalled();
    });

    it('should allow interaction when disabled is false', async () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          disabled={false}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('should show disabled styling when disabled is true', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          disabled={true}
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.className).toContain('opacity-50');
    });
  });

  describe('Reverse Mode', () => {
    it('should display prompt for reverse direction question', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockReverseQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('should show pronunciation button for reverse mode', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockReverseQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showPronunciationButton={true}
        />
      );

      expect(screen.getByRole('button', { name: /다시 듣기|🔊/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible input with proper label', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should have accessible submit button', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /제출|확인/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should announce result message to screen readers', () => {
      const handleAnswerChange = jest.fn();
      const handleSubmit = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestion}
          userAnswer="apple"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          showResult={true}
          isCorrect={true}
        />
      );

      expect(screen.getByText(/정답/i)).toBeInTheDocument();
    });
  });
});
