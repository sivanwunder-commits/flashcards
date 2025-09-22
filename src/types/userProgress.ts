// Type definitions for tracking user progress and sessions

import type { Card } from './card';

export interface StudySessionRecord {
  date: string; // ISO date string (YYYY-MM-DD or full ISO timestamp)
  cardsStudied: string[]; // store card ids for compactness
  correctAnswers: string[]; // card ids answered correctly
  incorrectAnswers: string[]; // card ids answered incorrectly
}

export interface StatisticsSummary {
  totalStudied: number;
  totalCorrect: number;
  // Accuracy by tense and verb type left as index signatures for flexibility during Phase 2
  accuracyByTense: Record<string, number>; // key: tense, value: accuracy 0..1
  accuracyByVerbType: Record<'regular' | 'irregular', number>;
}

export interface UserProgress {
  userId: string;
  sessions: StudySessionRecord[];
  wrongCards: string[]; // list of card ids the user got wrong
  statistics: StatisticsSummary;
}


