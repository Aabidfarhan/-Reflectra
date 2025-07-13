import React, { useState } from 'react';
import '../styles/ModeSelector.css';

const ModeSelector = ({ setMode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mode-selector">
      <button
        className="dropdown-trigger"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      >
        Resources ⌄
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => setMode('guided_journaling')}>
            Blog
          </div>
          <div className="dropdown-item" onClick={() => setMode('distortion_detection')}>
            Case Studies
          </div>
          <div className="dropdown-item with-arrow" onClick={() => setMode('thought_deframing')}>
            Press <span className="arrow">›</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
