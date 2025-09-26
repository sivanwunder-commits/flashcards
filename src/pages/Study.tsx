import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { loadCards } from '../utils/dataLoader';
import { studySessionManager } from '../utils/studySessionManager';
import type { Card as CardType } from '../types/card';

const Study: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStats, setSessionStats] = useState(studySessionManager.getSessionStats());

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

  // Update session stats when they change
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionStats(studySessionManager.getSessionStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleCorrect = () => {
    setCorrectCount(prev => prev + 1);
    if (currentCard) {
      studySessionManager.recordCorrectAnswer(currentCard.id);
    }
  };

  const handleIncorrect = () => {
    setIncorrectCount(prev => prev + 1);
    if (currentCard) {
      studySessionManager.recordIncorrectAnswer(currentCard.id);
      studySessionManager.addToWrongCards(currentCard.id);
    }
  };

  const handleNext = () => {
    const availableCards = isReviewMode ? studySessionManager.getCardsForReview(cards) : cards;
    if (currentCardIndex < availableCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const startNewSession = () => {
    studySessionManager.startNewSession();
    setSessionActive(true);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCurrentCardIndex(0);
  };

  const endSession = () => {
    const sessionRecord = studySessionManager.endCurrentSession();
    setSessionActive(false);
    if (sessionRecord) {
      console.log('Session ended:', sessionRecord);
    }
  };

  const toggleReviewMode = () => {
    setIsReviewMode(!isReviewMode);
    setCurrentCardIndex(0);
  };

  const clearWrongCards = () => {
    studySessionManager.clearWrongCards();
    if (isReviewMode) {
      setCurrentCardIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="study-page">
        <h1>Study Mode</h1>
        <div className="loading-message">
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-page">
        <h1>Study Mode</h1>
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
      <div className="study-page">
        <h1>Study Mode</h1>
        <div className="no-cards-message">
          <p>No flashcards available</p>
        </div>
      </div>
    );
  }

  // Get cards based on mode
  const availableCards = isReviewMode ? studySessionManager.getCardsForReview(cards) : cards;
  
  if (isReviewMode && availableCards.length === 0) {
    return (
      <div className="study-page">
        <h1>Study Mode</h1>
        <div className="no-cards-message">
          <p>No wrong cards to review! Great job!</p>
          <button onClick={toggleReviewMode} className="mode-toggle-button">
            Switch to All Cards
          </button>
        </div>
      </div>
    );
  }

  const currentCard = availableCards[currentCardIndex];
  const canGoPrevious = currentCardIndex > 0;
  const canGoNext = currentCardIndex < availableCards.length - 1;

  return (
    <div className="study-page">
      <h1>Study Mode</h1>
      <p>Practice Portuguese verb conjugations with flashcards</p>
      
      {/* Session Controls */}
      <div className="session-controls">
        <div className="session-buttons">
          {!sessionActive ? (
            <button onClick={startNewSession} className="session-button start-button">
              Start New Session
            </button>
          ) : (
            <button onClick={endSession} className="session-button end-button">
              End Session
            </button>
          )}
        </div>
        
        <div className="mode-controls">
          <button 
            onClick={toggleReviewMode} 
            className={`mode-toggle-button ${isReviewMode ? 'active' : ''}`}
          >
            {isReviewMode ? 'All Cards' : 'Review Wrong Cards'}
          </button>
          {isReviewMode && studySessionManager.getWrongCards().length > 0 && (
            <button onClick={clearWrongCards} className="clear-button">
              Clear Wrong Cards
            </button>
          )}
        </div>
      </div>

      {/* Session Status */}
      {sessionActive && (
        <div className="session-status">
          <span className="session-indicator">Session Active</span>
          {sessionStats && (
            <span className="session-time">
              Time: {Math.round(sessionStats.timeSpent / 1000)}s
            </span>
          )}
        </div>
      )}

      {/* Mode Indicator */}
      <div className="mode-indicator">
        {isReviewMode ? (
          <span className="review-mode">
            Review Mode: {availableCards.length} wrong cards
          </span>
        ) : (
          <span className="all-cards-mode">
            All Cards: {availableCards.length} total cards
          </span>
        )}
      </div>
      
      <div className="study-stats">
        <div className="stat-item">
          <span className="stat-label">Correct:</span>
          <span className="stat-value correct">{correctCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Incorrect:</span>
          <span className="stat-value incorrect">{incorrectCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">
            {correctCount + incorrectCount > 0 
              ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
              : 0}%
          </span>
        </div>
      </div>

      <div className="study-content">
        <Card
          card={currentCard}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentIndex={currentCardIndex}
          totalCards={availableCards.length}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
      </div>
    </div>
  );
};

export default Study;
