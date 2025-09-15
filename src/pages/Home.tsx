import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Portuguese Verb Tenses Flashcards</h1>
      <p>Welcome to your Portuguese verb conjugation learning app!</p>
      <div className="home-actions">
        <p>Choose your learning mode:</p>
        <ul>
          <li>📚 Study Mode - Learn with flashcards</li>
          <li>🧠 Quiz Mode - Test your knowledge</li>
          <li>📊 Statistics - Track your progress</li>
          <li>⚙️ Settings - Customize your experience</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
