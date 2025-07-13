import React, { useState } from 'react';
import '../styles/MicButton.css'; // Make sure this exists

const MicButton = ({ onVoiceInput }) => {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setStatus("🎙️ Listening...");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onVoiceInput(transcript);
      setListening(false);
      setTimeout(() => setStatus(""), 2000);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setStatus("❌ Error capturing voice.");
      setListening(false);
    };

    recognition.onend = () => {
      if (listening) setListening(false);
    };
  };

  return (
    <div className="mic-button-wrapper">
      <button
        className={`mic-button ${listening ? 'active' : ''}`}
        onClick={startListening}
        title="Click to speak"
      >
        <span className="mic-emoji">🎙️</span>
      </button>

      {status && (
        <span className="mic-status">
          {status}
        </span>
      )}
    </div>
  );
};

export default MicButton;
