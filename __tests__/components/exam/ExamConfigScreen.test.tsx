/**
 * Tests for ExamConfigScreen component
 *
 * Comprehensive test suite covering:
 * - Component rendering and UI elements
 * - Mode selection (radio buttons)
 * - Direction selection (radio buttons)
 * - Question count slider/input
 * - Button states and callbacks
 * - Validation for insufficient words
 * - Disabled states
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamConfigScreen } from '@/app/components/exam/ExamConfigScreen';
import type { WordItem } from '@/lib/utils/exam/types';

const mockWordSet: WordItem[] = [
  { id: '1', word: 'apple', meaning: 'A red fruit' },
  { id: '2', word: 'banana', meaning: 'A yellow fruit' },
  { id: '3', word: 'cherry', meaning: 'A small red fruit' },
  { id: '4', word: 'date', meaning: 'A sweet dried fruit' },
  { id: '5', word: 'elderberry', meaning: 'A dark purple berry' },
];

const smallWordSet: WordItem[] = [
  { id: '1', word: 'apple', meaning: 'A red fruit' },
  { id: '2', word: 'banana', meaning: 'A yellow fruit' },
  { id: '3', word: 'cherry', meaning: 'A small red fruit' },
];

describe('ExamConfigScreen', () => {
  describe('Rendering', () => {
    it('should render the exam configuration screen', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      expect(screen.getByRole('heading', { name: /시험 설정/i })).toBeInTheDocument();
    });

    it('should render all three mode options', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      expect(screen.getByLabelText(/객관식/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/주관식/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/혼합/i)).toBeInTheDocument();
    });

    it('should render both direction options', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      expect(screen.getByLabelText(/정방향/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/역방향/i)).toBeInTheDocument();
    });

    it('should render question count input/slider', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const questionCountInput = screen.getByLabelText(/문제 개수/i);
      expect(questionCountInput).toBeInTheDocument();
    });

    it('should render Start and Cancel buttons', () => {
      const handleStart = jest.fn();
      const handleCancel = jest.fn();
      render(
        <ExamConfigScreen
          wordSet={mockWordSet}
          onStart={handleStart}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByRole('button', { name: /시험 시작/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /취소|뒤로/i })).toBeInTheDocument();
    });
  });

  describe('Mode Selection', () => {
    it('should allow selecting multiple-choice mode', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const multipleChoiceRadio = radios.find(r => r.value === 'multiple-choice')!;
      await user.click(multipleChoiceRadio);

      expect(multipleChoiceRadio.checked).toBe(true);
    });

    it('should allow selecting short-answer mode', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const shortAnswerRadio = radios.find(r => r.value === 'short-answer')!;
      await user.click(shortAnswerRadio);

      expect(shortAnswerRadio.checked).toBe(true);
    });

    it('should allow selecting mixed mode', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const mixedRadio = radios.find(r => r.value === 'mixed')!;
      await user.click(mixedRadio);

      expect(mixedRadio.checked).toBe(true);
    });

    it('should only allow one mode to be selected at a time', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const multipleChoiceRadio = radios.find(r => r.value === 'multiple-choice')!;
      const shortAnswerRadio = radios.find(r => r.value === 'short-answer')!;

      await user.click(multipleChoiceRadio);
      expect(multipleChoiceRadio.checked).toBe(true);

      await user.click(shortAnswerRadio);
      expect(multipleChoiceRadio.checked).toBe(false);
      expect(shortAnswerRadio.checked).toBe(true);
    });
  });

  describe('Direction Selection', () => {
    it('should allow selecting forward direction', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const forwardRadio = radios.find(r => r.value === 'forward')!;
      await user.click(forwardRadio);

      expect(forwardRadio.checked).toBe(true);
    });

    it('should allow selecting reverse direction', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const reverseRadio = radios.find(r => r.value === 'reverse')!;
      await user.click(reverseRadio);

      expect(reverseRadio.checked).toBe(true);
    });

    it('should only allow one direction to be selected at a time', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const forwardRadio = radios.find(r => r.value === 'forward')!;
      const reverseRadio = radios.find(r => r.value === 'reverse')!;

      await user.click(forwardRadio);
      expect(forwardRadio.checked).toBe(true);

      await user.click(reverseRadio);
      expect(forwardRadio.checked).toBe(false);
      expect(reverseRadio.checked).toBe(true);
    });
  });

  describe('Question Count', () => {
    it('should set minimum question count to 5', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const questionCountInput = screen.getByLabelText(/문제 개수/i) as HTMLInputElement;
      expect(questionCountInput.min).toBe('5');
    });

    it('should set maximum question count to wordSet length', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const questionCountInput = screen.getByLabelText(/문제 개수/i) as HTMLInputElement;
      expect(questionCountInput.max).toBe(mockWordSet.length.toString());
    });

    it('should update question count when input changes', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const questionCountInput = screen.getByLabelText(/문제 개수/i) as HTMLInputElement;
      await user.clear(questionCountInput);
      await user.type(questionCountInput, '3');

      expect(questionCountInput.value).toBe('3');
    });

    it('should display default question count', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const questionCountInput = screen.getByLabelText(/문제 개수/i) as HTMLInputElement;
      expect(parseInt(questionCountInput.value)).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Button States', () => {
    it('should disable start button initially', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const startButton = screen.getByRole('button', { name: /시험 시작/i }) as HTMLButtonElement;
      expect(startButton.disabled).toBe(true);
    });

    it('should enable start button after selecting mode and direction', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const modeRadio = screen.getByLabelText(/객관식/i);
      const directionRadio = screen.getByLabelText(/정방향/i);
      const startButton = screen.getByRole('button', { name: /시험 시작/i }) as HTMLButtonElement;

      await user.click(modeRadio);
      await user.click(directionRadio);

      expect(startButton.disabled).toBe(false);
    });

    it('should call onStart with correct config when start button clicked', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      const modeRadio = screen.getByLabelText(/객관식/i);
      const directionRadio = screen.getByLabelText(/정방향/i);
      const questionCountInput = screen.getByLabelText(/문제 개수/i) as HTMLInputElement;
      const startButton = screen.getByRole('button', { name: /시험 시작/i });

      await user.click(modeRadio);
      await user.click(directionRadio);

      const selectedCount = parseInt(questionCountInput.value);
      await user.click(startButton);

      expect(handleStart).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'multiple-choice',
          direction: 'forward',
          questionCount: selectedCount,
        })
      );
    });

    it('should call onCancel when cancel button clicked', async () => {
      const handleStart = jest.fn();
      const handleCancel = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen
          wordSet={mockWordSet}
          onStart={handleStart}
          onCancel={handleCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /취소|뒤로/i });
      await user.click(cancelButton);

      expect(handleCancel).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should show warning when wordSet has less than 4 words for multiple-choice', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={smallWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const multipleChoiceRadio = radios.find(r => r.value === 'multiple-choice')!;
      await user.click(multipleChoiceRadio);

      expect(screen.getByText(/객관식은 단어가 4개 이상이어야 합니다/i)).toBeInTheDocument();
    });

    it('should disable start button when multiple-choice selected with insufficient words', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={smallWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const multipleChoiceRadio = radios.find(r => r.value === 'multiple-choice')!;
      const directionRadio = radios.find(r => r.value === 'forward')!;
      const startButton = screen.getByRole('button', { name: /시험 시작/i }) as HTMLButtonElement;

      await user.click(multipleChoiceRadio);
      await user.click(directionRadio);

      expect(startButton.disabled).toBe(true);
    });

    it('should not show warning for short-answer mode with few words', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={smallWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const shortAnswerRadio = radios.find(r => r.value === 'short-answer')!;
      await user.click(shortAnswerRadio);

      expect(screen.queryByText(/객관식은 단어가 4개 이상이어야 합니다/i)).not.toBeInTheDocument();
    });

    it('should allow starting short-answer mode with insufficient words for multiple-choice', async () => {
      const handleStart = jest.fn();
      const user = userEvent.setup();

      render(
        <ExamConfigScreen wordSet={smallWordSet} onStart={handleStart} />
      );

      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      const shortAnswerRadio = radios.find(r => r.value === 'short-answer')!;
      const directionRadio = radios.find(r => r.value === 'forward')!;
      const startButton = screen.getByRole('button', { name: /시험 시작/i }) as HTMLButtonElement;

      await user.click(shortAnswerRadio);
      await user.click(directionRadio);

      expect(startButton.disabled).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all inputs', () => {
      const handleStart = jest.fn();
      render(
        <ExamConfigScreen wordSet={mockWordSet} onStart={handleStart} />
      );

      // Check for radio button inputs (they're inside labels)
      const radios = screen.getAllByRole('radio') as HTMLInputElement[];
      expect(radios.some(r => r.value === 'multiple-choice')).toBe(true);
      expect(radios.some(r => r.value === 'forward')).toBe(true);
    });

    it('should have accessible button labels', () => {
      const handleStart = jest.fn();
      const handleCancel = jest.fn();
      render(
        <ExamConfigScreen
          wordSet={mockWordSet}
          onStart={handleStart}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByRole('button', { name: /시험 시작/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /취소|뒤로/i })).toBeInTheDocument();
    });
  });
});
