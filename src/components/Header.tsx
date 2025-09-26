import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <nav className="navigation">
        <div className="nav-brand">
          <Link to="/">🇧🇷 Portuguese Flashcards</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/study" 
              className={isActive('/study') ? 'active' : ''}
            >
              Study
            </Link>
          </li>
          <li>
            <Link 
              to="/quiz" 
              className={isActive('/quiz') ? 'active' : ''}
            >
              Quiz
            </Link>
          </li>
          <li>
            <Link 
              to="/learn" 
              className={isActive('/learn') ? 'active' : ''}
            >
              Learn
            </Link>
          </li>
          <li>
            <Link 
              to="/statistics" 
              className={isActive('/statistics') ? 'active' : ''}
            >
              Statistics
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={isActive('/settings') ? 'active' : ''}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
