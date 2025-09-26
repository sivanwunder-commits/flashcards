import type { Card, Tense, VerbType } from '../types/card';
import type { QuizAnswer } from '../types/quiz';

export interface DifficultyLevel {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  multiplier: number;
  description: string;
}

export interface UserPerformance {
  overallAccuracy: number;
  accuracyByTense: { [key: string]: number };
  accuracyByVerbType: { [key: string]: number };
  recentAccuracy: number; // Last 10 questions
  averageTimePerQuestion: number;
  streakCount: number;
  totalQuestionsAnswered: number;
}

export interface AdaptiveSettings {
  enableAdaptiveDifficulty: boolean;
  difficultyAdjustmentSpeed: number; // 0.1 to 1.0
  minimumQuestionsForAdjustment: number;
  performanceWindow: number; // Number of recent questions to consider
}

class AdaptiveDifficultyManager {
  private performanceHistory: QuizAnswer[] = [];
  private currentDifficulty: DifficultyLevel = {
    level: 'beginner',
    multiplier: 1.0,
    description: 'Starting level - basic questions'
  };

  private settings: AdaptiveSettings = {
    enableAdaptiveDifficulty: true,
    difficultyAdjustmentSpeed: 0.3,
    minimumQuestionsForAdjustment: 5,
    performanceWindow: 10
  };

  // Difficulty levels with their characteristics
  private difficultyLevels: DifficultyLevel[] = [
    {
      level: 'beginner',
      multiplier: 1.0,
      description: 'Basic questions with common verbs and simple tenses'
    },
    {
      level: 'intermediate',
      multiplier: 1.3,
      description: 'Moderate difficulty with mixed verb types and tenses'
    },
    {
      level: 'advanced',
      multiplier: 1.6,
      description: 'Challenging questions with complex tenses and irregular verbs'
    },
    {
      level: 'expert',
      multiplier: 2.0,
      description: 'Expert level with rare tenses and complex irregular verbs'
    }
  ];

  // Tense difficulty mapping
  private tenseDifficulty: { [key in Tense]: number } = {
    'pretérito_perfeito': 1.0,
    'pretérito_imperfeito': 1.2,
    'pretérito_mais_que_perfeito': 1.8,
    'futuro_do_presente': 1.1,
    'futuro_do_pretérito': 1.5,
    'presente_do_subjuntivo': 1.4,
    'imperfeito_do_subjuntivo': 1.7,
    'futuro_do_subjuntivo': 1.9,
    'pluscuamperfecto_do_subjuntivo': 2.0
  };

  // Verb type difficulty mapping
  private verbTypeDifficulty: { [key in VerbType]: number } = {
    'regular': 1.0,
    'irregular': 1.5
  };

  // Common vs rare verbs (simplified mapping)
  private verbFrequency: { [key: string]: number } = {
    'ser': 1.0,
    'estar': 1.0,
    'ter': 1.0,
    'ir': 1.0,
    'fazer': 1.0,
    'comer': 1.0,
    'falar': 1.0,
    'viver': 1.0,
    'trabalhar': 1.1,
    'estudar': 1.1,
    'gostar': 1.1,
    'precisar': 1.2,
    'querer': 1.2,
    'poder': 1.2,
    'saber': 1.3,
    'conhecer': 1.3,
    'partir': 1.4,
    'vir': 1.4,
    'trazer': 1.5,
    'dizer': 1.5,
    'dar': 1.5,
    'ver': 1.6,
    'ouvir': 1.6,
    'ler': 1.7,
    'escrever': 1.7,
    'abrir': 1.8,
    'fechar': 1.8,
    'começar': 1.9,
    'acabar': 1.9,
    'chegar': 2.0,
    'viajar': 2.0,
    'comprar': 2.0,
    'beber': 2.0,
    'amar': 2.0,
    'odiar': 2.0,
    'temer': 2.0,
    'tentar': 2.0,
    'esperar': 2.0
  };

  /**
   * Record a quiz answer to update performance tracking
   */
  recordAnswer(answer: QuizAnswer): void {
    this.performanceHistory.push(answer);
    
    // Keep only recent answers within the performance window
    if (this.performanceHistory.length > this.settings.performanceWindow) {
      this.performanceHistory.shift();
    }

    // Update difficulty if we have enough data
    if (this.performanceHistory.length >= this.settings.minimumQuestionsForAdjustment) {
      this.updateDifficulty();
    }
  }

  /**
   * Get cards filtered by current difficulty level
   */
  getFilteredCards(allCards: Card[]): Card[] {
    if (!this.settings.enableAdaptiveDifficulty) {
      return allCards;
    }

    return allCards.filter(card => {
      const cardDifficulty = this.calculateCardDifficulty(card);
      const targetDifficulty = this.currentDifficulty.multiplier;
      
      // Allow cards within a reasonable range of the target difficulty
      return cardDifficulty >= targetDifficulty * 0.7 && 
             cardDifficulty <= targetDifficulty * 1.3;
    });
  }

  /**
   * Calculate the difficulty score for a specific card
   */
  private calculateCardDifficulty(card: Card): number {
    const tenseDiff = this.tenseDifficulty[card.tense] || 1.0;
    const verbTypeDiff = this.verbTypeDifficulty[card.verbType] || 1.0;
    const verbFreq = this.verbFrequency[card.verb] || 2.0; // Default to rare if not found
    
    // Combine factors with weights
    return (tenseDiff * 0.4) + (verbTypeDiff * 0.3) + (verbFreq * 0.3);
  }

  /**
   * Update difficulty based on recent performance
   */
  private updateDifficulty(): void {
    const performance = this.calculateUserPerformance();
    const currentLevelIndex = this.difficultyLevels.findIndex(
      level => level.level === this.currentDifficulty.level
    );

    let newLevelIndex = currentLevelIndex;

    // Adjust difficulty based on performance
    if (performance.recentAccuracy >= 0.8 && performance.streakCount >= 3) {
      // User is doing well, increase difficulty
      newLevelIndex = Math.min(currentLevelIndex + 1, this.difficultyLevels.length - 1);
    } else if (performance.recentAccuracy <= 0.4 && performance.streakCount <= -2) {
      // User is struggling, decrease difficulty
      newLevelIndex = Math.max(currentLevelIndex - 1, 0);
    }

    // Apply adjustment speed to prevent rapid changes
    if (newLevelIndex !== currentLevelIndex) {
      const adjustment = (newLevelIndex - currentLevelIndex) * this.settings.difficultyAdjustmentSpeed;
      const adjustedIndex = Math.round(currentLevelIndex + adjustment);
      newLevelIndex = Math.max(0, Math.min(adjustedIndex, this.difficultyLevels.length - 1));
    }

    this.currentDifficulty = this.difficultyLevels[newLevelIndex];
  }

  /**
   * Calculate user performance metrics
   */
  private calculateUserPerformance(): UserPerformance {
    const recentAnswers = this.performanceHistory.slice(-this.settings.performanceWindow);
    
    if (recentAnswers.length === 0) {
      return {
        overallAccuracy: 0,
        accuracyByTense: {},
        accuracyByVerbType: {},
        recentAccuracy: 0,
        averageTimePerQuestion: 0,
        streakCount: 0,
        totalQuestionsAnswered: 0
      };
    }

    const correctAnswers = recentAnswers.filter(answer => answer.isCorrect).length;
    const recentAccuracy = correctAnswers / recentAnswers.length;
    
    // Calculate streak
    let streakCount = 0;
    for (let i = recentAnswers.length - 1; i >= 0; i--) {
      if (recentAnswers[i].isCorrect) {
        streakCount++;
      } else {
        break;
      }
    }

    // Calculate average time
    const totalTime = recentAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    const averageTimePerQuestion = totalTime / recentAnswers.length;

    return {
      overallAccuracy: recentAccuracy,
      accuracyByTense: {},
      accuracyByVerbType: {},
      recentAccuracy,
      averageTimePerQuestion,
      streakCount,
      totalQuestionsAnswered: this.performanceHistory.length
    };
  }

  /**
   * Get current difficulty level
   */
  getCurrentDifficulty(): DifficultyLevel {
    return { ...this.currentDifficulty };
  }

  /**
   * Get user performance summary
   */
  getUserPerformance(): UserPerformance {
    return this.calculateUserPerformance();
  }

  /**
   * Update adaptive settings
   */
  updateSettings(newSettings: Partial<AdaptiveSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current settings
   */
  getSettings(): AdaptiveSettings {
    return { ...this.settings };
  }

  /**
   * Reset difficulty to beginner level
   */
  resetDifficulty(): void {
    this.currentDifficulty = this.difficultyLevels[0];
    this.performanceHistory = [];
  }

  /**
   * Get difficulty explanation for the user
   */
  getDifficultyExplanation(): string {
    const performance = this.calculateUserPerformance();
    const difficulty = this.getCurrentDifficulty();
    
    let explanation = `Current Level: ${difficulty.level.toUpperCase()}\n`;
    explanation += `${difficulty.description}\n\n`;
    
    if (performance.totalQuestionsAnswered >= this.settings.minimumQuestionsForAdjustment) {
      explanation += `Your Performance:\n`;
      explanation += `• Recent Accuracy: ${Math.round(performance.recentAccuracy * 100)}%\n`;
      explanation += `• Current Streak: ${performance.streakCount} ${performance.streakCount >= 0 ? 'correct' : 'incorrect'}\n`;
      explanation += `• Average Time: ${Math.round(performance.averageTimePerQuestion / 1000)}s per question\n\n`;
      
      if (performance.recentAccuracy >= 0.8) {
        explanation += `Great job! You're mastering this level. Keep it up!`;
      } else if (performance.recentAccuracy <= 0.4) {
        explanation += `Don't worry! Practice makes perfect. The system will adjust to help you learn.`;
      } else {
        explanation += `You're making good progress! Keep practicing to improve.`;
      }
    } else {
      explanation += `Complete a few more questions to see your performance analysis.`;
    }
    
    return explanation;
  }
}

export const adaptiveDifficultyManager = new AdaptiveDifficultyManager();
