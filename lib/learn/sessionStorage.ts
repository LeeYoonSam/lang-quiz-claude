// Type definitions
export interface LearnSession {
  wordSetId: string;
  mode: 'sequential' | 'random';
  words: Array<{
    id: string;
    text: string;
    meaning: string;
  }>;
  currentIndex: number;
  startTime: number;
}

// Session storage key format
function getSessionKey(wordSetId: string): string {
  return `learn_session_${wordSetId}`;
}

// Load session from sessionStorage
export function loadSession(wordSetId: string): LearnSession | null {
  try {
    const key = getSessionKey(wordSetId);
    const stored = sessionStorage.getItem(key);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as LearnSession;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

// Save session to sessionStorage
export function saveSession(
  wordSetId: string,
  session: LearnSession
): void {
  try {
    const key = getSessionKey(wordSetId);
    sessionStorage.setItem(key, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

// Clear session from sessionStorage
export function clearSession(wordSetId: string): void {
  try {
    const key = getSessionKey(wordSetId);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
