import React, { useState } from 'react';
import type { QuizQuestion, QuizAnswer } from '../types/quiz';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { QUIZ_CONSTANTS, UI_MESSAGES } from '../utils/constants';
import './QuizQuestion.css';

/**
 * Props for the QuizQuestion component
 */
interface QuizQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: QuizAnswer) => void;
  questionNumber: number;
  totalQuestions: number;
  timeLimit?: number; // in seconds
}

/**
 * QuizQuestion Component
 * 
 * Displays a multiple-choice quiz question for Portuguese verb conjugation practice.
 * Features include:
 * - Multiple choice selection (A, B, C, D)
 * - Optional time limit with countdown timer
 * - Immediate visual feedback (correct/incorrect highlighting)
 * - Answer tracking with time spent calculation
 * - Auto-submit when time expires
 * 
 * The component resets its state when the question changes to ensure
 * a fresh start for each new question.
 */
const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  timeLimit
}) => {
  // Track which answer option the user selected (0-3)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // Track whether user has submitted their answer
  const [hasAnswered, setHasAnswered] = useState(false);

  // Use custom timer hook for countdown functionality
  const { timeRemaining, startTime } = useQuizTimer({
    timeLimit,
    hasAnswered,
    onTimeout: () => handleAnswer(selectedAnswer || 0),
    resetDependency: question.id,
  });

  // Reset state when question changes
  React.useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
  };

  const handleContinue = () => {
    if (!hasAnswered || selectedAnswer === null) return;
    
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    
    const quizAnswer: QuizAnswer = {
      questionId: question.id,
      selectedAnswer: question.options[selectedAnswer],
      selectedIndex: selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswerIndex,
      timeSpent: timeSpent
    };
    
    onAnswer(quizAnswer);
  };

  const getOptionClass = (index: number) => {
    if (!hasAnswered) {
      return selectedAnswer === index ? 'option selected' : 'option';
    }
    
    // Show feedback after answering
    if (index === question.correctAnswerIndex) {
      return 'option correct';
    } else if (index === selectedAnswer && index !== question.correctAnswerIndex) {
      return 'option incorrect';
    } else {
      return 'option';
    }
  };

  /**
   * Gets the label for an option (A, B, C, D)
   * @param index - Option index (0-3)
   * @returns Option label string
   */
  const getOptionLabel = (index: number) => {
    return QUIZ_CONSTANTS.OPTION_LABELS[index] || String(index + 1);
  };

  return (
    <div className="quiz-question-container">
      <div className="quiz-header">
        <div className="question-counter">
          Question {questionNumber} of {totalQuestions}
        </div>
        {timeLimit && timeLimit > 0 && (
          <div className={`timer ${timeRemaining <= QUIZ_CONSTANTS.TIMER_WARNING_THRESHOLD ? 'warning' : ''}`}>
            {timeRemaining}s
          </div>
        )}
      </div>

      <div className="question-content">
        <div className="question-text">
          {question.question}
        </div>
        
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleAnswer(index)}
              disabled={hasAnswered}
            >
              <span className="option-label">{getOptionLabel(index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {hasAnswered && (
        <div className="answer-feedback">
          <div className={`feedback-message ${selectedAnswer === question.correctAnswerIndex ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === question.correctAnswerIndex ? (
              <span>{UI_MESSAGES.CORRECT_ANSWER}</span>
            ) : (
              <span>{UI_MESSAGES.INCORRECT_ANSWER} <strong>{question.options[question.correctAnswerIndex]}</strong></span>
            )}
          </div>
          <button onClick={handleContinue} className="continue-button">
            {UI_MESSAGES.BUTTON_CONTINUE}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
