import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="tropical-header">
        <div className="tropical-icon">🌴</div>
        <h1>Portuguese Verb Tenses Flashcards</h1>
        <div className="tropical-icon">🌺</div>
      </div>
      <p>Welcome to your tropical Portuguese verb conjugation learning paradise! 🏝️</p>
      <div className="home-actions">
        <p>Choose your learning adventure:</p>
        <ul>
          <li>
            <Link to="/study" className="action-link">
              <span className="tropical-icon">🌴</span>
              <span className="action-text">Study Mode - Learn with flashcards</span>
            </Link>
          </li>
          <li>
            <Link to="/quiz" className="action-link">
              <span className="tropical-icon">🌊</span>
              <span className="action-text">Quiz Mode - Test your knowledge</span>
            </Link>
          </li>
          <li>
            <Link to="/learn" className="action-link">
              <span className="tropical-icon">📚</span>
              <span className="action-text">Learn - Master verb tenses</span>
            </Link>
          </li>
          <li>
            <Link to="/statistics" className="action-link">
              <span className="tropical-icon">📊</span>
              <span className="action-text">Statistics - Track your progress</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="action-link">
              <span className="tropical-icon">⚙️</span>
              <span className="action-text">Settings - Customize your experience</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="tropical-footer">
        <p>🌞 Ready to dive into the beautiful world of Portuguese verbs? 🌞</p>
      </div>
    </div>
  );
};

export default Home;
