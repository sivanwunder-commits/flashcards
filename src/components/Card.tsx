import React, { useState } from 'react';
import type { Card as CardType } from '../types/card';
import './Card.css';

interface CardProps {
  card: CardType;
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  onCorrect,
  onIncorrect,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  canGoPrevious,
  canGoNext,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setHasAnswered(true);
    if (isCorrect) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  const handleNext = () => {
    // Reset card state for next card
    setIsFlipped(false);
    setHasAnswered(false);
    onNext();
  };

  const handlePrevious = () => {
    // Reset card state for previous card
    setIsFlipped(false);
    setHasAnswered(false);
    onPrevious();
  };

  return (
    <div className="card-container">
      <div className="card-navigation">
        <button 
          onClick={handlePrevious} 
          disabled={!canGoPrevious}
          className="nav-button prev-button"
        >
          ← Previous
        </button>
        <span className="card-counter">
          {currentIndex + 1} of {totalCards}
        </span>
        <button 
          onClick={handleNext} 
          disabled={!canGoNext}
          className="nav-button next-button"
        >
          Next →
        </button>
      </div>

      <div 
        className={`card ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="card-inner">
          <div className="card-front">
            <div className="card-content">
              <div className="card-phrase">
                {card.phrase}
              </div>
              <div className="card-verb">
                ({card.verb})
              </div>
              <div className="card-info">
                <span className="card-tense">{card.tense.replace(/_/g, ' ')}</span>
                <span className="card-subject">{card.subject}</span>
              </div>
              {!isFlipped && (
                <div className="flip-hint">
                  Click to reveal answer
                </div>
              )}
            </div>
          </div>

          <div className="card-back">
            <div className="card-content">
              <div className="card-phrase">
                {card.phrase.replace('_____', card.correctAnswer)}
              </div>
              <div className="card-answer">
                Answer: <strong>{card.correctAnswer}</strong>
              </div>
              <div className="card-info">
                <span className="card-tense">{card.tense.replace(/_/g, ' ')}</span>
                <span className="card-subject">{card.subject}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFlipped && !hasAnswered && (
        <div className="answer-buttons">
          <button 
            onClick={() => handleAnswer(false)}
            className="answer-button incorrect-button"
          >
            Got it wrong
          </button>
          <button 
            onClick={() => handleAnswer(true)}
            className="answer-button correct-button"
          >
            Got it right
          </button>
        </div>
      )}

      {hasAnswered && (
        <div className="continue-section">
          <p className="feedback-message">
            {isFlipped ? 'Great job!' : 'Keep practicing!'}
          </p>
          <button 
            onClick={handleNext}
            disabled={!canGoNext}
            className="continue-button"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
