import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearnComplete from '../LearnComplete';

describe('LearnComplete Component', () => {
  const defaultProps = {
    wordCount: 20,
    onRestart: jest.fn(),
    onReturn: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display completion message', () => {
      render(<LearnComplete {...defaultProps} />);

      expect(screen.getByText(/학습을 완료했습니다/i)).toBeInTheDocument();
    });

    it('should display congratulation emoji', () => {
      render(<LearnComplete {...defaultProps} />);

      expect(screen.getByText(/🎉/)).toBeInTheDocument();
    });

    it('should display word count', () => {
      render(<LearnComplete {...defaultProps} wordCount={20} />);

      expect(screen.getByText(/20개/i)).toBeInTheDocument();
    });

    it('should display learning statistics', () => {
      render(<LearnComplete {...defaultProps} />);

      expect(screen.getByText(/단어를 학습했습니다/i)).toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('should render restart button', () => {
      render(<LearnComplete {...defaultProps} />);

      expect(screen.getByRole('button', { name: /다시 학습/i })).toBeInTheDocument();
    });

    it('should render return button', () => {
      render(<LearnComplete {...defaultProps} />);

      expect(screen.getByRole('button', { name: /세트로 돌아가기/i })).toBeInTheDocument();
    });

    it('should call onRestart when restart button is clicked', () => {
      const onRestart = jest.fn();
      render(<LearnComplete {...defaultProps} onRestart={onRestart} />);

      const restartButton = screen.getByRole('button', { name: /다시 학습/i });
      fireEvent.click(restartButton);

      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('should call onReturn when return button is clicked', () => {
      const onReturn = jest.fn();
      render(<LearnComplete {...defaultProps} onReturn={onReturn} />);

      const returnButton = screen.getByRole('button', { name: /세트로 돌아가기/i });
      fireEvent.click(returnButton);

      expect(onReturn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Word count display', () => {
    it('should handle single word', () => {
      render(<LearnComplete {...defaultProps} wordCount={1} />);

      expect(screen.getByText(/1개/i)).toBeInTheDocument();
    });

    it('should handle multiple words', () => {
      render(<LearnComplete {...defaultProps} wordCount={100} />);

      expect(screen.getByText(/100개/i)).toBeInTheDocument();
    });

    it('should update when wordCount prop changes', () => {
      const { rerender } = render(<LearnComplete {...defaultProps} wordCount={10} />);

      expect(screen.getByText(/10개/i)).toBeInTheDocument();

      rerender(<LearnComplete {...defaultProps} wordCount={50} />);

      expect(screen.getByText(/50개/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have main heading', () => {
      render(<LearnComplete {...defaultProps} />);

      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<LearnComplete {...defaultProps} />);

      const restartButton = screen.getByRole('button', { name: /다시 학습/i });
      const returnButton = screen.getByRole('button', { name: /세트로 돌아가기/i });

      expect(restartButton).toHaveAttribute('aria-label');
      expect(returnButton).toHaveAttribute('aria-label');
    });
  });

  describe('Layout', () => {
    it('should have centered layout', () => {
      const { container } = render(<LearnComplete {...defaultProps} />);

      const main = container.querySelector('main') || container.querySelector('[role="main"]');
      expect(main).toBeInTheDocument();
    });

    it('should display buttons in proper order', () => {
      render(<LearnComplete {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);

      const restartButton = screen.getByRole('button', { name: /다시 학습/i });
      const returnButton = screen.getByRole('button', { name: /세트로 돌아가기/i });

      expect(buttons).toContain(restartButton);
      expect(buttons).toContain(returnButton);
    });
  });
});
