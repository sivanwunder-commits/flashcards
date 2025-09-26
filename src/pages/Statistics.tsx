import React, { useState, useEffect } from 'react';
import { progressTracker, statisticsCalculator } from '../utils/progressTracker';
import { loadCards } from '../utils/dataLoader';
import type { Card } from '../types/card';
import type { StatisticsSummary } from '../types/userProgress';
import './Statistics.css';

const Statistics: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [statistics, setStatistics] = useState<StatisticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(30);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'trends'>('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cardsData = await loadCards();
        
        setCards(cardsData);
        
        // Calculate detailed statistics with card data
        const detailedStats = statisticsCalculator.calculateDetailedStatistics(cardsData);
        setStatistics(detailedStats);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAccuracyPercentage = (correct: number, total: number): number => {
    return statisticsCalculator.getAccuracyPercentage(correct, total);
  };

  const getStreakInfo = () => {
    return statisticsCalculator.getStreakInfo();
  };

  const getProgressOverTime = () => {
    return statisticsCalculator.getProgressOverTime(selectedTimeRange);
  };

  const clearAllProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress data? This action cannot be undone.')) {
      progressTracker.clearAllProgress();
      setStatistics(progressTracker.getStatistics());
    }
  };

  const exportProgress = () => {
    const data = progressTracker.exportProgress();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flashcard-progress.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="loading-message">
          <h2>Loading Statistics...</h2>
          <p>Please wait while we calculate your progress.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="error-message">
          <h2>Error Loading Statistics</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="statistics-page">
        <div className="no-data-message">
          <h2>No Statistics Available</h2>
          <p>Start studying to see your progress statistics!</p>
        </div>
      </div>
    );
  }

  const streakInfo = getStreakInfo();
  const progressData = getProgressOverTime();
  const overallAccuracy = getAccuracyPercentage(statistics.totalCorrect, statistics.totalStudied);

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>📊 Your Progress Statistics</h1>
        <p>Track your learning journey and see how you're improving!</p>
        
        <div className="view-selector">
          <button 
            className={`view-button ${selectedView === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedView('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`view-button ${selectedView === 'detailed' ? 'active' : ''}`}
            onClick={() => setSelectedView('detailed')}
          >
            🔍 Detailed
          </button>
          <button 
            className={`view-button ${selectedView === 'trends' ? 'active' : ''}`}
            onClick={() => setSelectedView('trends')}
          >
            📈 Trends
          </button>
        </div>
      </div>

      {/* Conditional Content Based on View */}
      {selectedView === 'overview' && (
        <>
          {/* Overall Statistics */}
          <div className="statistics-section">
            <h2>📈 Overall Performance</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{statistics.totalStudied}</div>
              <div className="stat-label">Cards Studied</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{statistics.totalCorrect}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{overallAccuracy}%</div>
              <div className="stat-label">Overall Accuracy</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{streakInfo.current}</div>
              <div className="stat-label">Current Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Tense */}
      <div className="statistics-section">
        <h2>⏰ Performance by Tense</h2>
        {Object.keys(statistics.accuracyByTense).length > 0 ? (
          <div className="performance-grid">
            {Object.entries(statistics.accuracyByTense).map(([tense, data]) => {
              const accuracy = getAccuracyPercentage(data.correct, data.total);
              return (
                <div key={tense} className="performance-card">
                  <div className="performance-header">
                    <h3>{tense.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <div className="performance-accuracy">{accuracy}%</div>
                  </div>
                  <div className="performance-details">
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                    <div className="performance-stats">
                      <span>{data.correct}/{data.total} correct</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data-message">
            <p>No tense performance data available yet. Start studying to see your progress by tense!</p>
          </div>
        )}
      </div>

      {/* Performance by Verb Type */}
      <div className="statistics-section">
        <h2>🔤 Performance by Verb Type</h2>
        {Object.keys(statistics.accuracyByVerbType).length > 0 ? (
          <div className="performance-grid">
            {Object.entries(statistics.accuracyByVerbType).map(([verbType, data]) => {
              const accuracy = getAccuracyPercentage(data.correct, data.total);
              return (
                <div key={verbType} className="performance-card">
                  <div className="performance-header">
                    <h3>{verbType.charAt(0).toUpperCase() + verbType.slice(1)} Verbs</h3>
                    <div className="performance-accuracy">{accuracy}%</div>
                  </div>
                  <div className="performance-details">
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                    <div className="performance-stats">
                      <span>{data.correct}/{data.total} correct</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data-message">
            <p>No verb type performance data available yet. Start studying to see your progress by verb type!</p>
          </div>
        )}
      </div>

      {/* Progress Over Time */}
      <div className="statistics-section">
        <h2>📅 Progress Over Time</h2>
        <div className="time-range-selector">
          <label>Show last:</label>
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        
        <div className="progress-chart">
          {progressData.map((day, index) => (
            <div key={day.date} className="progress-day">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-studied"
                  style={{ height: `${Math.max(day.studied * 2, 4)}px` }}
                  title={`${day.studied} cards studied`}
                ></div>
                <div 
                  className="progress-bar-correct"
                  style={{ height: `${Math.max(day.correct * 2, 4)}px` }}
                  title={`${day.correct} correct answers`}
                ></div>
              </div>
              <div className="progress-date">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="progress-accuracy">
                {day.accuracy}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Streaks */}
      <div className="statistics-section">
        <h2>🔥 Study Streaks</h2>
        <div className="streak-info">
          <div className="streak-card">
            <div className="streak-icon">🔥</div>
            <div className="streak-content">
              <div className="streak-value">{streakInfo.current}</div>
              <div className="streak-label">Current Streak</div>
            </div>
          </div>
          
          <div className="streak-card">
            <div className="streak-icon">🏆</div>
            <div className="streak-content">
              <div className="streak-value">{streakInfo.longest}</div>
              <div className="streak-label">Longest Streak</div>
            </div>
          </div>
        </div>
      </div>

          {/* Data Management */}
          <div className="statistics-section">
            <h2>⚙️ Data Management</h2>
            <div className="data-management">
              <button onClick={exportProgress} className="export-button">
                📤 Export Progress
              </button>
              <button onClick={clearAllProgress} className="clear-button">
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        </>
      )}

      {selectedView === 'detailed' && (
        <div className="statistics-section">
          <h2>🔍 Detailed Analytics</h2>
          <div className="detailed-stats">
            <div className="analytics-card">
              <h3>📊 Performance Breakdown</h3>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span className="breakdown-label">Average Time per Question:</span>
                  <span className="breakdown-value">
                    {statistics.averageTimePerQuestion ? 
                      `${Math.round(statistics.averageTimePerQuestion / 1000)}s` : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Total Study Sessions:</span>
                  <span className="breakdown-value">{statistics.totalSessions || 0}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Best Single Session:</span>
                  <span className="breakdown-value">{statistics.bestSessionScore || 0}%</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Most Studied Tense:</span>
                  <span className="breakdown-value">
                    {Object.keys(statistics.accuracyByTense).length > 0 ? 
                      Object.entries(statistics.accuracyByTense)
                        .sort(([,a], [,b]) => b.total - a.total)[0][0]
                        .replace(/_/g, ' ') : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'trends' && (
        <div className="statistics-section">
          <h2>📈 Learning Trends</h2>
          <div className="trends-container">
            <div className="trend-card">
              <h3>📅 Daily Progress</h3>
              <div className="trend-chart">
                {progressData.slice(-7).map((day, index) => (
                  <div key={index} className="trend-bar">
                    <div 
                      className="trend-bar-fill"
                      style={{ height: `${Math.max(day.accuracy, 10)}%` }}
                      title={`${day.date}: ${day.accuracy}% accuracy`}
                    ></div>
                    <div className="trend-label">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="trend-card">
              <h3>🎯 Accuracy Trend</h3>
              <div className="accuracy-trend">
                <div className="trend-line">
                  {progressData.slice(-14).map((day, index) => (
                    <div 
                      key={index}
                      className="trend-point"
                      style={{ 
                        left: `${(index / (progressData.slice(-14).length - 1)) * 100}%`,
                        bottom: `${day.accuracy}%`
                      }}
                      title={`${day.date}: ${day.accuracy}%`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;