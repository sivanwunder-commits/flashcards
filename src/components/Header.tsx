import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navigation">
        <div className="nav-brand">
          <Link to="/">🇧🇷 Portuguese Flashcards</Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
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

        {/* Mobile Navigation */}
        <ul className={`nav-links mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">🏠</span>
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/study" 
              className={isActive('/study') ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">📚</span>
              Study
            </Link>
          </li>
          <li>
            <Link 
              to="/quiz" 
              className={isActive('/quiz') ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">🧠</span>
              Quiz
            </Link>
          </li>
          <li>
            <Link 
              to="/learn" 
              className={isActive('/learn') ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">🌴</span>
              Learn
            </Link>
          </li>
          <li>
            <Link 
              to="/statistics" 
              className={isActive('/statistics') ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">📊</span>
              Statistics
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={isActive('/settings') ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
