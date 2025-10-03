import type { Card } from '../types/card';
import { settingsManager } from './settingsManager';

/**
 * Data Loader Module
 * 
 * Handles loading and validation of flashcard data from JSON files.
 * Features include:
 * - Type-safe card validation
 * - Tense filtering based on user settings
 * - Graceful error handling
 * - Fallback mechanisms for resilience
 */

// Base URL for data assets (configured by build tool)
const DATA_BASE_URL = (import.meta as any).env?.BASE_URL ?? '/';

/**
 * Type guard to validate card data structure
 * Ensures all required string fields are present and correctly typed
 * 
 * @param value - Unknown value to validate
 * @returns True if value is a valid Card object
 */
function isCard(value: unknown): value is Card {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  const requiredStringFields = [
    'id',
    'phrase',
    'verb',
    'tense',
    'subject',
    'correctAnswer',
    'verbType',
    'category',
  ];
  return requiredStringFields.every((key) => typeof obj[key] === 'string');
}

/**
 * Loads flashcard data from JSON file with filtering and validation
 * 
 * Process:
 * 1. Fetches cards.json from public data directory
 * 2. Validates each card's structure
 * 3. Filters cards based on user's enabled tenses setting
 * 4. Falls back to all cards if no matches or settings unavailable
 * 
 * @returns Promise resolving to array of validated Card objects
 * @throws Error if fetch fails, data is invalid, or no valid cards found
 */
export async function loadCards(): Promise<Card[]> {
  const url = `${DATA_BASE_URL}data/cards.json`;
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load cards.json: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid cards data: expected an array');
  }
  
  // Validate and collect cards
  const cards: Card[] = [];
  for (const item of data) {
    if (isCard(item)) {
      cards.push(item);
    }
    // Invalid entries are silently skipped to avoid failing entire load
  }
  
  if (cards.length === 0) {
    throw new Error('No valid cards found in cards.json');
  }

  // Filter cards based on user's enabled tenses setting
  try {
    const settings = settingsManager.getSettings();
    const enabledTenses = settings.enabledTenses || [
      'pretérito_perfeito',
      'pretérito_imperfeito',
      'futuro_do_presente',
      'presente_do_subjuntivo',
      'imperfeito_do_subjuntivo'
    ];
    
    const filteredCards = cards.filter(card => 
      enabledTenses.includes(card.tense)
    );
    
    // If no cards match the enabled tenses, return all cards as fallback
    return filteredCards.length > 0 ? filteredCards : cards;
  } catch (settingsError) {
    console.warn('Could not load settings for tense filtering, using all cards:', settingsError);
    return cards;
  }
}


