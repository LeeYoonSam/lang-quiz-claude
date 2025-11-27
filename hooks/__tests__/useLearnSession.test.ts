import { renderHook, act } from '@testing-library/react';
import { useLearnSession } from '../useLearnSession';

// Mock data
const mockWords = [
  { id: '1', text: 'apple', meaning: '사과' },
  { id: '2', text: 'banana', meaning: '바나나' },
  { id: '3', text: 'cherry', meaning: '체리' },
  { id: '4', text: 'date', meaning: '대추' },
  { id: '5', text: 'elderberry', meaning: '엘더베리' },
];

const WORDSET_ID = 'test-wordset-id';

describe('useLearnSession', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  describe('Sequential mode', () => {
    it('should initialize with first word in sequential mode', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentWord).toEqual(mockWords[0]);
      expect(result.current.mode).toBe('sequential');
    });

    it('should maintain original order in sequential mode', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      expect(result.current.words).toEqual(mockWords);
    });

    it('should navigate to next word', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      act(() => {
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.currentWord).toEqual(mockWords[1]);
    });

    it('should navigate to previous word', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      // Move to second word
      act(() => {
        result.current.next();
      });

      // Move back to first word
      act(() => {
        result.current.previous();
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentWord).toEqual(mockWords[0]);
    });

    it('should not go beyond first word when pressing previous', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should not go beyond last word when pressing next', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      // Move to last word
      for (let i = 0; i < mockWords.length; i++) {
        act(() => {
          result.current.next();
        });
      }

      const lastIndex = mockWords.length - 1;
      expect(result.current.currentIndex).toBe(lastIndex);
    });
  });

  describe('Random mode', () => {
    it('should shuffle words in random mode', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'random')
      );

      // Check that all words are present
      const shuffledWords = result.current.words;
      expect(shuffledWords).toHaveLength(mockWords.length);

      // Check that each word is included
      mockWords.forEach((word) => {
        expect(shuffledWords).toContainEqual(word);
      });

      // Note: We can't easily test that it's actually random since it could randomly match,
      // but we verify that if it's different, it's still a valid permutation
    });

    it('should initialize with first word (of shuffled order) in random mode', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'random')
      );

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentWord).toEqual(result.current.words[0]);
      expect(result.current.mode).toBe('random');
    });

    it('should navigate through shuffled order', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'random')
      );

      const firstWord = result.current.words[0];
      const secondWord = result.current.words[1];

      expect(result.current.currentWord).toEqual(firstWord);

      act(() => {
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.currentWord).toEqual(secondWord);
    });
  });

  describe('Session Storage', () => {
    it('should save session to sessionStorage', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      act(() => {
        result.current.next();
      });

      const key = `learn_session_${WORDSET_ID}`;
      const stored = sessionStorage.getItem(key);
      expect(stored).toBeTruthy();

      const session = JSON.parse(stored!);
      expect(session.currentIndex).toBe(1);
      expect(session.mode).toBe('sequential');
    });

    it('should load session from sessionStorage on init', () => {
      // First, set up a session
      const key = `learn_session_${WORDSET_ID}`;
      const savedSession = {
        wordSetId: WORDSET_ID,
        mode: 'sequential' as const,
        words: mockWords,
        currentIndex: 2,
        startTime: Date.now(),
      };
      sessionStorage.setItem(key, JSON.stringify(savedSession));

      // Then render hook
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      // It should load from sessionStorage (currentIndex = 2)
      expect(result.current.currentIndex).toBe(2);
    });

    it('should update sessionStorage when navigating', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      act(() => {
        result.current.next();
        result.current.next();
      });

      const key = `learn_session_${WORDSET_ID}`;
      const stored = sessionStorage.getItem(key);
      const session = JSON.parse(stored!);

      expect(session.currentIndex).toBe(2);
    });
  });

  describe('Reset functionality', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      // Navigate to third word
      act(() => {
        result.current.next();
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(2);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should remove session from sessionStorage on reset', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      act(() => {
        result.current.reset();
      });

      const key = `learn_session_${WORDSET_ID}`;
      const stored = sessionStorage.getItem(key);
      expect(stored).toBeNull();
    });
  });

  describe('Flip state', () => {
    it('should toggle flip state', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      expect(result.current.isFlipped).toBe(false);

      act(() => {
        result.current.toggleFlip();
      });

      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.toggleFlip();
      });

      expect(result.current.isFlipped).toBe(false);
    });

    it('should reset flip state when navigating', () => {
      const { result } = renderHook(() =>
        useLearnSession(WORDSET_ID, mockWords, 'sequential')
      );

      // Flip card
      act(() => {
        result.current.toggleFlip();
      });

      expect(result.current.isFlipped).toBe(true);

      // Navigate to next
      act(() => {
        result.current.next();
      });

      expect(result.current.isFlipped).toBe(false);
    });
  });
});
