import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { loadCards } from '../utils/dataLoader';
import type { Card as CardType } from '../types/card';

const Study: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

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

  const handleCorrect = () => {
    setCorrectCount(prev => prev + 1);
  };

  const handleIncorrect = () => {
    setIncorrectCount(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
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

  const currentCard = cards[currentCardIndex];
  const canGoPrevious = currentCardIndex > 0;
  const canGoNext = currentCardIndex < cards.length - 1;

  return (
    <div className="study-page">
      <h1>Study Mode</h1>
      <p>Practice Portuguese verb conjugations with flashcards</p>
      
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
          totalCards={cards.length}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
      </div>
    </div>
  );
};

export default Study;
