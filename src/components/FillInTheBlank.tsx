import React, { useState, useEffect } from 'react';
import type { Card } from '../types/card';
import type { QuizAnswer } from '../types/quiz';
import { checkAnswerMatch } from '../utils/answerUtils';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { QUIZ_CONSTANTS, UI_MESSAGES } from '../utils/constants';
import './FillInTheBlank.css';

/**
 * Props for the FillInTheBlank component
 */
interface FillInTheBlankProps {
  card: Card;
  onAnswer: (answer: QuizAnswer) => void;
  questionNumber: number;
  totalQuestions: number;
  timeLimit?: number; // in seconds
}

/**
 * FillInTheBlank Component
 * 
 * Text input quiz component for Portuguese verb conjugation practice.
 * Features include:
 * - Free-text input for verb conjugation
 * - Fuzzy matching with normalization (handles punctuation, case, whitespace)
 * - Optional time limit with countdown timer
 * - Hint system (verb type and tense information)
 * - Visual feedback (correct/incorrect highlighting)
 * - Auto-submit when time expires
 * 
 * This component provides a more challenging quiz format compared to
 * multiple choice, requiring users to recall the exact conjugation.
 */
const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  card,
  onAnswer,
  questionNumber,
  totalQuestions,
  timeLimit
}) => {
  // User's typed answer
  const [userAnswer, setUserAnswer] = useState('');
  // Track whether user has submitted their answer
  const [hasAnswered, setHasAnswered] = useState(false);
  // Track whether hint is currently displayed
  const [showHint, setShowHint] = useState(false);
  // Track whether the submitted answer was correct
  const [isCorrect, setIsCorrect] = useState(false);

  // Use custom timer hook for countdown functionality
  const { timeRemaining, startTime } = useQuizTimer({
    timeLimit,
    hasAnswered,
    onTimeout: handleSubmit,
    resetDependency: card.id,
  });

  /**
   * Reset state when card changes to ensure fresh start
   */
  useEffect(() => {
    setUserAnswer('');
    setHasAnswered(false);
    setShowHint(false);
    setIsCorrect(false);
  }, [card.id]);

  /**
   * Handles answer submission
   * - Validates answer is not empty
   * - Checks correctness using utility function
   * - Records time spent
   * - Triggers callback after brief delay to show feedback
   */
  function handleSubmit() {
    if (hasAnswered || !userAnswer.trim()) return;

    const correct = checkAnswerMatch(userAnswer, card.correctAnswer);
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
    }, QUIZ_CONSTANTS.ANSWER_FEEDBACK_DELAY_MS);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasAnswered) {
      handleSubmit();
    }
  };

  /**
   * Generates feedback message based on answer correctness
   * @returns Feedback message string
   */
  const getFeedbackMessage = () => {
    if (!hasAnswered) return '';
    
    if (isCorrect) {
      return UI_MESSAGES.CORRECT_ANSWER;
    } else {
      return `${UI_MESSAGES.INCORRECT_ANSWER} ${card.correctAnswer}`;
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
