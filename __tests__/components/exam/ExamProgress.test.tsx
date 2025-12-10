/**
 * Tests for ExamProgress component
 *
 * Comprehensive test suite covering:
 * - Progress bar display and calculation
 * - Question counter display
 * - Answered counter display
 * - Elapsed time display
 * - Animation on progress change
 * - Responsive design
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExamProgress } from '@/app/components/exam/ExamProgress';

describe('ExamProgress', () => {
  describe('Rendering', () => {
    it('should render the progress bar container', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should render question counter text', () => {
      render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
        />
      );

      expect(screen.getByText(/문제 4\/10/i)).toBeInTheDocument();
    });

    it('should render answered counter text', () => {
      render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
        />
      );

      expect(screen.getByText(/답변 완료: 3\/10/i)).toBeInTheDocument();
    });
  });

  describe('Question Counter', () => {
    it('should display current question index correctly', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      expect(screen.getByText(/문제 1\/10/i)).toBeInTheDocument();
    });

    it('should increment question counter', () => {
      const { rerender } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      expect(screen.getByText(/문제 1\/10/i)).toBeInTheDocument();

      rerender(
        <ExamProgress
          currentIndex={4}
          totalQuestions={10}
          answeredCount={4}
        />
      );

      expect(screen.getByText(/문제 5\/10/i)).toBeInTheDocument();
    });

    it('should display correct total questions', () => {
      render(
        <ExamProgress
          currentIndex={2}
          totalQuestions={5}
          answeredCount={2}
        />
      );

      expect(screen.getByText(/문제 3\/5/i)).toBeInTheDocument();
    });

    it('should handle last question correctly', () => {
      render(
        <ExamProgress
          currentIndex={9}
          totalQuestions={10}
          answeredCount={10}
        />
      );

      expect(screen.getByText(/문제 10\/10/i)).toBeInTheDocument();
    });
  });

  describe('Answered Counter', () => {
    it('should display answered count correctly', () => {
      render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
        />
      );

      expect(screen.getByText(/답변 완료: 3\/10/i)).toBeInTheDocument();
    });

    it('should increment answered count when user submits answer', () => {
      const { rerender } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      expect(screen.getByText(/답변 완료: 0\/10/i)).toBeInTheDocument();

      rerender(
        <ExamProgress
          currentIndex={1}
          totalQuestions={10}
          answeredCount={1}
        />
      );

      expect(screen.getByText(/답변 완료: 1\/10/i)).toBeInTheDocument();
    });

    it('should not exceed total questions count', () => {
      render(
        <ExamProgress
          currentIndex={10}
          totalQuestions={10}
          answeredCount={10}
        />
      );

      expect(screen.getByText(/답변 완료: 10\/10/i)).toBeInTheDocument();
    });

    it('should start from 0 answered count', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      expect(screen.getByText(/답변 완료: 0\/10/i)).toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('should show 0% progress at the beginning', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      const progressFill = container.querySelector('[style*="width"]');
      expect(progressFill).toHaveStyle('width: 0%');
    });

    it('should show 50% progress at halfway point', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={5}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      const progressFill = container.querySelector('[style*="width"]') as HTMLElement;
      expect(progressFill?.style.width).toContain('50');
    });

    it('should show 100% progress when all questions answered', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={9}
          totalQuestions={10}
          answeredCount={10}
        />
      );

      const progressFill = container.querySelector('[style*="width"]') as HTMLElement;
      expect(progressFill?.style.width).toContain('100');
    });

    it('should calculate progress correctly based on current index', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={2}
          totalQuestions={5}
          answeredCount={2}
        />
      );

      const progressFill = container.querySelector('[style*="width"]') as HTMLElement;
      expect(progressFill?.style.width).toContain('40');
    });

    it('should update progress bar when currentIndex changes', () => {
      const { container, rerender } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
        />
      );

      let progressFill = container.querySelector('[style*="width"]');
      expect(progressFill).toHaveStyle('width: 0%');

      rerender(
        <ExamProgress
          currentIndex={5}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      progressFill = container.querySelector('[style*="width"]');
      expect(progressFill).toHaveStyle('width: 50%');
    });
  });

  describe('Elapsed Time Display', () => {
    it('should render elapsed time when provided', () => {
      render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
          timeElapsed={120000} // 2 minutes in milliseconds
        />
      );

      expect(screen.getByText(/소요 시간: 2분 0초/i)).toBeInTheDocument();
    });

    it('should format time correctly for minutes and seconds', () => {
      render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
          timeElapsed={330000} // 5 minutes 30 seconds in milliseconds
        />
      );

      expect(screen.getByText(/소요 시간: 5분 30초/i)).toBeInTheDocument();
    });

    it('should handle less than one minute', () => {
      render(
        <ExamProgress
          currentIndex={1}
          totalQuestions={10}
          answeredCount={1}
          timeElapsed={45000} // 45 seconds in milliseconds
        />
      );

      expect(screen.getByText(/소요 시간: 0분 45초/i)).toBeInTheDocument();
    });

    it('should not render time when timeElapsed is not provided', () => {
      render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
        />
      );

      expect(screen.queryByText(/소요 시간/i)).not.toBeInTheDocument();
    });

    it('should handle zero elapsed time', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
          timeElapsed={0}
        />
      );

      expect(container.textContent).toContain('0분');
      expect(container.textContent).toContain('0초');
    });

    it('should update time display when timeElapsed changes', () => {
      const { rerender, container } = render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={10}
          answeredCount={0}
          timeElapsed={60000} // 1 minute
        />
      );

      expect(container.textContent).toContain('1분');
      expect(container.textContent).toContain('0초');

      rerender(
        <ExamProgress
          currentIndex={5}
          totalQuestions={10}
          answeredCount={5}
          timeElapsed={180000} // 3 minutes
        />
      );

      expect(container.textContent).toContain('3분');
      expect(container.textContent).toContain('0초');
    });
  });

  describe('Responsive Design', () => {
    it('should render all components on mobile viewport', () => {
      window.innerWidth = 375;
      const { container } = render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
          timeElapsed={180000}
        />
      );

      expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
      expect(screen.getByText(/문제 4\/10/i)).toBeInTheDocument();
    });

    it('should render all components on tablet viewport', () => {
      window.innerWidth = 768;
      const { container } = render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
          timeElapsed={180000}
        />
      );

      expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
      expect(screen.getByText(/문제 4\/10/i)).toBeInTheDocument();
    });

    it('should render all components on desktop viewport', () => {
      window.innerWidth = 1920;
      const { container } = render(
        <ExamProgress
          currentIndex={3}
          totalQuestions={10}
          answeredCount={3}
          timeElapsed={180000}
        />
      );

      expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
      expect(screen.getByText(/문제 4\/10/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible progress bar with role', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={5}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('should have aria-valuemin and aria-valuemax', () => {
      const { container } = render(
        <ExamProgress
          currentIndex={5}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have readable progress text', () => {
      render(
        <ExamProgress
          currentIndex={5}
          totalQuestions={10}
          answeredCount={5}
        />
      );

      expect(screen.getByText(/문제 6\/10/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle currentIndex at boundary', () => {
      render(
        <ExamProgress
          currentIndex={9}
          totalQuestions={10}
          answeredCount={10}
        />
      );

      expect(screen.getByText(/문제 10\/10/i)).toBeInTheDocument();
    });

    it('should handle single question exam', () => {
      render(
        <ExamProgress
          currentIndex={0}
          totalQuestions={1}
          answeredCount={0}
        />
      );

      expect(screen.getByText(/문제 1\/1/i)).toBeInTheDocument();
    });

    it('should handle large number of questions', () => {
      render(
        <ExamProgress
          currentIndex={99}
          totalQuestions={100}
          answeredCount={99}
        />
      );

      expect(screen.getByText(/문제 100\/100/i)).toBeInTheDocument();
    });
  });
});
