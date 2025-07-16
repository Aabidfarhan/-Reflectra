import React, { useState, useEffect } from 'react';
import SplineScene from './SplineScene';
import ChatBot from './components/ChatBot';
import './App.css';

function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2500); // wait 6 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="chatbot-container">
      <SplineScene />

      {/* Only show the chatbot after 6 seconds */}
      {showContent && (
        <div className="foreground-content">
          <ChatBot />
        </div>
      )}
    </div>
  );
}

export default App;
