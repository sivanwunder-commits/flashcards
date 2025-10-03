/**
 * Answer Utilities Module
 * 
 * Provides utility functions for answer validation and normalization.
 * Used across quiz components to ensure consistent answer checking.
 */

import { REGEX_PATTERNS } from './constants';

/**
 * Normalizes answer text for comparison
 * 
 * Normalization steps:
 * - Converts to lowercase
 * - Trims leading/trailing whitespace
 * - Removes punctuation marks
 * - Normalizes multiple spaces to single space
 * 
 * This allows for fuzzy matching while maintaining accuracy requirements.
 * 
 * @param answer - Raw answer text to normalize
 * @returns Normalized answer string suitable for comparison
 * 
 * @example
 * normalizeAnswer("  Comi!  ") // returns "comi"
 * normalizeAnswer("estava   a   correr.") // returns "estava a correr"
 */
export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(REGEX_PATTERNS.PUNCTUATION, '')
    .replace(REGEX_PATTERNS.MULTIPLE_SPACES, ' ');
}

/**
 * Checks if user's answer matches the correct answer using fuzzy matching
 * 
 * This function allows for minor variations in formatting (punctuation, case, spacing)
 * while ensuring the core conjugation is correct.
 * 
 * @param userInput - User's typed answer
 * @param correctAnswer - The correct answer to compare against
 * @returns True if answer is correct (after normalization), false otherwise
 * 
 * @example
 * checkAnswerMatch("comi", "Comi!") // returns true
 * checkAnswerMatch("comi!", "comi") // returns true
 * checkAnswerMatch("comeu", "comi") // returns false
 */
export function checkAnswerMatch(userInput: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeAnswer(userInput);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  // Exact match after normalization
  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  // Check for common variations
  const variations = [
    correctAnswer.toLowerCase(),
    correctAnswer.toLowerCase().replace(REGEX_PATTERNS.PUNCTUATION, ''),
  ];

  return variations.some(variation => 
    normalizeAnswer(variation) === normalizedUser
  );
}

/**
 * Formats time duration from milliseconds to human-readable string
 * 
 * @param milliseconds - Time duration in milliseconds
 * @returns Formatted string like "2m 30s" or "45s"
 * 
 * @example
 * formatTime(45000) // returns "45s"
 * formatTime(150000) // returns "2m 30s"
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

