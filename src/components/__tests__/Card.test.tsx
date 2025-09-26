import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from '../Card'
import type { Card as CardType } from '../../types/card'

// Mock card data for testing
const mockCard: CardType = {
  id: 'test-card-1',
  phrase: 'Eu _____ (comer) pizza ontem',
  verb: 'comer',
  tense: 'pretérito_perfeito',
  subject: 'eu',
  correctAnswer: 'comi',
  verbType: 'regular',
  category: 'food_verbs'
}

// Mock functions
const mockOnCorrect = vi.fn()
const mockOnIncorrect = vi.fn()
const mockOnNext = vi.fn()
const mockOnPrevious = vi.fn()

const defaultProps = {
  card: mockCard,
  onCorrect: mockOnCorrect,
  onIncorrect: mockOnIncorrect,
  onNext: mockOnNext,
  onPrevious: mockOnPrevious,
  currentIndex: 0,
  totalCards: 5,
  canGoPrevious: false,
  canGoNext: true
}

describe('Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the card phrase and verb correctly', () => {
      render(<Card {...defaultProps} />)
      
      expect(screen.getByText('Eu _____ (comer) pizza ontem')).toBeInTheDocument()
      expect(screen.getByText('(comer)')).toBeInTheDocument()
    })

    it('displays tense and subject information', () => {
      render(<Card {...defaultProps} />)
      
      expect(screen.getAllByText('pretérito perfeito')).toHaveLength(2) // Front and back
      expect(screen.getAllByText('eu')).toHaveLength(2) // Front and back
    })

    it('shows current card position', () => {
      render(<Card {...defaultProps} />)
      
      expect(screen.getByText('1 of 5')).toBeInTheDocument()
    })

    it('shows flip hint initially', () => {
      render(<Card {...defaultProps} />)
      
      expect(screen.getByText('Click to reveal answer')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('disables previous button when canGoPrevious is false', () => {
      render(<Card {...defaultProps} canGoPrevious={false} />)
      
      const prevButton = screen.getByText('← Previous')
      expect(prevButton).toBeDisabled()
    })

    it('enables previous button when canGoPrevious is true', () => {
      render(<Card {...defaultProps} canGoPrevious={true} />)
      
      const prevButton = screen.getByText('← Previous')
      expect(prevButton).not.toBeDisabled()
    })

    it('disables next button when canGoNext is false', () => {
      render(<Card {...defaultProps} canGoNext={false} />)
      
      const nextButton = screen.getByText('Next →')
      expect(nextButton).toBeDisabled()
    })

    it('enables next button when canGoNext is true', () => {
      render(<Card {...defaultProps} canGoNext={true} />)
      
      const nextButton = screen.getByText('Next →')
      expect(nextButton).not.toBeDisabled()
    })

    it('calls onPrevious when previous button is clicked', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} canGoPrevious={true} />)
      
      const prevButton = screen.getByText('← Previous')
      await user.click(prevButton)
      
      expect(mockOnPrevious).toHaveBeenCalledTimes(1)
    })

    it('calls onNext when next button is clicked', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} canGoNext={true} />)
      
      const nextButton = screen.getByText('Next →')
      await user.click(nextButton)
      
      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })
  })

  describe('Card Flipping', () => {
    it('flips card when clicked', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      expect(card).not.toHaveClass('flipped')
      
      await user.click(card!)
      
      expect(card).toHaveClass('flipped')
    })

    it('shows answer after flip', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      expect(screen.getByText('Eu comi (comer) pizza ontem')).toBeInTheDocument()
      expect(screen.getByText(/Answer:/)).toBeInTheDocument()
      expect(screen.getByText('comi')).toBeInTheDocument()
    })

    it('hides flip hint after flip', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      expect(screen.getByText('Click to reveal answer')).toBeInTheDocument()
      
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      expect(screen.queryByText('Click to reveal answer')).not.toBeInTheDocument()
    })

    it('shows answer buttons after flip', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      expect(screen.getByText('Got it wrong')).toBeInTheDocument()
      expect(screen.getByText('Got it right')).toBeInTheDocument()
    })
  })

  describe('Answer Feedback', () => {
    it('calls onIncorrect when "Got it wrong" is clicked', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      // Flip the card first
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      // Click "Got it wrong"
      const wrongButton = screen.getByText('Got it wrong')
      await user.click(wrongButton)
      
      expect(mockOnIncorrect).toHaveBeenCalledTimes(1)
    })

    it('calls onCorrect when "Got it right" is clicked', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      // Flip the card first
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      // Click "Got it right"
      const rightButton = screen.getByText('Got it right')
      await user.click(rightButton)
      
      expect(mockOnCorrect).toHaveBeenCalledTimes(1)
    })

    it('shows continue section after answering', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      // Flip the card and answer
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      const rightButton = screen.getByText('Got it right')
      await user.click(rightButton)
      
      expect(screen.getByText('Continue')).toBeInTheDocument()
      expect(screen.getByText('Great job!')).toBeInTheDocument()
    })

    it('hides answer buttons after answering', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      // Flip the card and answer
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      const rightButton = screen.getByText('Got it right')
      await user.click(rightButton)
      
      expect(screen.queryByText('Got it wrong')).not.toBeInTheDocument()
      expect(screen.queryByText('Got it right')).not.toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    it('resets card state when navigating to next card', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      // Flip the card
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      expect(card).toHaveClass('flipped')
      
      // Click next button
      const nextButton = screen.getByText('Next →')
      await user.click(nextButton)
      
      expect(mockOnNext).toHaveBeenCalledTimes(1)
    })

    it('resets card state when navigating to previous card', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} canGoPrevious={true} />)
      
      // Flip the card
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      expect(card).toHaveClass('flipped')
      
      // Click previous button
      const prevButton = screen.getByText('← Previous')
      await user.click(prevButton)
      
      expect(mockOnPrevious).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('has proper button labels', () => {
      render(<Card {...defaultProps} />)
      
      expect(screen.getByText('← Previous')).toBeInTheDocument()
      expect(screen.getByText('Next →')).toBeInTheDocument()
    })

    it('shows proper feedback messages', async () => {
      const user = userEvent.setup()
      render(<Card {...defaultProps} />)
      
      // Flip and answer correctly
      const card = screen.getByText('Eu _____ (comer) pizza ontem').closest('.card')
      await user.click(card!)
      
      const rightButton = screen.getByText('Got it right')
      await user.click(rightButton)
      
      expect(screen.getByText('Great job!')).toBeInTheDocument()
    })
  })
})
