import type { Card } from '../types/card';
import type { QuizQuestion } from '../types/quiz';

// Common misspellings and variations for Portuguese verbs
const commonMisspellings: Record<string, string[]> = {
  'comi': ['comei', 'comi', 'comu', 'come'],
  'comemos': ['comemos', 'comemos', 'comemos', 'comemos'],
  'falava': ['falava', 'falava', 'falava', 'falava'],
  'viviam': ['viviam', 'viviam', 'viviam', 'viviam'],
  'fora': ['fora', 'fora', 'fora', 'fora'],
  'tínhamos feito': ['tínhamos feito', 'tínhamos feito', 'tínhamos feito', 'tínhamos feito'],
  'viajarei': ['viajarei', 'viajarei', 'viajarei', 'viajarei'],
  'trabalharão': ['trabalharão', 'trabalharão', 'trabalharão', 'trabalharão'],
  'estudaria': ['estudaria', 'estudaria', 'estudaria', 'estudaria'],
  'compraríamos': ['compraríamos', 'compraríamos', 'compraríamos', 'compraríamos'],
  'seja': ['seja', 'seja', 'seja', 'seja'],
  'tenhamos': ['tenhamos', 'tenhamos', 'tenhamos', 'tenhamos'],
  'pudesse': ['pudesse', 'pudesse', 'pudesse', 'pudesse'],
  'soubéssemos': ['soubéssemos', 'soubéssemos', 'soubéssemos', 'soubéssemos'],
  'chegarem': ['chegarem', 'chegarem', 'chegarem', 'chegarem'],
  'terminar': ['terminar', 'terminar', 'terminar', 'terminar'],
  'tivesse estudado': ['tivesse estudado', 'tivesse estudado', 'tivesse estudado', 'tivesse estudado'],
  'tivéssemos feito': ['tivéssemos feito', 'tivéssemos feito', 'tivéssemos feito', 'tivéssemos feito'],
  'bebeste': ['bebeste', 'bebeste', 'bebeste', 'bebeste'],
  'partíeis': ['partíeis', 'partíeis', 'partíeis', 'partíeis']
};


// Generate misspellings for a given answer
function generateMisspellings(answer: string): string[] {
  const misspellings = commonMisspellings[answer] || [];
  if (misspellings.length > 0) {
    return misspellings.slice(0, 2); // Return up to 2 misspellings
  }
  
  // Generate simple misspellings if not in our list
  const simpleMisspellings: string[] = [];
  
  // Remove accents
  const withoutAccents = answer.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (withoutAccents !== answer) {
    simpleMisspellings.push(withoutAccents);
  }
  
  // Add extra letter
  if (answer.length > 3) {
    simpleMisspellings.push(answer + 's');
  }
  
  return simpleMisspellings.slice(0, 2);
}


// Generate distractors for a quiz question
export function generateDistractors(card: Card, allCards: Card[]): string[] {
  const correctAnswer = card.correctAnswer;
  const verb = card.verb;
  const distractors: string[] = [];
  
  // Get all cards with the same verb (excluding current card)
  const sameVerbCards = allCards.filter(c => 
    c.verb === verb && 
    c.id !== card.id && 
    c.correctAnswer !== correctAnswer
  );
  
  // Priority 1: Use other conjugations of the same verb
  for (const sameVerbCard of sameVerbCards) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(sameVerbCard.correctAnswer)) {
      distractors.push(sameVerbCard.correctAnswer);
    }
  }
  
  // Priority 2: Generate misspellings of the correct answer
  if (distractors.length < 3) {
    const misspellings = generateMisspellings(correctAnswer);
    for (const misspelling of misspellings) {
      if (distractors.length >= 3) break;
      if (!distractors.includes(misspelling)) {
        distractors.push(misspelling);
      }
    }
  }
  
  // Priority 3: If we still need more, get from same tense (but different verbs)
  if (distractors.length < 3) {
    const sameTenseCards = allCards.filter(c => 
      c.tense === card.tense && 
      c.verb !== verb && // Different verb
      c.id !== card.id && 
      c.correctAnswer !== correctAnswer &&
      !distractors.includes(c.correctAnswer)
    );
    
    for (const sameTenseCard of sameTenseCards) {
      if (distractors.length >= 3) break;
      distractors.push(sameTenseCard.correctAnswer);
    }
  }
  
  // Priority 4: If we still need more, get from any other cards
  if (distractors.length < 3) {
    const otherCards = allCards.filter(c => 
      c.id !== card.id && 
      c.correctAnswer !== correctAnswer &&
      !distractors.includes(c.correctAnswer)
    );
    
    for (const otherCard of otherCards) {
      if (distractors.length >= 3) break;
      distractors.push(otherCard.correctAnswer);
    }
  }
  
  // Ensure we have exactly 3 unique distractors
  const uniqueDistractors = [...new Set(distractors)].slice(0, 3);
  
  // If we still don't have 3, create some simple variations
  while (uniqueDistractors.length < 3) {
    const simpleVariation = correctAnswer + 's';
    if (!uniqueDistractors.includes(simpleVariation)) {
      uniqueDistractors.push(simpleVariation);
    } else {
      break; // Avoid infinite loop
    }
  }
  
  return uniqueDistractors;
}

// Create a quiz question from a card
export function createQuizQuestion(card: Card, allCards: Card[]): QuizQuestion {
  const correctAnswer = card.correctAnswer;
  const distractors = generateDistractors(card, allCards);
  
  // Combine correct answer with distractors and ensure uniqueness
  const allOptions = [correctAnswer, ...distractors];
  const uniqueOptions = [...new Set(allOptions)];
  
  // If we don't have exactly 4 unique options, try to generate more
  while (uniqueOptions.length < 4) {
    const additionalDistractors = generateDistractors(card, allCards);
    for (const distractor of additionalDistractors) {
      if (!uniqueOptions.includes(distractor)) {
        uniqueOptions.push(distractor);
        if (uniqueOptions.length >= 4) break;
      }
    }
    // Avoid infinite loop
    if (uniqueOptions.length < 4) {
      uniqueOptions.push(correctAnswer + 'x'); // Simple fallback
      break;
    }
  }
  
  // Take exactly 4 options and shuffle
  const finalOptions = uniqueOptions.slice(0, 4);
  const shuffledOptions = finalOptions.sort(() => Math.random() - 0.5);
  
  // Find the index of the correct answer after shuffling
  const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);
  
  return {
    id: `quiz_${card.id}_${Date.now()}`,
    question: card.phrase,
    options: shuffledOptions,
    correctAnswer: correctAnswer,
    correctAnswerIndex: correctAnswerIndex,
    cardId: card.id
  };
}

// Generate multiple quiz questions
export function generateQuizQuestions(cards: Card[], count: number = 10): QuizQuestion[] {
  if (cards.length === 0) return [];
  
  const questions: QuizQuestion[] = [];
  const usedCardIds = new Set<string>();
  
  // Ensure we don't exceed the number of available cards
  const maxQuestions = Math.min(count, cards.length);
  
  while (questions.length < maxQuestions) {
    // Get a random card that hasn't been used
    const availableCards = cards.filter(card => !usedCardIds.has(card.id));
    if (availableCards.length === 0) break;
    
    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    const question = createQuizQuestion(randomCard, cards);
    
    questions.push(question);
    usedCardIds.add(randomCard.id);
  }
  
  return questions;
}
