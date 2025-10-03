/**
 * Quiz Timer Hook
 * 
 * Custom React hook for managing countdown timers in quiz components.
 * Handles timer state, countdown logic, and auto-submit on timeout.
 */

import { useState, useEffect } from 'react';

/**
 * Configuration options for the quiz timer
 */
interface UseQuizTimerOptions {
  /** Time limit in seconds (0 or undefined means no timer) */
  timeLimit?: number;
  /** Whether the quiz question has been answered */
  hasAnswered: boolean;
  /** Callback to execute when timer expires */
  onTimeout: () => void;
  /** Dependency that triggers timer reset (e.g., question ID) */
  resetDependency: string | number;
}

/**
 * Return value from useQuizTimer hook
 */
interface UseQuizTimerReturn {
  /** Remaining time in seconds */
  timeRemaining: number;
  /** Timestamp when timer started (for calculating time spent) */
  startTime: number;
  /** Function to manually reset the timer */
  resetTimer: () => void;
}

/**
 * Custom hook for managing quiz question countdown timers
 * 
 * Features:
 * - Countdown from specified time limit
 * - Auto-submit when timer reaches zero
 * - Automatic reset when question changes
 * - Proper cleanup to prevent memory leaks
 * 
 * @param options - Configuration options for the timer
 * @returns Timer state and control functions
 * 
 * @example
 * const { timeRemaining, startTime } = useQuizTimer({
 *   timeLimit: 30,
 *   hasAnswered: false,
 *   onTimeout: handleSubmit,
 *   resetDependency: question.id
 * });
 */
export function useQuizTimer({
  timeLimit,
  hasAnswered,
  onTimeout,
  resetDependency,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [startTime, setStartTime] = useState(Date.now());

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(timeLimit || 0);
    setStartTime(Date.now());
  }, [resetDependency, timeLimit]);

  // Countdown timer effect
  useEffect(() => {
    // Only run timer if time limit is set and answer hasn't been submitted
    if (!timeLimit || timeLimit <= 0 || hasAnswered) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger timeout callback
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(timer);
  }, [timeLimit, hasAnswered, onTimeout]);

  /**
   * Manually reset the timer (useful for retry scenarios)
   */
  const resetTimer = () => {
    setTimeRemaining(timeLimit || 0);
    setStartTime(Date.now());
  };

  return {
    timeRemaining,
    startTime,
    resetTimer,
  };
}

