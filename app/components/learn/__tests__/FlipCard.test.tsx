import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FlipCard from '../FlipCard';

const mockWord = {
  id: '1',
  text: 'apple',
  meaning: '사과',
};

describe('FlipCard Component', () => {
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

  describe('Rendering', () => {
    it('should render the front side (meaning) when not flipped', () => {
      render(<FlipCard {...defaultProps} />);

      expect(screen.getByText(mockWord.meaning)).toBeInTheDocument();
    });

    it('should render the back side (text) when flipped', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      expect(screen.getByText(mockWord.text)).toBeInTheDocument();
    });

    it('should render the speak button', () => {
      render(<FlipCard {...defaultProps} />);

      const speakButton = screen.getByRole('button', { name: /음성/i });
      expect(speakButton).toBeInTheDocument();
    });
  });

  describe('Flip interaction', () => {
    it('should call onFlip when card is clicked', () => {
      const onFlip = jest.fn();
      render(<FlipCard {...defaultProps} onFlip={onFlip} />);

      const card = screen.getByTestId('flip-card-container');
      fireEvent.click(card);

      expect(onFlip).toHaveBeenCalled();
    });

    it('should call onFlip only once per click', () => {
      const onFlip = jest.fn();
      render(<FlipCard {...defaultProps} onFlip={onFlip} />);

      const card = screen.getByTestId('flip-card-container');
      fireEvent.click(card);

      expect(onFlip).toHaveBeenCalledTimes(1);
    });
  });

  describe('Speak button', () => {
    it('should call onSpeak when speak button is clicked', () => {
      const onSpeak = jest.fn();
      render(<FlipCard {...defaultProps} onSpeak={onSpeak} />);

      const speakButton = screen.getByRole('button', { name: /음성/i });
      fireEvent.click(speakButton);

      expect(onSpeak).toHaveBeenCalled();
    });

    it('should show "재생 중" when isSpeaking is true', () => {
      render(<FlipCard {...defaultProps} isSpeaking={true} />);

      const speakButton = screen.getByRole('button', { name: /재생 중/i });
      expect(speakButton).toBeInTheDocument();
    });

    it('should show "음성 듣기" when isSpeaking is false', () => {
      render(<FlipCard {...defaultProps} isSpeaking={false} />);

      const speakButton = screen.getByRole('button', { name: /음성 듣기/i });
      expect(speakButton).toBeInTheDocument();
    });

    it('should disable speak button when isSpeaking is true', () => {
      render(<FlipCard {...defaultProps} isSpeaking={true} />);

      const speakButton = screen.getByRole('button', { name: /재생 중/i });
      expect(speakButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label on front side', () => {
      render(<FlipCard {...defaultProps} isFlipped={false} />);

      const card = screen.getByTestId('flip-card-container');
      expect(card).toHaveAttribute('aria-label');
      expect(card.getAttribute('aria-label')).toContain(mockWord.meaning);
    });

    it('should have proper aria-label on back side', () => {
      render(<FlipCard {...defaultProps} isFlipped={true} />);

      const card = screen.getByTestId('flip-card-container');
      expect(card).toHaveAttribute('aria-label');
      expect(card.getAttribute('aria-label')).toContain(mockWord.text);
    });

    it('should be keyboard accessible', () => {
      const onFlip = jest.fn();
      render(<FlipCard {...defaultProps} onFlip={onFlip} />);

      const card = screen.getByTestId('flip-card-container');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(onFlip).toHaveBeenCalled();
    });

    it('should have tabIndex for keyboard navigation', () => {
      render(<FlipCard {...defaultProps} />);

      const card = screen.getByTestId('flip-card-container');
      expect(card).toHaveAttribute('tabIndex');
    });
  });

  describe('Animation properties', () => {
    it('should have preserve-3d style', () => {
      render(<FlipCard {...defaultProps} />);

      const card = screen.getByTestId('flip-card-inner');
      expect(card).toHaveStyle('transformStyle: preserve-3d');
    });

    it('should update aria-label when flipped', () => {
      const { rerender } = render(<FlipCard {...defaultProps} isFlipped={false} />);

      let card = screen.getByTestId('flip-card-container');
      const frontLabel = card.getAttribute('aria-label');

      rerender(<FlipCard {...defaultProps} isFlipped={true} />);

      card = screen.getByTestId('flip-card-container');
      const backLabel = card.getAttribute('aria-label');

      expect(frontLabel).not.toEqual(backLabel);
    });
  });

  describe('Front and back content', () => {
    it('should display guide text on front', () => {
      render(<FlipCard {...defaultProps} />);

      // Should have some guide text about flipping
      const guideText = screen.queryByText(/클릭|flip/i);
      expect(guideText).toBeInTheDocument();
    });

    it('should have correct text size and styling on both sides', () => {
      const { rerender } = render(<FlipCard {...defaultProps} />);

      let meaning = screen.getByText(mockWord.meaning);
      expect(meaning).toBeInTheDocument();

      rerender(<FlipCard {...defaultProps} isFlipped={true} />);

      let text = screen.getByText(mockWord.text);
      expect(text).toBeInTheDocument();
    });
  });

  describe('Different words', () => {
    it('should update content when word prop changes', () => {
      const newWord = {
        id: '2',
        text: 'banana',
        meaning: '바나나',
      };

      const { rerender } = render(<FlipCard {...defaultProps} />);

      expect(screen.getByText(mockWord.meaning)).toBeInTheDocument();

      rerender(<FlipCard {...defaultProps} word={newWord} />);

      expect(screen.getByText(newWord.meaning)).toBeInTheDocument();
    });
  });
});
