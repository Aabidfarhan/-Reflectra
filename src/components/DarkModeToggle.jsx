import React, { useEffect } from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode, sidebarOpen }) => {
  // Load dark mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, [setDarkMode]);

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: sidebarOpen ? 16 : 10,
        zIndex: 200,
        transition: 'left 0.3s ease',
      }}
    >
      <button
        onClick={() => setDarkMode(prev => !prev)}
        style={{
          padding: sidebarOpen ? '8px 12px' : '6px 8px',
          fontSize: sidebarOpen ? '14px' : '12px',
          background: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#fff' : '#111',
          border: '1px solid #666',
          borderRadius: '18px',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
        }}
        title="Toggle Dark Mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default DarkModeToggle;
