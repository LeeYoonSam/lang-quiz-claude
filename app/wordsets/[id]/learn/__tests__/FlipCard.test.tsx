/**
 * Tests for FlipCard component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { FlipCard } from '../FlipCard';
import type { Word } from '@/app/types/learn';

const mockWord: Word = {
  id: '1',
  text: 'apple',
  meaning: '사과',
};

describe('FlipCard', () => {
  const defaultProps = {
    word: mockWord,
    isFlipped: false,
    onFlip: jest.fn(),
    onSpeak: jest.fn(),
    isSpeaking: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render front side initially', () => {
      render(<FlipCard {...defaultProps} />);

      expect(screen.getByText('뜻')).toBeInTheDocument();
      expect(screen.getByText('사과')).toBeInTheDocument();
      expect(screen.getByText('클릭하여 단어 보기')).toBeInTheDocument();
    });

    it('should display word on back side when flipped', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      expect(screen.getByText('단어')).toBeInTheDocument();
      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('should show speak button on back side', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      const speakButton = screen.getByRole('button', { name: /음성 듣기/i });
      expect(speakButton).toBeInTheDocument();
    });

    it('should show speaking state on button', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} isSpeaking={true} />);

      expect(screen.getByText('재생 중...')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onFlip when card is clicked', () => {
      render(<FlipCard {...defaultProps} />);

      const card = screen.getByTestId('flip-card');
      fireEvent.click(card);

      expect(defaultProps.onFlip).toHaveBeenCalled();
    });

    it('should call onSpeak when speak button is clicked', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      const speakButton = screen.getByRole('button', { name: /음성 듣기/i });
      fireEvent.click(speakButton);

      expect(defaultProps.onSpeak).toHaveBeenCalled();
    });

    it('should not trigger flip when speak button is clicked', () => {
      const { onFlip, onSpeak } = defaultProps;
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      const speakButton = screen.getByRole('button', { name: /음성 듣기/i });
      fireEvent.click(speakButton);

      expect(onSpeak).toHaveBeenCalled();
      expect(onFlip).not.toHaveBeenCalled();
    });

    it('should handle keyboard events for flip', () => {
      render(<FlipCard {...defaultProps} />);

      const card = screen.getByTestId('flip-card');
      fireEvent.keyDown(card, { key: ' ' });

      expect(defaultProps.onFlip).toHaveBeenCalled();
    });

    it('should handle Enter key for flip', () => {
      render(<FlipCard {...defaultProps} />);

      const card = screen.getByTestId('flip-card');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(defaultProps.onFlip).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label for front side', () => {
      render(<FlipCard {...defaultProps} isFlipped={false} />);

      const card = screen.getByTestId('flip-card');
      expect(card).toHaveAttribute('aria-label', '뜻: 사과');
    });

    it('should have proper aria-label for back side', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      const card = screen.getByTestId('flip-card');
      expect(card).toHaveAttribute('aria-label', '단어: apple');
    });

    it('should be keyboard accessible', () => {
      render(<FlipCard {...defaultProps} />);

      const card = screen.getByTestId('flip-card');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('should have accessible speak button', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      const speakButton = screen.getByRole('button', { name: /음성 듣기/i });
      expect(speakButton).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply responsive classes', () => {
      const { container } = render(<FlipCard {...defaultProps} />);

      const cardContainer = screen.getByTestId('flip-card');
      expect(cardContainer).toHaveClass('w-[90vw]', 'max-w-[400px]', 'md:w-[500px]');
    });

    it('should have proper height classes', () => {
      const { container } = render(<FlipCard {...defaultProps} />);

      const cardContainer = screen.getByTestId('flip-card');
      expect(cardContainer).toHaveClass('h-[300px]', 'md:h-[350px]', 'lg:h-[400px]');
    });
  });

  describe('word display', () => {
    it('should display meaning on front', () => {
      render(<FlipCard {...defaultProps} />);
      expect(screen.getByText('사과')).toBeInTheDocument();
    });

    it('should display word text on back', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);
      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('should handle long words with break-words', () => {
      const longWord: Word = {
        id: '2',
        text: 'internationalization',
        meaning: '국제화',
      };

      render(<FlipCard {...defaultProps} word={longWord} isFlipped={true} />);
      expect(screen.getByText('internationalization')).toBeInTheDocument();
    });

    it('should handle long meanings with break-words', () => {
      const longMeaning: Word = {
        id: '3',
        text: 'short',
        meaning: '매우 긴 설명으로 여러 단어를 포함하는 뜻',
      };

      render(<FlipCard {...defaultProps} word={longMeaning} isFlipped={false} />);
      expect(screen.getByText('매우 긴 설명으로 여러 단어를 포함하는 뜻')).toBeInTheDocument();
    });
  });
});
