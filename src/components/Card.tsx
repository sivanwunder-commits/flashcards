import React, { useState } from 'react';
import type { Card as CardType } from '../types/card';
import { UI_MESSAGES } from '../utils/constants';
import './Card.css';

/**
 * Props for the Card component
 * Defines the interface for flashcard interaction and navigation
 */
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

/**
 * Card Component
 * 
 * Interactive flashcard component that displays Portuguese verb conjugation exercises.
 * Features include:
 * - Flip animation to reveal answers
 * - Self-assessment (correct/incorrect feedback)
 * - Navigation between cards
 * - Progress tracking display
 * 
 * The card shows a phrase with a blank for verb conjugation on the front,
 * and reveals the completed phrase with the correct answer on the back.
 */
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
  // Track whether card is flipped to show answer
  const [isFlipped, setIsFlipped] = useState(false);
  // Track whether user has self-assessed their answer
  const [hasAnswered, setHasAnswered] = useState(false);

  /**
   * Flips the card to reveal the answer
   * Only allows flipping from front to back (not reversible)
   */
  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  /**
   * Records user's self-assessment of their answer
   * @param isCorrect - Whether the user got the answer correct
   */
  const handleAnswer = (isCorrect: boolean) => {
    setHasAnswered(true);
    if (isCorrect) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  /**
   * Navigates to the next card and resets card state
   * Resets flip and answer state for a fresh card experience
   */
  const handleNext = () => {
    setIsFlipped(false);
    setHasAnswered(false);
    onNext();
  };

  /**
   * Navigates to the previous card and resets card state
   * Resets flip and answer state for a fresh card experience
   */
  const handlePrevious = () => {
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
          {UI_MESSAGES.BUTTON_PREVIOUS}
        </button>
        <span className="card-counter">
          {currentIndex + 1} of {totalCards}
        </span>
        <button 
          onClick={handleNext} 
          disabled={!canGoNext}
          className="nav-button next-button"
        >
          {UI_MESSAGES.BUTTON_NEXT}
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
                  {UI_MESSAGES.FLIP_HINT}
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
            {isFlipped ? UI_MESSAGES.FEEDBACK_CORRECT : UI_MESSAGES.FEEDBACK_KEEP_PRACTICING}
          </p>
          <button 
            onClick={handleNext}
            disabled={!canGoNext}
            className="continue-button"
          >
            {UI_MESSAGES.BUTTON_CONTINUE}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
