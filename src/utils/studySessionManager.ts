import type { Card } from '../types/card';
import type { UserProgress, StudySessionRecord } from '../types/userProgress';
import { progressTracker } from './progressTracker';

export interface StudySession {
  id: string;
  startTime: string;
  endTime?: string;
  cardsStudied: string[];
  correctAnswers: string[];
  incorrectAnswers: string[];
  isActive: boolean;
}

export interface StudySessionStats {
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  timeSpent: number; // in milliseconds
}

class StudySessionManager {
  private currentSession: StudySession | null = null;
  private userProgress: UserProgress | null = null;

  constructor() {
    this.loadUserProgress();
  }

  // Session Management
  startNewSession(): StudySession {
    const sessionId = `session_${Date.now()}`;
    this.currentSession = {
      id: sessionId,
      startTime: new Date().toISOString(),
      cardsStudied: [],
      correctAnswers: [],
      incorrectAnswers: [],
      isActive: true
    };
    return this.currentSession;
  }

  endCurrentSession(): StudySessionRecord | null {
    if (!this.currentSession || !this.currentSession.isActive) {
      return null;
    }

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.isActive = false;

    const sessionRecord: StudySessionRecord = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      cardsStudied: [...this.currentSession.cardsStudied],
      correctAnswers: [...this.currentSession.correctAnswers],
      incorrectAnswers: [...this.currentSession.incorrectAnswers]
    };

    // Save session to user progress
    this.saveSessionToProgress(sessionRecord);
    
    // Clear current session
    this.currentSession = null;
    
    return sessionRecord;
  }

  getCurrentSession(): StudySession | null {
    return this.currentSession;
  }

  isSessionActive(): boolean {
    return this.currentSession?.isActive ?? false;
  }

  // Card Tracking
  recordCardStudied(cardId: string): void {
    if (!this.currentSession?.isActive) return;
    
    if (!this.currentSession.cardsStudied.includes(cardId)) {
      this.currentSession.cardsStudied.push(cardId);
    }
  }

  recordCorrectAnswer(cardId: string): void {
    if (!this.currentSession?.isActive) return;
    
    this.recordCardStudied(cardId);
    
    if (!this.currentSession.correctAnswers.includes(cardId)) {
      this.currentSession.correctAnswers.push(cardId);
    }
    
    // Remove from incorrect answers if it was there
    this.currentSession.incorrectAnswers = this.currentSession.incorrectAnswers.filter(id => id !== cardId);
  }

  recordIncorrectAnswer(cardId: string): void {
    if (!this.currentSession?.isActive) return;
    
    this.recordCardStudied(cardId);
    
    if (!this.currentSession.incorrectAnswers.includes(cardId)) {
      this.currentSession.incorrectAnswers.push(cardId);
    }
    
    // Remove from correct answers if it was there
    this.currentSession.correctAnswers = this.currentSession.correctAnswers.filter(id => id !== cardId);
  }

  // Wrong Cards Management
  getWrongCards(): string[] {
    return this.userProgress?.wrongCards ?? [];
  }

  addToWrongCards(cardId: string): void {
    if (!this.userProgress) {
      this.initializeUserProgress();
    }
    
    if (!this.userProgress!.wrongCards.includes(cardId)) {
      this.userProgress!.wrongCards.push(cardId);
      this.saveUserProgress();
    }
  }

  removeFromWrongCards(cardId: string): void {
    if (!this.userProgress) return;
    
    this.userProgress.wrongCards = this.userProgress.wrongCards.filter(id => id !== cardId);
    this.saveUserProgress();
  }

  clearWrongCards(): void {
    if (!this.userProgress) return;
    
    this.userProgress.wrongCards = [];
    this.saveUserProgress();
  }

  // Review Mode
  getCardsForReview(cards: Card[]): Card[] {
    const wrongCardIds = this.getWrongCards();
    return cards.filter(card => wrongCardIds.includes(card.id));
  }

  // Statistics
  getSessionStats(): StudySessionStats | null {
    if (!this.currentSession?.isActive) return null;

    const totalCards = this.currentSession.cardsStudied.length;
    const correctCount = this.currentSession.correctAnswers.length;
    const incorrectCount = this.currentSession.incorrectAnswers.length;
    const accuracy = totalCards > 0 ? (correctCount / totalCards) * 100 : 0;
    
    const startTime = new Date(this.currentSession.startTime).getTime();
    const endTime = this.currentSession.endTime ? new Date(this.currentSession.endTime).getTime() : Date.now();
    const timeSpent = endTime - startTime;

    return {
      totalCards,
      correctCount,
      incorrectCount,
      accuracy,
      timeSpent
    };
  }

  getOverallStats(): UserProgress['statistics'] | null {
    if (!this.userProgress) return null;
    return this.userProgress.statistics;
  }

  // Data Persistence
  private loadUserProgress(): void {
    this.userProgress = progressTracker.loadUserProgress();
  }

  private saveUserProgress(): void {
    if (!this.userProgress) return;
    
    try {
      localStorage.setItem('flashcard_user_progress', JSON.stringify(this.userProgress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  private saveSessionToProgress(sessionRecord: StudySessionRecord): void {
    if (!this.userProgress) {
      this.initializeUserProgress();
    }
    
    // Use the new progress tracker to record the session
    const timeSpent = this.currentSession ? 
      Date.now() - new Date(this.currentSession.startTime).getTime() : 0;
    
    progressTracker.recordStudySession(
      sessionRecord.cardsStudied,
      sessionRecord.correctAnswers,
      sessionRecord.incorrectAnswers,
      timeSpent
    );
    
    // Reload progress to get updated data
    this.loadUserProgress();
  }

  private initializeUserProgress(): void {
    this.userProgress = {
      userId: `user_${Date.now()}`,
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
  }

  // Method removed - statistics are now updated via progressTracker
  // which has access to all necessary card data

  // Utility Methods
  resetAllData(): void {
    this.currentSession = null;
    this.userProgress = null;
    localStorage.removeItem('flashcard_user_progress');
  }

  exportUserData(): string {
    return JSON.stringify(this.userProgress, null, 2);
  }

  importUserData(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      this.userProgress = imported;
      this.saveUserProgress();
      return true;
    } catch (error) {
      console.error('Failed to import user data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const studySessionManager = new StudySessionManager();
