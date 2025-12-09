/**
 * Learn Module Types
 *
 * Core type definitions for the flip card learning system.
 * Includes session state, UI component props, and utility types.
 */

/**
 * Word data structure with id, text, and meaning
 */
export interface Word {
  id: string;
  text: string;
  meaning: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Learning mode for word ordering
 */
export type LearnMode = 'sequential' | 'random';

/**
 * Learning session state stored in sessionStorage
 * Maintains current progress and configuration for ongoing session
 */
export interface LearnSession {
  wordSetId: string;
  mode: LearnMode;
  words: Word[];
  currentIndex: number;
  startTime: number;
}

/**
 * Result from useSpeech hook
 */
export interface UseSpeechResult {
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

/**
 * Result from useLearnSession hook
 */
export interface UseLearnSessionResult {
  words: Word[];
  currentIndex: number;
  isFlipped: boolean;
  mode: LearnMode;
  next: () => void;
  previous: () => void;
  flip: () => void;
  reset: () => void;
  saveSession: () => void;
  loadSession: () => void;
}

/**
 * Result from useKeyboard hook
 */
export interface UseKeyboardHandlers {
  onFlip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onExit: () => void;
}

/**
 * FlipCard component props
 */
export interface FlipCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

/**
 * LearnProgress component props
 */
export interface LearnProgressProps {
  current: number;
  total: number;
}

/**
 * LearnNavigation component props
 */
export interface LearnNavigationProps {
  isFirst: boolean;
  isLast: boolean;
  isSpeaking: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSpeak: () => void;
  onComplete: () => void;
}

/**
 * LearnModeSelect component props
 */
export interface LearnModeSelectProps {
  wordSetId: string;
  wordSetName: string;
  wordCount: number;
  onModeSelect: (mode: LearnMode) => void;
  onBack: () => void;
}

/**
 * LearnComplete component props
 */
export interface LearnCompleteProps {
  wordSetId: string;
  wordSetName: string;
  wordCount: number;
  duration?: number;
  onRetry: () => void;
  onExit: () => void;
}
