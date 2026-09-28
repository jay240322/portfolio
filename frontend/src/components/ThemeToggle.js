import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ isMobile = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (isMobile) {
    return (
      <button
        className="theme-toggle-mobile"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="theme-toggle-mobile-left">
          {isDark ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#3b82f6" />}
          <span>Theme</span>
        </div>
        <span className="theme-toggle-label" style={{ color: 'var(--accent-color)' }}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`theme-toggle-btn ${isDark ? 'dark-mode' : 'light-mode'}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
    >
      <span className="theme-toggle-icon">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
