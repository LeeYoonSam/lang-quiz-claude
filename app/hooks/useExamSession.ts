/**
 * useExamSession Hook
 *
 * Manages exam session state with SessionStorage persistence.
 * Handles exam lifecycle: config -> in-progress -> completed
 * Provides question generation, answer submission, and result calculation.
 *
 * Features:
 * - SessionStorage-based session persistence (survives page reload)
 * - Auto-save on every state change
 * - Resume capability for interrupted exams
 * - Integrated validation and scoring
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  generateQuestions,
  validateAnswer,
  calculateScore,
} from '@/lib/utils/exam';
import type {
  ExamQuestion,
  ExamAnswer,
  ExamResult,
  WordItem,
} from '@/lib/utils/exam/types';

export interface ExamConfig {
  mode: 'multiple-choice' | 'short-answer' | 'mixed';
  direction: 'forward' | 'reverse';
  questionCount: number;
}

export interface ExamSessionState {
  wordSetId: string;
  mode?: 'multiple-choice' | 'short-answer' | 'mixed';
  direction?: 'forward' | 'reverse';
  questions: ExamQuestion[];
  currentIndex: number;
  answers: ExamAnswer[];
  startTime: number;
  status: 'config' | 'in-progress' | 'completed';
}

export interface UseExamSessionResult {
  wordSetId: string;
  mode?: 'multiple-choice' | 'short-answer' | 'mixed';
  direction?: 'forward' | 'reverse';
  questions: ExamQuestion[];
  currentIndex: number;
  answers: ExamAnswer[];
  startTime: number;
  status: 'config' | 'in-progress' | 'completed';
  startExam: (config: ExamConfig) => void;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishExam: () => ExamResult;
  resetExam: () => void;
}

const STORAGE_KEY_PREFIX = 'exam_session_';

/**
 * Load session from sessionStorage with error handling
 */
function loadSessionFromStorage(
  storageKey: string
): ExamSessionState | null {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as ExamSessionState;
    }
  } catch (error) {
    console.error('Failed to load exam session from storage:', error);
  }
  return null;
}

/**
 * Save session to sessionStorage with error handling
 */
function saveSessionToStorage(
  storageKey: string,
  state: ExamSessionState
): void {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save exam session to storage:', error);
  }
}

/**
 * Remove session from sessionStorage with error handling
 */
function removeSessionFromStorage(storageKey: string): void {
  try {
    sessionStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to remove exam session from storage:', error);
  }
}

/**
 * Hook for managing exam session state with SessionStorage persistence
 */
export function useExamSession(
  wordSetId: string,
  words: WordItem[]
): UseExamSessionResult {
  const [state, setState] = useState<ExamSessionState>({
    wordSetId,
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
    status: 'config',
  });

  const storageKey = useMemo(
    () => `${STORAGE_KEY_PREFIX}${wordSetId}`,
    [wordSetId]
  );

  // Load existing session from sessionStorage on mount
  useEffect(() => {
    const savedState = loadSessionFromStorage(storageKey);
    if (savedState) {
      setState(savedState);
    }
  }, [wordSetId, storageKey]);

  // Persist state to sessionStorage whenever it changes
  useEffect(() => {
    saveSessionToStorage(storageKey, state);
  }, [state, storageKey]);

  /**
   * Start exam with configuration
   */
  const startExam = useCallback(
    (config: ExamConfig) => {
      const questions = generateQuestions(
        words,
        config.mode,
        config.direction,
        config.questionCount
      );

      const newState: ExamSessionState = {
        wordSetId,
        mode: config.mode,
        direction: config.direction,
        questions,
        currentIndex: 0,
        answers: [],
        startTime: Date.now(),
        status: 'in-progress',
      };

      setState(newState);
    },
    [wordSetId, words]
  );

  /**
   * Submit answer for current question
   */
  const submitAnswer = useCallback(
    (userAnswer: string) => {
      if (state.status !== 'in-progress' || state.questions.length === 0) {
        return;
      }

      const currentQuestion = state.questions[state.currentIndex];
      const isCorrect = validateAnswer(
        userAnswer,
        currentQuestion.correctAnswer
      );

      const newAnswer: ExamAnswer = {
        questionIndex: state.currentIndex,
        userAnswer,
        isCorrect,
      };

      setState((prevState) => ({
        ...prevState,
        answers: [...prevState.answers, newAnswer],
      }));
    },
    [state.status, state.questions, state.currentIndex]
  );

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex < prevState.questions.length - 1) {
        return {
          ...prevState,
          currentIndex: prevState.currentIndex + 1,
        };
      }
      return prevState;
    });
  }, []);

  /**
   * Move to previous question
   */
  const prevQuestion = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex > 0) {
        return {
          ...prevState,
          currentIndex: prevState.currentIndex - 1,
        };
      }
      return prevState;
    });
  }, []);

  /**
   * Finish exam and calculate results
   */
  const finishExam = useCallback((): ExamResult => {
    const result = calculateScore(state.answers, state.questions.length);

    setState((prevState) => ({
      ...prevState,
      status: 'completed',
    }));

    return {
      ...result,
      duration: Date.now() - state.startTime,
    };
  }, [state.answers, state.questions.length, state.startTime]);

  /**
   * Reset exam to config state
   */
  const resetExam = useCallback(() => {
    const newState: ExamSessionState = {
      wordSetId,
      questions: [],
      currentIndex: 0,
      answers: [],
      startTime: 0,
      status: 'config',
    };

    setState(newState);
    removeSessionFromStorage(storageKey);
  }, [wordSetId, storageKey]);

  return {
    wordSetId: state.wordSetId,
    mode: state.mode,
    direction: state.direction,
    questions: state.questions,
    currentIndex: state.currentIndex,
    answers: state.answers,
    startTime: state.startTime,
    status: state.status,
    startExam,
    submitAnswer,
    nextQuestion,
    prevQuestion,
    finishExam,
    resetExam,
  };
}
