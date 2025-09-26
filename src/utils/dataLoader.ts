import type { Card } from '../types/card';
import { settingsManager } from './settingsManager';

const DATA_BASE_URL = (import.meta as any).env?.BASE_URL ?? '/';

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
  const cards: Card[] = [];
  for (const item of data) {
    if (isCard(item)) {
      cards.push(item);
    } else {
      // Skip invalid entries rather than failing the whole load
      // Could add logging here if needed
    }
  }
  if (cards.length === 0) {
    throw new Error('No valid cards found in cards.json');
  }

  // Filter cards based on enabled tenses setting
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


