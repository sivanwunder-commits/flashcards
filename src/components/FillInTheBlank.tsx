import React, { useState, useEffect } from 'react';
import type { Card } from '../types/card';
import type { QuizAnswer } from '../types/quiz';
import './FillInTheBlank.css';

interface FillInTheBlankProps {
  card: Card;
  onAnswer: (answer: QuizAnswer) => void;
  questionNumber: number;
  totalQuestions: number;
  timeLimit?: number; // in seconds
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  card,
  onAnswer,
  questionNumber,
  totalQuestions,
  timeLimit
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [startTime, setStartTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when card changes
  useEffect(() => {
    setUserAnswer('');
    setHasAnswered(false);
    setTimeRemaining(timeLimit || 0);
    setStartTime(Date.now());
    setShowHint(false);
    setIsCorrect(false);
  }, [card.id, timeLimit]);

  // Timer effect
  useEffect(() => {
    if (timeLimit && timeLimit > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, hasAnswered]);

  const normalizeAnswer = (answer: string): string => {
    return answer
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  };

  const checkAnswer = (userInput: string): boolean => {
    const normalizedUser = normalizeAnswer(userInput);
    const normalizedCorrect = normalizeAnswer(card.correctAnswer);
    
    // Exact match
    if (normalizedUser === normalizedCorrect) {
      return true;
    }

    // Check for common variations and typos
    const variations = [
      card.correctAnswer.toLowerCase(),
      card.correctAnswer.toLowerCase().replace(/[.,!?;:]/g, ''),
      // Add more variations as needed
    ];

    return variations.some(variation => 
      normalizeAnswer(variation) === normalizedUser
    );
  };

  const handleSubmit = () => {
    if (hasAnswered || !userAnswer.trim()) return;

    const correct = checkAnswer(userAnswer);
    setIsCorrect(correct);
    setHasAnswered(true);

    const endTime = Date.now();
    const timeSpent = endTime - startTime;

    const quizAnswer: QuizAnswer = {
      questionId: card.id,
      selectedAnswer: userAnswer,
      selectedIndex: -1, // Not applicable for fill-in-the-blank
      isCorrect: correct,
      timeSpent: timeSpent
    };

    // Delay before calling onAnswer to show feedback
    setTimeout(() => {
      onAnswer(quizAnswer);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasAnswered) {
      handleSubmit();
    }
  };

  const getFeedbackMessage = () => {
    if (!hasAnswered) return '';
    
    if (isCorrect) {
      return '✅ Correct! Well done!';
    } else {
      return `❌ Incorrect. The correct answer was: ${card.correctAnswer}`;
    }
  };

  const getInputClass = () => {
    if (!hasAnswered) return 'answer-input';
    return isCorrect ? 'answer-input correct' : 'answer-input incorrect';
  };

  return (
    <div className="fill-in-blank-container">
      <div className="question-header">
        <span className="question-number">Question {questionNumber} / {totalQuestions}</span>
        {timeLimit > 0 && (
          <span className="time-remaining">Time: {timeRemaining}s</span>
        )}
      </div>

      <div className="question-text">
        {card.phrase.replace('_____', '_____')}
      </div>

      <div className="question-context">
        <div className="verb-info">
          <strong>Verb:</strong> {card.verb}
        </div>
        <div className="tense-info">
          <strong>Tense:</strong> {card.tense.replace(/_/g, ' ')}
        </div>
        <div className="subject-info">
          <strong>Subject:</strong> {card.subject}
        </div>
      </div>

      <div className="answer-section">
        <div className="input-container">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            className={getInputClass()}
            placeholder="Type your answer here..."
            disabled={hasAnswered}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={hasAnswered || !userAnswer.trim()}
            className="submit-button"
          >
            Submit
          </button>
        </div>

        {!hasAnswered && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="hint-button"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}

        {showHint && !hasAnswered && (
          <div className="hint-section">
            <p><strong>Hint:</strong> This is a {card.verbType} verb in the {card.tense.replace(/_/g, ' ')} tense.</p>
            <p>The subject is "{card.subject}".</p>
          </div>
        )}
      </div>

      {hasAnswered && (
        <div className="answer-feedback">
          <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {getFeedbackMessage()}
          </div>
          <div className="correct-answer-display">
            <strong>Your answer:</strong> {userAnswer}
            <br />
            <strong>Correct answer:</strong> {card.correctAnswer}
          </div>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
