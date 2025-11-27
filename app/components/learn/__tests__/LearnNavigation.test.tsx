import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearnNavigation from '../LearnNavigation';

describe('LearnNavigation Component', () => {
  const defaultProps = {
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onComplete: jest.fn(),
    isFirstCard: false,
    isLastCard: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation buttons', () => {
    it('should render previous and next buttons', () => {
      render(<LearnNavigation {...defaultProps} />);

      expect(screen.getByRole('button', { name: /이전/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /다음/i })).toBeInTheDocument();
    });

    it('should call onPrevious when previous button is clicked', () => {
      const onPrevious = jest.fn();
      render(<LearnNavigation {...defaultProps} onPrevious={onPrevious} />);

      const previousButton = screen.getByRole('button', { name: /이전/i });
      fireEvent.click(previousButton);

      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    it('should call onNext when next button is clicked', () => {
      const onNext = jest.fn();
      render(<LearnNavigation {...defaultProps} onNext={onNext} />);

      const nextButton = screen.getByRole('button', { name: /다음/i });
      fireEvent.click(nextButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('First card state', () => {
    it('should disable previous button on first card', () => {
      render(<LearnNavigation {...defaultProps} isFirstCard={true} />);

      const previousButton = screen.getByRole('button', { name: /이전/i });
      expect(previousButton).toBeDisabled();
    });

    it('should not disable previous button when not on first card', () => {
      render(<LearnNavigation {...defaultProps} isFirstCard={false} />);

      const previousButton = screen.getByRole('button', { name: /이전/i });
      expect(previousButton).not.toBeDisabled();
    });

    it('should not call onPrevious when disabled', () => {
      const onPrevious = jest.fn();
      render(
        <LearnNavigation {...defaultProps} isFirstCard={true} onPrevious={onPrevious} />
      );

      const previousButton = screen.getByRole('button', { name: /이전/i });
      fireEvent.click(previousButton);

      expect(onPrevious).not.toHaveBeenCalled();
    });
  });

  describe('Last card state', () => {
    it('should show complete button on last card', () => {
      render(<LearnNavigation {...defaultProps} isLastCard={true} />);

      expect(screen.getByRole('button', { name: /학습 완료/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /다음/i })).not.toBeInTheDocument();
    });

    it('should call onComplete when complete button is clicked', () => {
      const onComplete = jest.fn();
      render(
        <LearnNavigation {...defaultProps} isLastCard={true} onComplete={onComplete} />
      );

      const completeButton = screen.getByRole('button', { name: /학습 완료/i });
      fireEvent.click(completeButton);

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should not show next button on last card', () => {
      render(<LearnNavigation {...defaultProps} isLastCard={true} />);

      expect(screen.queryByRole('button', { name: /다음/i })).not.toBeInTheDocument();
    });
  });

  describe('Middle card state', () => {
    it('should enable both buttons in middle of learning', () => {
      render(<LearnNavigation {...defaultProps} isFirstCard={false} isLastCard={false} />);

      const previousButton = screen.getByRole('button', { name: /이전/i });
      const nextButton = screen.getByRole('button', { name: /다음/i });

      expect(previousButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      render(<LearnNavigation {...defaultProps} />);

      const previousButton = screen.getByRole('button', { name: /이전/i });
      const nextButton = screen.getByRole('button', { name: /다음/i });

      expect(previousButton).toHaveAttribute('aria-label');
      expect(nextButton).toHaveAttribute('aria-label');
    });

    it('should indicate disabled state to screen readers', () => {
      render(<LearnNavigation {...defaultProps} isFirstCard={true} />);

      const previousButton = screen.getByRole('button', { name: /이전/i });
      expect(previousButton).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
