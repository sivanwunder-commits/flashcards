/**
 * LoadingState Component
 * 
 * Reusable component for displaying loading, error, and empty states.
 * Consolidates common UI patterns across the application.
 */

import React from 'react';

/**
 * Props for the LoadingState component
 */
interface LoadingStateProps {
  /** Current state type to display */
  state: 'loading' | 'error' | 'empty';
  /** Page title to display */
  title: string;
  /** Loading message (only used when state is 'loading') */
  loadingMessage?: string;
  /** Error message (only used when state is 'error') */
  errorMessage?: string;
  /** Empty state message (only used when state is 'empty') */
  emptyMessage?: string;
  /** Optional retry button callback (typically used with error state) */
  onRetry?: () => void;
  /** Optional action button callback (typically used with empty state) */
  onAction?: () => void;
  /** Label for action button */
  actionLabel?: string;
}

/**
 * LoadingState Component
 * 
 * Displays appropriate UI for loading, error, or empty states.
 * Reduces code duplication across pages and ensures consistent UX.
 * 
 * @example
 * // Loading state
 * <LoadingState 
 *   state="loading" 
 *   title="Quiz Mode" 
 *   loadingMessage="Loading quiz questions..." 
 * />
 * 
 * @example
 * // Error state with retry
 * <LoadingState 
 *   state="error" 
 *   title="Study Mode" 
 *   errorMessage="Failed to load cards"
 *   onRetry={() => window.location.reload()}
 * />
 * 
 * @example
 * // Empty state with action
 * <LoadingState 
 *   state="empty" 
 *   title="Review Mode" 
 *   emptyMessage="No wrong cards to review! Great job!"
 *   onAction={switchToAllCards}
 *   actionLabel="Switch to All Cards"
 * />
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  state,
  title,
  loadingMessage = 'Loading...',
  errorMessage = 'An error occurred',
  emptyMessage = 'No items available',
  onRetry,
  onAction,
  actionLabel = 'Take Action',
}) => {
  return (
    <div className="page-container">
      <h1>{title}</h1>
      
      {state === 'loading' && (
        <div className="loading-message">
          <p>{loadingMessage}</p>
        </div>
      )}
      
      {state === 'error' && (
        <div className="error-message">
          <p>Error: {errorMessage}</p>
          {onRetry && (
            <button onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>
      )}
      
      {state === 'empty' && (
        <div className="no-cards-message">
          <p>{emptyMessage}</p>
          {onAction && (
            <button onClick={onAction} className="action-button">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingState;

