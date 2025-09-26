import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Study from '../Study'
import { loadCards } from '../../utils/dataLoader'
import type { Card } from '../../types/card'

// Mock the data loader
vi.mock('../../utils/dataLoader')
const mockLoadCards = vi.mocked(loadCards)

// Mock card data
const mockCards: Card[] = [
  {
    id: 'card-1',
    phrase: 'Eu _____ (comer) pizza ontem',
    verb: 'comer',
    tense: 'pretérito_perfeito',
    subject: 'eu',
    correctAnswer: 'comi',
    verbType: 'regular',
    category: 'food'
  },
  {
    id: 'card-2',
    phrase: 'Nós _____ (falar) português',
    verb: 'falar',
    tense: 'presente_do_subjuntivo',
    subject: 'nós',
    correctAnswer: 'falemos',
    verbType: 'regular',
    category: 'communication'
  }
]

describe('Study Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('shows loading message initially', () => {
      mockLoadCards.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<Study />)
      
      expect(screen.getByText('Loading flashcards...')).toBeInTheDocument()
    })
  })

  describe('Successful Data Loading', () => {
    it('loads and displays cards successfully', async () => {
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Study Mode')).toBeInTheDocument()
      expect(screen.getByText('Practice Portuguese verb conjugations with flashcards')).toBeInTheDocument()
    })

    it('shows initial statistics', async () => {
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Correct:')).toBeInTheDocument()
        expect(screen.getByText('Incorrect:')).toBeInTheDocument()
        expect(screen.getByText('Accuracy:')).toBeInTheDocument()
      })
      
      expect(screen.getByText('0', { selector: '.stat-value.correct' })).toBeInTheDocument() // Initial correct count
      expect(screen.getByText('0%')).toBeInTheDocument() // Initial accuracy
    })

    it('shows card navigation', async () => {
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('1 of 2')).toBeInTheDocument()
      })
      
      expect(screen.getByText('← Previous')).toBeInTheDocument()
      expect(screen.getByText('Next →')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when data loading fails', async () => {
      const errorMessage = 'Failed to load cards'
      mockLoadCards.mockRejectedValueOnce(new Error(errorMessage))
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
      })
      
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('shows no cards message when empty array is returned', async () => {
      mockLoadCards.mockResolvedValueOnce([])
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('No flashcards available')).toBeInTheDocument()
      })
    })
  })

  describe('Statistics Tracking', () => {
    it('updates statistics when user answers correctly', async () => {
      const user = userEvent.setup()
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      // Flip the card
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      // Answer correctly
      const correctButton = screen.getByText('Got it right')
      await user.click(correctButton)
      
      // Check that statistics updated
      expect(screen.getByText('1', { selector: '.stat-value.correct' })).toBeInTheDocument() // Correct count
      expect(screen.getByText('100%')).toBeInTheDocument() // Accuracy
    })

    it('updates statistics when user answers incorrectly', async () => {
      const user = userEvent.setup()
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      // Flip the card
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      // Answer incorrectly
      const incorrectButton = screen.getByText('Got it wrong')
      await user.click(incorrectButton)
      
      // Check that statistics updated
      expect(screen.getByText('0', { selector: '.stat-value.correct' })).toBeInTheDocument() // Correct count
      expect(screen.getByText('0%')).toBeInTheDocument() // Accuracy
    })

    it('calculates accuracy correctly with mixed answers', async () => {
      const user = userEvent.setup()
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      // Answer first card correctly
      const card1 = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card1!)
      await user.click(screen.getByText('Got it right'))
      
      // Navigate to next card
      await user.click(screen.getByText('Next →'))
      
      await waitFor(() => {
        expect(screen.getByText('Nós _____ (falar) português')).toBeInTheDocument()
      })
      
      // Answer second card incorrectly
      const card2 = screen.getByText('Nós _____ (falar) português').closest('.card')
      await user.click(card2!)
      await user.click(screen.getByText('Got it wrong'))
      
      // Check accuracy calculation (1 correct out of 2 total = 50%)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('navigates between cards correctly', async () => {
      const user = userEvent.setup()
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      // Should show first card initially
      expect(screen.getByText('1 of 2')).toBeInTheDocument()
      expect(screen.getByText('← Previous')).toBeDisabled()
      expect(screen.getByText('Next →')).not.toBeDisabled()
      
      // Navigate to next card
      await user.click(screen.getByText('Next →'))
      
      await waitFor(() => {
        expect(screen.getByText('Nós _____ (falar) português')).toBeInTheDocument()
      })
      
      // Should show second card
      expect(screen.getByText('2 of 2')).toBeInTheDocument()
      expect(screen.getByText('← Previous')).not.toBeDisabled()
      expect(screen.getByText('Next →')).toBeDisabled()
    })

    it('handles navigation edge cases', async () => {
      const user = userEvent.setup()
      mockLoadCards.mockResolvedValueOnce(mockCards)
      
      render(<Study />)
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      // Try to go to previous card (should be disabled)
      const prevButton = screen.getByText('← Previous')
      expect(prevButton).toBeDisabled()
      
      // Navigate to next card
      await user.click(screen.getByText('Next →'))
      
      await waitFor(() => {
        expect(screen.getByText('Nós _____ (falar) português')).toBeInTheDocument()
      })
      
      // Navigate back to first card
      await user.click(screen.getByText('← Previous'))
      
      await waitFor(() => {
        expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      })
      
      expect(screen.getByText('1 of 2')).toBeInTheDocument()
    })
  })
})
