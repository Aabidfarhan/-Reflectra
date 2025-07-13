import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import BookTherapistPage from './BookTherapistPage';
import SessionSummaryPage from './SessionSummaryPage';
import ChatInput from './ChatInput';
import TaskPanel from './TaskPanel';
import JournalPanel from './JournalPanel';
import JournalsPage from './JournalsPage';
import DarkModeToggle from './DarkModeToggle';
import '../styles/ChatBot.css';

// Voice Message Bubble Component
const MessageBubble = ({ msg, voice }) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(msg.text);
    utterance.lang = 'en-IN';
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className={`message ${msg.sender}`}>
      <div className="bubble-wrapper">
        <div className="bubble">{msg.text}</div>
        {msg.sender === 'ai' && (
          <button
            className="speak-button"
            onClick={speak}
            title="Read in Microsoft Heera"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );
};

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([{ id: 1, name: 'Session 1', messages: [] }]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [chatStarted, setChatStarted] = useState(false);
  const [mode, setMode] = useState('default');
  const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('darkMode');
  return saved === 'true'; // default false if null
});

  const [typing, setTyping] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [voice, setVoice] = useState(null);

  const chatBoxRef = useRef(null);
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
  }, [currentSession?.messages, typing]);

  // Load Microsoft Heera voice
  useEffect(() => {
    const loadVoice = () => {
      const allVoices = speechSynthesis.getVoices();
      const heera = allVoices.find((v) =>
        v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('microsoft heera')
      );
      if (heera) setVoice(heera);
    };

    loadVoice();
    speechSynthesis.onvoiceschanged = loadVoice;
  }, []);

  // Persist dark mode across refresh
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Map mode to different endpoints
  const modeToUrlMap = {
    guided_journaling: 'https://your-guided-url.ngrok-free.app/chat',
    distortion_detection: 'https://your-distortion-url.ngrok-free.app/chat',
    thought_deframing: 'https://your-deframe-url.ngrok-free.app/chat',
    affirmation_separator: 'https://8f638e8e2d67.ngrok-free.app/affirmation',
    default: 'https://5ef2e9bd1b39.ngrok-free.app/chat'
  };

  // Send message 
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'me', text: input };
    setInput('');
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage] } : s
      )
    );

    if (!chatStarted) setChatStarted(true);
    setTyping(true);

    const endpoint = modeToUrlMap[mode] || modeToUrlMap['default'];

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, mode })
      });

      if (!response.ok) throw new Error('Server Error');

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.reply };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMessage] } : s
        )
      );
    } catch {
      const fallback = {
        sender: 'ai',
        text: '⚠️ Sorry, I couldn\'t connect to the server. Try again later.'
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId ? { ...s, messages: [...s.messages, fallback] } : s
        )
      );
    }

    setTyping(false);
  };

  // Render messages
  const renderMessages = () =>
    currentSession?.messages.map((msg, index) => (
      <MessageBubble key={index} msg={msg} voice={voice} />
    ));

  return (
    <div className={`chatbot-container ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        onSelect={(val) => {
          setView(val);
          setSelectedTask(null);
        }}
        selected={view}
      />

      <button
        className={`sidebar-toggle ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '⬅️' : '➡️'}
      </button>

      <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <DarkModeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
        />

        {view === 'chat' && (
          <div className="chat-area">
            <div className="chat-box" ref={chatBoxRef}>
              {renderMessages()}
              {typing && (
                <div className="message ai">
                  <div className="bubble">Typing...</div>
                </div>
              )}
            </div>

            <ChatInput
              input={input}
              setInput={setInput}
              onSend={sendMessage}
              setMode={setMode}
              onVoiceInput={(text) => setInput(text)}
            />
          </div>
        )}

        {view === 'tasks' && (
          <TaskPanel
            mode={mode}
            onClose={() => setView('chat')}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        )}

        {view === 'journals' && !selectedTask && (
          <JournalsPage onNew={() => setView('newJournal')} />
        )}

        {view === 'journals' && selectedTask && (
          <JournalPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}

        {view === 'newJournal' && (
          <JournalPanel task={{ title: '' }} onClose={() => setView('journals')} />
        )}

        {view === 'bookTherapist' && <BookTherapistPage />}
        {view === 'sessionSummary' && <SessionSummaryPage />}
      </div>
    </div>
  );
};

export default ChatBot;
