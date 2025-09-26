import React, { useState, useEffect } from 'react';
import QuizQuestion from '../components/QuizQuestion';
import { loadCards } from '../utils/dataLoader';
import { quizSessionManager } from '../utils/quizSessionManager';
import type { Card as CardType } from '../types/card';
import type { QuizAnswer, QuizResult } from '../types/quiz';

const Quiz: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [sessionStats, setSessionStats] = useState(quizSessionManager.getSessionStats());

  useEffect(() => {
    const loadCardData = async () => {
      try {
        setLoading(true);
        const loadedCards = await loadCards();
        setCards(loadedCards);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, []);

  // Update session stats
  useEffect(() => {
    if (quizActive) {
      const interval = setInterval(() => {
        setSessionStats(quizSessionManager.getSessionStats());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizActive]);

  const startQuiz = () => {
    if (cards.length === 0) return;
    
    const session = quizSessionManager.startNewSession(cards, 10);
    setQuizActive(true);
    setQuizComplete(false);
    setQuizResult(null);
    setSessionStats(quizSessionManager.getSessionStats());
  };

  const handleAnswer = (answer: QuizAnswer) => {
    quizSessionManager.recordAnswer(answer);
    setSessionStats(quizSessionManager.getSessionStats());
    
    // Check if quiz is complete
    if (quizSessionManager.isQuizComplete()) {
      const result = quizSessionManager.completeSession();
      setQuizResult(result);
      setQuizActive(false);
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    quizSessionManager.resetSession();
    setQuizActive(false);
    setQuizComplete(false);
    setQuizResult(null);
    setSessionStats(null);
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <h1>Quiz Mode</h1>
        <div className="loading-message">
          <p>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <h1>Quiz Mode</h1>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="quiz-page">
        <h1>Quiz Mode</h1>
        <div className="no-cards-message">
          <p>No flashcards available for quiz</p>
        </div>
      </div>
    );
  }

  // Quiz not started
  if (!quizActive && !quizComplete) {
    return (
      <div className="quiz-page">
        <h1>Quiz Mode</h1>
        <p>Test your knowledge with multiple choice questions</p>
        
        <div className="quiz-intro">
          <div className="quiz-info">
            <h3>Quiz Details</h3>
            <ul>
              <li>10 multiple choice questions</li>
              <li>4 options per question</li>
              <li>Immediate feedback after each answer</li>
              <li>Final score and statistics</li>
            </ul>
          </div>
          
          <button onClick={startQuiz} className="start-quiz-button">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress
  if (quizActive && !quizComplete) {
    const currentQuestion = quizSessionManager.getCurrentQuestion();
    const currentQuestionNumber = quizSessionManager.getCurrentQuestionNumber();
    const totalQuestions = sessionStats?.totalQuestions || 10;

    if (!currentQuestion) {
      return (
        <div className="quiz-page">
          <h1>Quiz Mode</h1>
          <div className="error-message">
            <p>No question available</p>
            <button onClick={resetQuiz}>Start Over</button>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-page">
        <h1>Quiz Mode</h1>
        
        {/* Quiz Progress */}
        {sessionStats && (
          <div className="quiz-progress">
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Question:</span>
                <span className="stat-value">{sessionStats.currentQuestion} / {sessionStats.totalQuestions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Correct:</span>
                <span className="stat-value correct">{sessionStats.correctAnswers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Incorrect:</span>
                <span className="stat-value incorrect">{sessionStats.incorrectAnswers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time:</span>
                <span className="stat-value">{formatTime(sessionStats.timeSpent)}</span>
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(sessionStats.currentQuestion / sessionStats.totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
        />
      </div>
    );
  }

  // Quiz completed
  if (quizComplete && quizResult) {
    return (
      <div className="quiz-page">
        <h1>Quiz Complete!</h1>
        
        <div className="quiz-results">
          <div className="result-summary">
            <h2>Your Results</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{quizResult.score}</span>
                <span className="score-total">/ {quizResult.totalQuestions}</span>
              </div>
              <div className="score-percentage">
                {Math.round(quizResult.accuracy)}%
              </div>
            </div>
          </div>
          
          <div className="result-details">
            <div className="detail-item">
              <span className="detail-label">Correct Answers:</span>
              <span className="detail-value correct">{quizResult.score}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Incorrect Answers:</span>
              <span className="detail-value incorrect">{quizResult.totalQuestions - quizResult.score}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Time:</span>
              <span className="detail-value">{formatTime(quizResult.timeSpent)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Accuracy:</span>
              <span className="detail-value">{Math.round(quizResult.accuracy)}%</span>
            </div>
          </div>
          
          <div className="result-actions">
            <button onClick={startQuiz} className="retry-button">
              Take Another Quiz
            </button>
            <button onClick={resetQuiz} className="home-button">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
