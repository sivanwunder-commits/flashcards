import type { QuizQuestion, QuizSession, QuizAnswer, QuizResult } from '../types/quiz';
import { progressTracker } from './progressTracker';
import type { Card } from '../types/card';
import { generateQuizQuestions } from './distractorGenerator';

class QuizSessionManager {
  private currentSession: QuizSession | null = null;
  private questions: QuizQuestion[] = [];
  private answers: QuizAnswer[] = [];

  // Start a new quiz session
  startNewSession(cards: Card[], questionCount: number = 10): QuizSession {
    this.questions = generateQuizQuestions(cards, questionCount);
    this.answers = [];
    
    const sessionId = `quiz_${Date.now()}`;
    this.currentSession = {
      id: sessionId,
      questions: this.questions,
      answers: this.answers,
      startTime: new Date().toISOString(),
      totalQuestions: this.questions.length,
      isCompleted: false
    };
    
    return this.currentSession;
  }

  // Get current session
  getCurrentSession(): QuizSession | null {
    return this.currentSession;
  }

  // Check if session is active
  isSessionActive(): boolean {
    return this.currentSession !== null && !this.currentSession.isCompleted;
  }

  // Record an answer
  recordAnswer(answer: QuizAnswer): void {
    if (!this.currentSession || this.currentSession.isCompleted) {
      return;
    }
    
    this.answers.push(answer);
    this.currentSession.answers = this.answers;
  }

  // Get current question
  getCurrentQuestion(): QuizQuestion | null {
    if (!this.currentSession || this.answers.length >= this.questions.length) {
      return null;
    }
    
    return this.questions[this.answers.length];
  }

  // Get current question number (1-based)
  getCurrentQuestionNumber(): number {
    return this.answers.length + 1;
  }

  // Check if quiz is complete
  isQuizComplete(): boolean {
    return this.answers.length >= this.questions.length;
  }

  // Complete the quiz session
  completeSession(): QuizResult | null {
    if (!this.currentSession || !this.isQuizComplete()) {
      return null;
    }
    
    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.isCompleted = true;
    
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = this.answers.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    const startTime = new Date(this.currentSession.startTime).getTime();
    const endTime = this.currentSession.endTime ? new Date(this.currentSession.endTime).getTime() : Date.now();
    const timeSpent = endTime - startTime;
    
    const result: QuizResult = {
      sessionId: this.currentSession.id,
      score: correctAnswers,
      totalQuestions: totalQuestions,
      accuracy: accuracy,
      timeSpent: timeSpent,
      answers: [...this.answers],
      date: new Date().toISOString().split('T')[0]
    };
    
    // Record the quiz result in progress tracker
    progressTracker.recordQuizResult(result);
    
    return result;
  }

  // Get session statistics
  getSessionStats(): {
    currentQuestion: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    accuracy: number;
    timeSpent: number;
  } | null {
    if (!this.currentSession) return null;
    
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    const incorrectAnswers = this.answers.filter(answer => !answer.isCorrect).length;
    const accuracy = this.answers.length > 0 ? (correctAnswers / this.answers.length) * 100 : 0;
    
    const startTime = new Date(this.currentSession.startTime).getTime();
    const currentTime = Date.now();
    const timeSpent = currentTime - startTime;
    
    return {
      currentQuestion: this.answers.length + 1,
      totalQuestions: this.currentSession.totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      timeSpent
    };
  }

  // Reset session
  resetSession(): void {
    this.currentSession = null;
    this.questions = [];
    this.answers = [];
  }

  // Get all questions (for review)
  getAllQuestions(): QuizQuestion[] {
    return [...this.questions];
  }

  // Get all answers (for review)
  getAllAnswers(): QuizAnswer[] {
    return [...this.answers];
  }

  // Get question by index
  getQuestionByIndex(index: number): QuizQuestion | null {
    if (index < 0 || index >= this.questions.length) {
      return null;
    }
    return this.questions[index];
  }

  // Get answer by question index
  getAnswerByQuestionIndex(index: number): QuizAnswer | null {
    if (index < 0 || index >= this.answers.length) {
      return null;
    }
    return this.answers[index];
  }

  // Calculate final score
  calculateFinalScore(): {
    score: number;
    totalQuestions: number;
    accuracy: number;
    timeSpent: number;
  } | null {
    if (!this.currentSession || this.answers.length === 0) {
      return null;
    }
    
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = this.answers.length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    const startTime = new Date(this.currentSession.startTime).getTime();
    const endTime = this.currentSession.endTime ? new Date(this.currentSession.endTime).getTime() : Date.now();
    const timeSpent = endTime - startTime;
    
    return {
      score: correctAnswers,
      totalQuestions,
      accuracy,
      timeSpent
    };
  }
}

// Export singleton instance
export const quizSessionManager = new QuizSessionManager();
