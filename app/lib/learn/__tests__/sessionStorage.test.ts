/**
 * Tests for session storage utilities
 */

import {
  getSessionKey,
  saveSession,
  loadSession,
  removeSession,
  hasSession,
  clearAllSessions,
} from '../sessionStorage';
import type { LearnSession } from '@/app/types/learn';

// Mock sessionStorage
class MockSessionStorage implements Storage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value.toString());
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }
}

const mockSessionStorage = new MockSessionStorage();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
  configurable: true,
});

describe('sessionStorage utilities', () => {
  const mockSession: LearnSession = {
    wordSetId: 'test-id-123',
    mode: 'sequential',
    words: [
      { id: '1', text: 'apple', meaning: '사과' },
      { id: '2', text: 'banana', meaning: '바나나' },
    ],
    currentIndex: 0,
    startTime: Date.now(),
  };

  beforeEach(() => {
    mockSessionStorage.clear();
  });

  describe('getSessionKey', () => {
    it('should generate correct session key', () => {
      const key = getSessionKey('test-id');
      expect(key).toBe('learn_session_test-id');
    });

    it('should handle special characters in ID', () => {
      const key = getSessionKey('test-id-123_456');
      expect(key).toBe('learn_session_test-id-123_456');
    });
  });

  describe('saveSession and loadSession', () => {
    it('should save and load session correctly', () => {
      saveSession(mockSession);
      const loaded = loadSession('test-id-123');

      expect(loaded).toEqual(mockSession);
    });

    it('should return null for non-existent session', () => {
      const loaded = loadSession('non-existent');
      expect(loaded).toBeNull();
    });

    it('should overwrite existing session', () => {
      saveSession(mockSession);

      const updatedSession: LearnSession = {
        ...mockSession,
        currentIndex: 2,
      };

      saveSession(updatedSession);
      const loaded = loadSession('test-id-123');

      expect(loaded?.currentIndex).toBe(2);
    });

    it('should handle complex nested data', () => {
      const complexSession: LearnSession = {
        ...mockSession,
        words: Array.from({ length: 10 }, (_, i) => ({
          id: `word-${i}`,
          text: `text-${i}`,
          meaning: `meaning-${i}`,
        })),
      };

      saveSession(complexSession);
      const loaded = loadSession('test-id-123');

      expect(loaded?.words).toHaveLength(10);
      expect(loaded?.words[0].id).toBe('word-0');
    });
  });

  describe('removeSession', () => {
    it('should remove session from storage', () => {
      saveSession(mockSession);
      expect(hasSession('test-id-123')).toBe(true);

      removeSession('test-id-123');
      expect(hasSession('test-id-123')).toBe(false);
    });

    it('should not throw error when removing non-existent session', () => {
      expect(() => removeSession('non-existent')).not.toThrow();
    });
  });

  describe('hasSession', () => {
    it('should return true for existing session', () => {
      saveSession(mockSession);
      expect(hasSession('test-id-123')).toBe(true);
    });

    it('should return false for non-existent session', () => {
      expect(hasSession('non-existent')).toBe(false);
    });
  });

  describe('clearAllSessions', () => {
    it('should clear all learning sessions', () => {
      saveSession(mockSession);
      saveSession({
        ...mockSession,
        wordSetId: 'test-id-456',
      });

      expect(hasSession('test-id-123')).toBe(true);
      expect(hasSession('test-id-456')).toBe(true);

      clearAllSessions();

      expect(hasSession('test-id-123')).toBe(false);
      expect(hasSession('test-id-456')).toBe(false);
    });

    it('should only clear learning sessions', () => {
      // Add a non-learning session
      mockSessionStorage.setItem('other-key', 'value');

      saveSession(mockSession);
      clearAllSessions();

      expect(hasSession('test-id-123')).toBe(false);
      expect(mockSessionStorage.getItem('other-key')).toBe('value');
    });
  });

  describe('error handling', () => {
    it('should handle invalid JSON gracefully', () => {
      const key = getSessionKey('test-id');
      mockSessionStorage.setItem(key, 'invalid-json{');

      const loaded = loadSession('test-id');
      expect(loaded).toBeNull();
    });

    it('should handle storage quota exceeded', () => {
      const originalSetItem = window.sessionStorage.setItem;
      window.sessionStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveSession(mockSession)).toThrow('세션 저장에 실패했습니다.');

      window.sessionStorage.setItem = originalSetItem;
    });
  });
});
