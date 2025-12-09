/**
 * Tests for useLearnSession hook
 */

import { renderHook, act } from '@testing-library/react';
import { useLearnSession } from '../useLearnSession';
import * as sessionStorageLib from '@/app/lib/learn/sessionStorage';
import type { Word } from '@/app/types/learn';

// Mock session storage
jest.mock('@/app/lib/learn/sessionStorage');

const mockWords: Word[] = [
  { id: '1', text: 'apple', meaning: '사과' },
  { id: '2', text: 'banana', meaning: '바나나' },
  { id: '3', text: 'cherry', meaning: '체리' },
  { id: '4', text: 'date', meaning: '대추' },
  { id: '5', text: 'elderberry', meaning: '접골목' },
];

describe('useLearnSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (sessionStorageLib.loadSession as jest.Mock).mockReturnValue(null);
    (sessionStorageLib.saveSession as jest.Mock).mockImplementation(() => {});
    (sessionStorageLib.removeSession as jest.Mock).mockImplementation(() => {});
  });

  describe('initialization', () => {
    it('should initialize with first word in sequential mode', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.mode).toBe('sequential');
      expect(result.current.words).toHaveLength(mockWords.length);
    });

    it('should maintain word order in sequential mode', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.words[0].id).toBe('1');
      expect(result.current.words[1].id).toBe('2');
      expect(result.current.words[4].id).toBe('5');
    });

    it('should shuffle words in random mode', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'random'),
      );

      // Check that words exist but might be in different order
      expect(result.current.words).toHaveLength(mockWords.length);
      const wordIds = result.current.words.map((w) => w.id).sort();
      const originalIds = mockWords.map((w) => w.id).sort();
      expect(wordIds).toEqual(originalIds);
    });

    it('should restore from existing session', () => {
      const existingSession = {
        wordSetId: 'test-set',
        mode: 'sequential' as const,
        words: mockWords,
        currentIndex: 2,
        startTime: Date.now(),
      };

      (sessionStorageLib.loadSession as jest.Mock).mockReturnValue(existingSession);

      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.currentIndex).toBe(2);
    });

    it('should not flip card initially', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.isFlipped).toBe(false);
    });
  });

  describe('navigation', () => {
    it('should navigate to next word', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.currentIndex).toBe(0);

      act(() => {
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it('should not go beyond last word', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.next();
        result.current.next();
        result.current.next();
        result.current.next();
        result.current.next();
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(mockWords.length - 1);
    });

    it('should navigate to previous word', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.next();
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(2);

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentIndex).toBe(1);
    });

    it('should not go below first word', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.previous();
        result.current.previous();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should reset flip state on navigation', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.next();
      });

      expect(result.current.isFlipped).toBe(false);
    });
  });

  describe('flip functionality', () => {
    it('should toggle flip state', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.isFlipped).toBe(false);

      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipped).toBe(false);
    });

    it('should flip multiple times', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.flip();
        });

        const expectedFlipped = (i + 1) % 2 === 1;
        expect(result.current.isFlipped).toBe(expectedFlipped);
      }
    });
  });

  describe('reset functionality', () => {
    it('should reset to initial state', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.next();
        result.current.next();
        result.current.flip();
      });

      expect(result.current.currentIndex).toBe(2);
      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.isFlipped).toBe(false);
    });

    it('should create new shuffled order on reset in random mode', async () => {
      const { result: result1 } = renderHook(() =>
        useLearnSession('test-set-1', mockWords, 'random'),
      );

      const firstOrder = result1.current.words.map((w) => w.id);

      act(() => {
        result1.current.reset();
      });

      const resetOrder = result1.current.words.map((w) => w.id);

      // Reset should create potentially new order (though might be same by chance)
      expect(result1.current.currentIndex).toBe(0);
      expect(result1.current.words).toHaveLength(mockWords.length);
    });
  });

  describe('session persistence', () => {
    it('should save session on initialization', async () => {
      renderHook(() => useLearnSession('test-set', mockWords, 'sequential'));

      expect(sessionStorageLib.saveSession).toHaveBeenCalled();
    });

    it('should save session on index change', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      const initialCallCount = (sessionStorageLib.saveSession as jest.Mock).mock.calls.length;

      act(() => {
        result.current.next();
      });

      const newCallCount = (sessionStorageLib.saveSession as jest.Mock).mock.calls.length;
      expect(newCallCount).toBeGreaterThan(initialCallCount);
    });

    it('should manually save session', async () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      const initialCallCount = (sessionStorageLib.saveSession as jest.Mock).mock.calls.length;

      act(() => {
        result.current.saveSession();
      });

      const newCallCount = (sessionStorageLib.saveSession as jest.Mock).mock.calls.length;
      expect(newCallCount).toBeGreaterThan(initialCallCount);
    });

    it('should manually load session', async () => {
      const savedSession = {
        wordSetId: 'test-set',
        mode: 'sequential' as const,
        words: mockWords,
        currentIndex: 3,
        startTime: Date.now(),
      };

      (sessionStorageLib.loadSession as jest.Mock).mockReturnValue(savedSession);

      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.loadSession();
      });

      expect(result.current.currentIndex).toBe(3);
    });
  });

  describe('current word access', () => {
    it('should provide current word', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      const currentWord = result.current.words[result.current.currentIndex];
      expect(currentWord.text).toBe('apple');
      expect(currentWord.meaning).toBe('사과');
    });

    it('should update current word on navigation', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      act(() => {
        result.current.next();
        result.current.next();
      });

      const currentWord = result.current.words[result.current.currentIndex];
      expect(currentWord.text).toBe('cherry');
      expect(currentWord.meaning).toBe('체리');
    });
  });

  describe('mode consistency', () => {
    it('should maintain sequential mode', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'sequential'),
      );

      expect(result.current.mode).toBe('sequential');

      act(() => {
        result.current.next();
        result.current.flip();
      });

      expect(result.current.mode).toBe('sequential');
    });

    it('should maintain random mode', () => {
      const { result } = renderHook(() =>
        useLearnSession('test-set', mockWords, 'random'),
      );

      expect(result.current.mode).toBe('random');
    });
  });
});
