/**
 * Integration tests for exam progress page behavior
 *
 * Tests cover:
 * - MultipleChoiceQuestion and ShortAnswerQuestion components
 * - ExamProgress component display
 * - Answer submission flow
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultipleChoiceQuestion } from '@/app/components/exam/MultipleChoiceQuestion';
import { ShortAnswerQuestion } from '@/app/components/exam/ShortAnswerQuestion';
import { ExamProgress } from '@/app/components/exam/ExamProgress';
import type { ExamQuestion } from '@/lib/utils/exam/types';

const mockQuestions: ExamQuestion[] = [
  {
    wordId: '1',
    type: 'multiple-choice',
    prompt: 'What is apple?',
    correctAnswer: 'A red fruit',
    choices: ['A red fruit', 'A yellow fruit', 'A small red fruit', 'A sweet dried fruit'],
  },
  {
    wordId: '2',
    type: 'short-answer',
    prompt: 'What is the meaning of banana?',
    correctAnswer: 'A yellow fruit',
  },
];

describe('Exam Progress Page Integration', () => {
  describe('MultipleChoiceQuestion Component', () => {
    it('should render multiple choice question with all choices', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      expect(screen.getByText(mockQuestions[0].prompt)).toBeInTheDocument();
      expect(screen.getByText('A red fruit')).toBeInTheDocument();
      expect(screen.getByText('A yellow fruit')).toBeInTheDocument();
      expect(screen.getByText('A small red fruit')).toBeInTheDocument();
      expect(screen.getByText('A sweet dried fruit')).toBeInTheDocument();
    });

    it('should call onSelectAnswer when choice is clicked', async () => {
      const user = userEvent.setup();
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      await user.click(screen.getByText('A red fruit'));
      expect(handleSelectAnswer).toHaveBeenCalledWith('A red fruit');
    });

    it('should highlight selected answer', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer="A red fruit"
          onSelectAnswer={handleSelectAnswer}
        />
      );

      const selectedButton = screen.getByText('A red fruit');
      expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show result feedback when showResult is true', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer="A red fruit"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={true}
        />
      );

      expect(screen.getByText(/정답입니다/)).toBeInTheDocument();
    });

    it('should show incorrect feedback when answer is wrong', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer="A yellow fruit"
          onSelectAnswer={handleSelectAnswer}
          showResult={true}
          isCorrect={false}
        />
      );

      expect(screen.getByText(/오답입니다/)).toBeInTheDocument();
      expect(screen.getByText(/정답: A red fruit/)).toBeInTheDocument();
    });

    it('should disable buttons when disabled prop is true', () => {
      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
          disabled={true}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('ShortAnswerQuestion Component', () => {
    it('should render short answer question', () => {
      const handleSubmit = jest.fn();
      const handleAnswerChange = jest.fn();
      render(
        <ShortAnswerQuestion
          question={mockQuestions[1]}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      expect(screen.getByText(mockQuestions[1].prompt)).toBeInTheDocument();
    });

    it('should call onAnswerChange when typing', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      const handleAnswerChange = jest.fn();

      const { rerender } = render(
        <ShortAnswerQuestion
          question={mockQuestions[1]}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 't');

      expect(handleAnswerChange).toHaveBeenCalled();
    });

    it('should call onSubmit when clicking submit with value', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      const handleAnswerChange = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestions[1]}
          userAnswer="test answer"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /제출/i });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should disable submit when input is empty', () => {
      const handleSubmit = jest.fn();
      const handleAnswerChange = jest.fn();
      render(
        <ShortAnswerQuestion
          question={mockQuestions[1]}
          userAnswer=""
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /제출/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('ExamProgress Component', () => {
    it('should display current question number', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      expect(screen.getByText(/문제 1\/10/)).toBeInTheDocument();
    });

    it('should display answered count', () => {
      render(
        <ExamProgress
          currentIndex={4}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      expect(screen.getByText(/답변 완료: 5\/10/)).toBeInTheDocument();
    });

    it('should display elapsed time when provided', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
          timeElapsed={65000}
        />
      );

      expect(screen.getByText(/소요 시간: 1분 5초/)).toBeInTheDocument();
    });

    it('should update progress bar based on answered count', () => {
      render(
        <ExamProgress
          currentIndex={4}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });
  });

  describe('Answer Submission Flow', () => {
    it('should allow selecting an answer for multiple choice', async () => {
      const user = userEvent.setup();
      const handleSelectAnswer = jest.fn();

      render(
        <MultipleChoiceQuestion
          question={mockQuestions[0]}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      await user.click(screen.getByText('A red fruit'));
      expect(handleSelectAnswer).toHaveBeenCalledWith('A red fruit');
    });

    it('should allow submitting answer for short answer', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      const handleAnswerChange = jest.fn();

      render(
        <ShortAnswerQuestion
          question={mockQuestions[1]}
          userAnswer="A yellow fruit"
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      );

      await user.click(screen.getByRole('button', { name: /제출/i }));

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty choices gracefully', () => {
      const invalidQuestion: ExamQuestion = {
        wordId: '99',
        type: 'multiple-choice',
        prompt: 'Invalid question',
        correctAnswer: 'answer',
        choices: [],
      };

      const handleSelectAnswer = jest.fn();
      render(
        <MultipleChoiceQuestion
          question={invalidQuestion}
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      // Component should still render the prompt
      expect(screen.getByText('Invalid question')).toBeInTheDocument();
    });

    it('should handle short answer type passed to multiple choice', () => {
      const handleSelectAnswer = jest.fn();
      const { container } = render(
        <MultipleChoiceQuestion
          question={mockQuestions[1]} // short-answer type
          selectedAnswer={null}
          onSelectAnswer={handleSelectAnswer}
        />
      );

      // Should return null for wrong question type
      expect(container.firstChild).toBeNull();
    });
  });
});
