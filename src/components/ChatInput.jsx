import React, { useState, useRef, useEffect } from 'react';
import MicButton from './MicButton';
import '../styles/ChatBot.css';
import '../styles/ModeSelector.css';

const modeMap = {
  default: '💬 Default',
  guided_journaling: '📝 Guided Journaling',
  distortion_detection: '🔍 Distortion Detection',
  thought_deframing: '🧠 Thought Deframing',
  affirmation_separator: '🌟 Affirmation Separator'
};

const ChatInput = ({ input, setInput, onSend, onVoiceInput, setMode }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMode, setSelectedMode] = useState('default');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeSelect = (mode) => {
    setMode(mode);
    setSelectedMode(mode);
    setShowDropdown(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    let formattedInput;
    switch (selectedMode) {
      case 'guided_journaling':
        formattedInput = `Here's my journal entry:\n${input}`;
        break;
      case 'distortion_detection':
        formattedInput = `Can you check if this has cognitive distortions?\n${input}`;
        break;
      case 'thought_deframing':
        formattedInput = `Help me reframe this thought:\n${input}`;
        break;
      case 'affirmation_separator':
        formattedInput = `Please extract affirmations from this:\n${input}`;
        break;
      default:
        formattedInput = input;
    }

    setInput(formattedInput);
    setTimeout(onSend, 0); // ensure state updates before sending
  };

  return (
    <div className="chat-input-area responsive-chat-input">
      <div className="mode-selector-inline" ref={dropdownRef}>
        <button
          className="dropdown-trigger"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          {modeMap[selectedMode]}
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            {Object.entries(modeMap).map(([key, label]) => (
              <div
                key={key}
                className="dropdown-item"
                onClick={() => handleModeSelect(key)}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Ask me anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />

      <button onClick={handleSend}>➤</button>

      <MicButton
        onVoiceInput={(text) => {
          setInput(text);
          setTimeout(handleSend, 10);
        }}
      />
    </div>
  );
};

export default ChatInput;
