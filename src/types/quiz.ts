// Type definitions for quiz functionality

export interface QuizQuestion {
  id: string;
  question: string; // The phrase with blank
  options: string[]; // Array of 4 options (1 correct + 3 distractors)
  correctAnswer: string;
  correctAnswerIndex: number; // Index of correct answer in options array
  cardId: string; // Reference to the original card
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp when completed
  score?: number; // Number of correct answers
  totalQuestions: number;
  isCompleted: boolean;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent: number; // Time in milliseconds
}

export interface QuizResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  accuracy: number; // Percentage (0-100)
  timeSpent: number; // Total time in milliseconds
  answers: QuizAnswer[];
  date: string; // ISO date string
}
