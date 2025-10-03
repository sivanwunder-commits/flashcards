/**
 * Application Constants
 * 
 * Central location for all magic numbers, hardcoded strings, and configuration values.
 * This improves maintainability and makes it easier to update values across the application.
 */

// Quiz Configuration
export const QUIZ_CONSTANTS = {
  /** Default number of questions in a quiz session */
  DEFAULT_QUESTION_COUNT: 10,
  /** Delay in milliseconds before moving to next question after answering */
  ANSWER_FEEDBACK_DELAY_MS: 2000,
  /** Number of options in multiple choice questions */
  MULTIPLE_CHOICE_OPTIONS: 4,
  /** Option labels for multiple choice (A, B, C, D) */
  OPTION_LABELS: ['A', 'B', 'C', 'D'],
  /** Warning threshold for timer (in seconds) */
  TIMER_WARNING_THRESHOLD: 10,
} as const;

// Session Configuration
export const SESSION_CONSTANTS = {
  /** Interval for updating session stats display (in milliseconds) */
  STATS_UPDATE_INTERVAL_MS: 1000,
} as const;

// Default Tenses
export const DEFAULT_TENSES = [
  'pretérito_perfeito',
  'pretérito_imperfeito',
  'futuro_do_presente',
  'presente_do_subjuntivo',
  'imperfeito_do_subjuntivo',
] as const;

// UI Messages
export const UI_MESSAGES = {
  // Loading states
  LOADING_CARDS: 'Loading flashcards...',
  LOADING_QUIZ: 'Loading quiz questions...',
  LOADING_ADVENTURE: 'Loading your Portuguese learning adventure...',
  
  // Error messages
  ERROR_LOAD_CARDS: 'Failed to load cards',
  ERROR_NO_CARDS: 'No flashcards available',
  ERROR_NO_QUIZ_CARDS: 'No flashcards available for quiz',
  ERROR_NO_VALID_CARDS: 'No valid cards found in cards.json',
  
  // Success messages
  CORRECT_ANSWER: '✅ Correct! Well done!',
  INCORRECT_ANSWER: '❌ Incorrect. The correct answer was:',
  
  // Study mode
  NO_WRONG_CARDS: 'No wrong cards to review! Great job!',
  FLIP_HINT: 'Click to reveal answer',
  
  // Navigation
  BUTTON_NEXT: 'Next →',
  BUTTON_PREVIOUS: '← Previous',
  BUTTON_CONTINUE: 'Continue',
  BUTTON_SUBMIT: 'Submit',
  
  // Feedback
  FEEDBACK_CORRECT: 'Great job!',
  FEEDBACK_KEEP_PRACTICING: 'Keep practicing!',
} as const;

// Time Formatting
export const TIME_CONSTANTS = {
  /** Milliseconds in one second */
  MS_PER_SECOND: 1000,
  /** Seconds in one minute */
  SECONDS_PER_MINUTE: 60,
  /** Milliseconds in one minute */
  MS_PER_MINUTE: 60000,
} as const;

// Statistics Configuration
export const STATS_CONSTANTS = {
  /** Default number of days to show in progress over time chart */
  DEFAULT_PROGRESS_DAYS: 30,
} as const;

// Regex Patterns for Answer Normalization
export const REGEX_PATTERNS = {
  /** Pattern to remove punctuation marks */
  PUNCTUATION: /[.,!?;:]/g,
  /** Pattern to normalize multiple spaces to single space */
  MULTIPLE_SPACES: /\s+/g,
} as const;

// localStorage Keys
export const STORAGE_KEYS = {
  USER_PROGRESS: 'flashcard_user_progress',
  STUDY_SESSIONS: 'flashcard_study_sessions',
  QUIZ_RESULTS: 'flashcard_quiz_results',
  STATISTICS: 'flashcard_statistics',
  SETTINGS: 'flashcard_settings',
} as const;

// Animation Configuration
export const ANIMATION_CONSTANTS = {
  /** Card flip animation duration in milliseconds */
  CARD_FLIP_DURATION_MS: 200,
  /** Page transition duration in seconds */
  PAGE_TRANSITION_DURATION: 0.3,
} as const;

