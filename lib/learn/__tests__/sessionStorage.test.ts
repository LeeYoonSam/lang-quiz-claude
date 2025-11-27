import {
  loadSession,
  saveSession,
  clearSession,
  LearnSession,
} from '../sessionStorage';

const mockWords = [
  { id: '1', text: 'apple', meaning: '사과' },
  { id: '2', text: 'banana', meaning: '바나나' },
];

const WORDSET_ID = 'test-wordset-id';

describe('Session Storage Utilities', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('saveSession', () => {
    it('should save session to sessionStorage', () => {
      const session: LearnSession = {
        wordSetId: WORDSET_ID,
        mode: 'sequential',
        words: mockWords,
        currentIndex: 0,
        startTime: Date.now(),
      };

      saveSession(WORDSET_ID, session);

      const key = `learn_session_${WORDSET_ID}`;
      const stored = sessionStorage.getItem(key);
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(session);
    });

    it('should overwrite existing session', () => {
      const key = `learn_session_${WORDSET_ID}`;
      sessionStorage.setItem(key, JSON.stringify({ test: 'old' }));

      const session: LearnSession = {
        wordSetId: WORDSET_ID,
        mode: 'random',
        words: mockWords,
        currentIndex: 1,
        startTime: Date.now(),
      };

      saveSession(WORDSET_ID, session);

      const stored = sessionStorage.getItem(key);
      expect(JSON.parse(stored!)).toEqual(session);
    });
  });

  describe('loadSession', () => {
    it('should load session from sessionStorage', () => {
      const key = `learn_session_${WORDSET_ID}`;
      const session: LearnSession = {
        wordSetId: WORDSET_ID,
        mode: 'sequential',
        words: mockWords,
        currentIndex: 0,
        startTime: Date.now(),
      };

      sessionStorage.setItem(key, JSON.stringify(session));

      const loaded = loadSession(WORDSET_ID);
      expect(loaded).toEqual(session);
    });

    it('should return null if session does not exist', () => {
      const loaded = loadSession('non-existent-id');
      expect(loaded).toBeNull();
    });

    it('should return null if stored data is invalid JSON', () => {
      const key = `learn_session_${WORDSET_ID}`;
      sessionStorage.setItem(key, 'invalid-json{');

      const loaded = loadSession(WORDSET_ID);
      expect(loaded).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should remove session from sessionStorage', () => {
      const key = `learn_session_${WORDSET_ID}`;
      const session: LearnSession = {
        wordSetId: WORDSET_ID,
        mode: 'sequential',
        words: mockWords,
        currentIndex: 0,
        startTime: Date.now(),
      };

      sessionStorage.setItem(key, JSON.stringify(session));
      expect(sessionStorage.getItem(key)).toBeTruthy();

      clearSession(WORDSET_ID);

      expect(sessionStorage.getItem(key)).toBeNull();
    });

    it('should not throw error if session does not exist', () => {
      expect(() => clearSession('non-existent-id')).not.toThrow();
    });
  });
});
