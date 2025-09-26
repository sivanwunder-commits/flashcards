import React, { useState } from 'react';
import type { QuizQuestion, QuizAnswer } from '../types/quiz';
import './QuizQuestion.css';

interface QuizQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: QuizAnswer) => void;
  questionNumber: number;
  totalQuestions: number;
  timeLimit?: number; // in seconds
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  timeLimit
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [startTime, setStartTime] = useState(Date.now());

  // Reset state when question changes
  React.useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setTimeRemaining(timeLimit || 0);
    setStartTime(Date.now());
  }, [question.id, timeLimit]);

  // Timer effect
  React.useEffect(() => {
    if (timeLimit && timeLimit > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto-submit
            handleAnswer(selectedAnswer || 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, hasAnswered, selectedAnswer]);

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

  const getOptionLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D'];
    return labels[index] || String(index + 1);
  };

  return (
    <div className="quiz-question-container">
      <div className="quiz-header">
        <div className="question-counter">
          Question {questionNumber} of {totalQuestions}
        </div>
        {timeLimit && timeLimit > 0 && (
          <div className={`timer ${timeRemaining <= 10 ? 'warning' : ''}`}>
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
              <span>✅ Correct! Well done!</span>
            ) : (
              <span>❌ Incorrect. The correct answer was: <strong>{question.options[question.correctAnswerIndex]}</strong></span>
            )}
          </div>
          <button onClick={handleContinue} className="continue-button">
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
