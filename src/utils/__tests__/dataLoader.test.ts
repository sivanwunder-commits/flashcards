import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadCards } from '../dataLoader'
import type { Card } from '../../types/card'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('dataLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('loadCards', () => {
    it('loads valid cards successfully', async () => {
      const mockCards: Card[] = [
        {
          id: 'test-1',
          phrase: 'Eu _____ (comer) pizza',
          verb: 'comer',
          tense: 'pretérito_perfeito',
          subject: 'eu',
          correctAnswer: 'comi',
          verbType: 'regular',
          category: 'food'
        },
        {
          id: 'test-2',
          phrase: 'Nós _____ (falar) português',
          verb: 'falar',
          tense: 'presente_do_subjuntivo',
          subject: 'nós',
          correctAnswer: 'falemos',
          verbType: 'regular',
          category: 'communication'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards
      })

      const result = await loadCards()

      expect(mockFetch).toHaveBeenCalledWith('/data/cards.json', { cache: 'no-cache' })
      expect(result).toEqual(mockCards)
      expect(result).toHaveLength(2)
    })

    it('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(loadCards()).rejects.toThrow('Network error')
    })

    it('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(loadCards()).rejects.toThrow('Failed to load cards.json: 404 Not Found')
    })

    it('handles invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => 'invalid json'
      })

      await expect(loadCards()).rejects.toThrow('Invalid cards data: expected an array')
    })

    it('filters out invalid card entries', async () => {
      const mixedData = [
        {
          id: 'valid-1',
          phrase: 'Eu _____ (comer) pizza',
          verb: 'comer',
          tense: 'pretérito_perfeito',
          subject: 'eu',
          correctAnswer: 'comi',
          verbType: 'regular',
          category: 'food'
        },
        {
          // Invalid card - missing required fields
          id: 'invalid-1',
          phrase: 'Invalid card'
        },
        {
          id: 'valid-2',
          phrase: 'Nós _____ (falar) português',
          verb: 'falar',
          tense: 'presente_do_subjuntivo',
          subject: 'nós',
          correctAnswer: 'falemos',
          verbType: 'regular',
          category: 'communication'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mixedData
      })

      const result = await loadCards()

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('valid-1')
      expect(result[1].id).toBe('valid-2')
    })

    it('throws error when no valid cards are found', async () => {
      const invalidData = [
        { id: 'invalid-1', phrase: 'Invalid card' },
        { id: 'invalid-2', phrase: 'Another invalid card' }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidData
      })

      await expect(loadCards()).rejects.toThrow('No valid cards found in cards.json')
    })

    it('handles empty array response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      await expect(loadCards()).rejects.toThrow('No valid cards found in cards.json')
    })

    it('validates all required card fields', async () => {
      const incompleteCard = {
        id: 'incomplete',
        phrase: 'Eu _____ (comer) pizza',
        verb: 'comer',
        tense: 'pretérito_perfeito',
        subject: 'eu',
        correctAnswer: 'comi',
        verbType: 'regular'
        // Missing 'category' field
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [incompleteCard]
      })

      await expect(loadCards()).rejects.toThrow('No valid cards found in cards.json')
    })

    it('validates field types correctly', async () => {
      const wrongTypeCard = {
        id: 123, // Should be string
        phrase: 'Eu _____ (comer) pizza',
        verb: 'comer',
        tense: 'pretérito_perfeito',
        subject: 'eu',
        correctAnswer: 'comi',
        verbType: 'regular',
        category: 'food'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [wrongTypeCard]
      })

      await expect(loadCards()).rejects.toThrow('No valid cards found in cards.json')
    })
  })
})
