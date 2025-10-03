// Type definitions for tracking user progress and sessions

import type { Card } from './card';

export interface StudySessionRecord {
  date: string; // ISO date string (YYYY-MM-DD or full ISO timestamp)
  cardsStudied: string[]; // store card ids for compactness
  correctAnswers: string[]; // card ids answered correctly
  incorrectAnswers: string[]; // card ids answered incorrectly
  timeSpent?: number; // optional time spent on session in milliseconds
}

export interface AccuracyRecord {
  correct: number;
  total: number;
}

export interface StatisticsSummary {
  totalStudied: number;
  totalCorrect: number;
  // Accuracy by tense and verb type with detailed tracking
  accuracyByTense: Record<string, AccuracyRecord>;
  accuracyByVerbType: Record<string, AccuracyRecord>;
  studyStreaks: number; // current study streak in days
  lastStudyDate: string | null; // ISO date string of last study session
}

export interface UserProgress {
  userId: string;
  sessions: StudySessionRecord[];
  wrongCards: string[]; // list of card ids the user got wrong
  statistics: StatisticsSummary;
}


