import type { Card } from '../types/card';
import type { UserProgress, StudySessionRecord, StatisticsSummary } from '../types/userProgress';
import type { QuizResult } from '../types/quiz';

/**
 * Progress Tracker Module
 * 
 * Manages user progress data persistence and statistics calculation.
 * Features include:
 * - localStorage-based data persistence
 * - Study session recording and tracking
 * - Quiz result processing
 * - Statistics aggregation by tense and verb type
 * - Study streak calculation
 * - Progress export/import functionality
 * - Wrong cards tracking for review mode
 */

// localStorage keys for data persistence
const STORAGE_KEYS = {
  USER_PROGRESS: 'flashcard_user_progress',
  STUDY_SESSIONS: 'flashcard_study_sessions',
  QUIZ_RESULTS: 'flashcard_quiz_results',
  STATISTICS: 'flashcard_statistics'
} as const;

// Default user progress structure for new users
const DEFAULT_USER_PROGRESS: UserProgress = {
  userId: 'default_user',
  sessions: [],
  wrongCards: [],
  statistics: {
    totalStudied: 0,
    totalCorrect: 0,
    accuracyByTense: {},
    accuracyByVerbType: {},
    studyStreaks: 0,
    lastStudyDate: null
  }
};

/**
 * Progress tracking utilities object
 * Provides methods for managing user progress data
 */
export const progressTracker = {
  /**
   * Saves user progress data to localStorage
   * @param progress - User progress object to save
   * @returns True if save successful, false otherwise
   */
  saveUserProgress(progress: UserProgress): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Failed to save user progress:', error);
      return false;
    }
  },

  /**
   * Loads user progress data from localStorage
   * Falls back to default progress if no data exists or load fails
   * @returns User progress object
   */
  loadUserProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMergeProgress(parsed);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
    return { ...DEFAULT_USER_PROGRESS };
  },

  // Validate and merge progress data
  validateAndMergeProgress(parsed: any): UserProgress {
    const progress: UserProgress = {
      userId: parsed.userId || DEFAULT_USER_PROGRESS.userId,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : DEFAULT_USER_PROGRESS.sessions,
      wrongCards: Array.isArray(parsed.wrongCards) ? parsed.wrongCards : DEFAULT_USER_PROGRESS.wrongCards,
      statistics: {
        totalStudied: typeof parsed.statistics?.totalStudied === 'number' ? parsed.statistics.totalStudied : 0,
        totalCorrect: typeof parsed.statistics?.totalCorrect === 'number' ? parsed.statistics.totalCorrect : 0,
        accuracyByTense: typeof parsed.statistics?.accuracyByTense === 'object' ? parsed.statistics.accuracyByTense : {},
        accuracyByVerbType: typeof parsed.statistics?.accuracyByVerbType === 'object' ? parsed.statistics.accuracyByVerbType : {},
        studyStreaks: typeof parsed.statistics?.studyStreaks === 'number' ? parsed.statistics.studyStreaks : 0,
        lastStudyDate: typeof parsed.statistics?.lastStudyDate === 'string' ? parsed.statistics.lastStudyDate : null
      }
    };
    return progress;
  },

  // Record a study session
  recordStudySession(cardsStudied: string[], correctAnswers: string[], incorrectAnswers: string[], timeSpent: number): boolean {
    try {
      const progress = this.loadUserProgress();
      const session: StudySessionRecord = {
        date: new Date().toISOString(),
        cardsStudied,
        correctAnswers,
        incorrectAnswers,
        timeSpent
      };

      progress.sessions.push(session);
      
      // Update wrong cards list
      incorrectAnswers.forEach(cardId => {
        if (!progress.wrongCards.includes(cardId)) {
          progress.wrongCards.push(cardId);
        }
      });

      // Update statistics
      this.updateStatistics(progress, cardsStudied, correctAnswers, incorrectAnswers);

      return this.saveUserProgress(progress);
    } catch (error) {
      console.error('Failed to record study session:', error);
      return false;
    }
  },

  // Record a quiz result
  recordQuizResult(quizResult: QuizResult): boolean {
    try {
      const progress = this.loadUserProgress();
      
      // Create a study session record from quiz result
      const session: StudySessionRecord = {
        date: new Date().toISOString(),
        cardsStudied: quizResult.answers.map(answer => answer.questionId),
        correctAnswers: quizResult.answers.filter(answer => answer.isCorrect).map(answer => answer.questionId),
        incorrectAnswers: quizResult.answers.filter(answer => !answer.isCorrect).map(answer => answer.questionId),
        timeSpent: quizResult.timeSpent
      };

      progress.sessions.push(session);

      // Update wrong cards list
      session.incorrectAnswers.forEach(cardId => {
        if (!progress.wrongCards.includes(cardId)) {
          progress.wrongCards.push(cardId);
        }
      });

      // Update statistics
      this.updateStatistics(progress, session.cardsStudied, session.correctAnswers, session.incorrectAnswers);

      return this.saveUserProgress(progress);
    } catch (error) {
      console.error('Failed to record quiz result:', error);
      return false;
    }
  },

  // Update statistics based on study data
  updateStatistics(progress: UserProgress, cardsStudied: string[], correctAnswers: string[], _incorrectAnswers: string[]): void {
    const stats = progress.statistics;
    
    // Update totals
    stats.totalStudied += cardsStudied.length;
    stats.totalCorrect += correctAnswers.length;

    // Update study streak
    this.updateStudyStreak(stats);

    // Note: We'll need card data to update tense and verb type statistics
    // This will be handled by the statistics calculator
  },

  // Update study streak
  updateStudyStreak(stats: StatisticsSummary): void {
    const today = new Date().toDateString();
    const lastStudyDate = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : null;
    
    if (lastStudyDate === today) {
      // Already studied today, no change to streak
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (lastStudyDate === yesterdayString) {
      // Studied yesterday, increment streak
      stats.studyStreaks += 1;
    } else if (lastStudyDate !== today) {
      // Missed a day, reset streak
      stats.studyStreaks = 1;
    }
    
    stats.lastStudyDate = new Date().toISOString();
  },

  // Get wrong cards for review
  getWrongCards(): string[] {
    const progress = this.loadUserProgress();
    return progress.wrongCards;
  },

  // Clear wrong cards list
  clearWrongCards(): boolean {
    try {
      const progress = this.loadUserProgress();
      progress.wrongCards = [];
      return this.saveUserProgress(progress);
    } catch (error) {
      console.error('Failed to clear wrong cards:', error);
      return false;
    }
  },

  // Get all study sessions
  getStudySessions(): StudySessionRecord[] {
    const progress = this.loadUserProgress();
    return progress.sessions;
  },

  // Get statistics summary
  getStatistics(): StatisticsSummary {
    const progress = this.loadUserProgress();
    return progress.statistics;
  },

  // Clear all progress data
  clearAllProgress(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear progress data:', error);
      return false;
    }
  },

  // Export progress data
  exportProgress(): string | null {
    try {
      const progress = this.loadUserProgress();
      return JSON.stringify(progress, null, 2);
    } catch (error) {
      console.error('Failed to export progress:', error);
      return null;
    }
  },

  // Import progress data
  importProgress(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      const progress = this.validateAndMergeProgress(parsed);
      return this.saveUserProgress(progress);
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }
};

// Statistics calculator
export const statisticsCalculator = {
  // Calculate detailed statistics with card data
  calculateDetailedStatistics(cards: Card[]): StatisticsSummary {
    const progress = progressTracker.loadUserProgress();
    const stats = { ...progress.statistics };
    
    // Reset detailed statistics
    stats.accuracyByTense = {};
    stats.accuracyByVerbType = {};
    
    // Create card lookup map
    const cardMap = new Map(cards.map(card => [card.id, card]));
    
    // Process all sessions
    progress.sessions.forEach(session => {
      session.cardsStudied.forEach(cardId => {
        const card = cardMap.get(cardId);
        if (!card) return;
        
        const isCorrect = session.correctAnswers.includes(cardId);
        
        // Update tense statistics
        if (!stats.accuracyByTense[card.tense]) {
          stats.accuracyByTense[card.tense] = { correct: 0, total: 0 };
        }
        stats.accuracyByTense[card.tense].total += 1;
        if (isCorrect) {
          stats.accuracyByTense[card.tense].correct += 1;
        }
        
        // Update verb type statistics
        if (!stats.accuracyByVerbType[card.verbType]) {
          stats.accuracyByVerbType[card.verbType] = { correct: 0, total: 0 };
        }
        stats.accuracyByVerbType[card.verbType].total += 1;
        if (isCorrect) {
          stats.accuracyByVerbType[card.verbType].correct += 1;
        }
      });
    });
    
    return stats;
  },

  // Get accuracy percentage
  getAccuracyPercentage(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  },

  // Get study streak information
  getStreakInfo(): { current: number; longest: number } {
    const progress = progressTracker.loadUserProgress();
    const sessions = progress.sessions;
    
    if (sessions.length === 0) {
      return { current: 0, longest: 0 };
    }
    
    // Calculate current streak
    const current = progress.statistics.studyStreaks;
    
    // Calculate longest streak
    let longest = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    sortedSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      
      if (lastDate) {
        const daysDiff = Math.floor((sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          currentStreak += 1;
        } else if (daysDiff > 1) {
          longest = Math.max(longest, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = sessionDate;
    });
    
    longest = Math.max(longest, currentStreak);
    
    return { current, longest };
  },

  // Get progress over time data
  getProgressOverTime(days: number = 30): Array<{ date: string; studied: number; correct: number; accuracy: number }> {
    const progress = progressTracker.loadUserProgress();
    const sessions = progress.sessions;
    
    // Create date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Group sessions by date
    const dailyData = new Map<string, { studied: number; correct: number }>();
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.date).toDateString();
      const sessionDateObj = new Date(session.date);
      
      if (sessionDateObj >= startDate && sessionDateObj <= endDate) {
        if (!dailyData.has(sessionDate)) {
          dailyData.set(sessionDate, { studied: 0, correct: 0 });
        }
        
        const dayData = dailyData.get(sessionDate)!;
        dayData.studied += session.cardsStudied.length;
        dayData.correct += session.correctAnswers.length;
      }
    });
    
    // Convert to array and fill missing dates
    const result: Array<{ date: string; studied: number; correct: number; accuracy: number }> = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateString = date.toDateString();
      
      const dayData = dailyData.get(dateString) || { studied: 0, correct: 0 };
      const accuracy = dayData.studied > 0 ? Math.round((dayData.correct / dayData.studied) * 100) : 0;
      
      result.push({
        date: date.toISOString().split('T')[0],
        studied: dayData.studied,
        correct: dayData.correct,
        accuracy
      });
    }
    
    return result;
  }
};
