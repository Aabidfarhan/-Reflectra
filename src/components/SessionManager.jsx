import React from 'react';
import '../styles/SessionManager.css';

const SessionManager = ({ sessions, currentSessionId, setCurrentSessionId, setSessions }) => {
  const createSession = () => {
    const newId = sessions.length + 1;
    setSessions([...sessions, { id: newId, name: `Session ${newId}`, messages: [] }]);
    setCurrentSessionId(newId);
  };

  return (
    <div className="session-manager">
      <h3>Sessions</h3>
      {sessions.map(session => (
        <div
          key={session.id}
          className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
          onClick={() => setCurrentSessionId(session.id)}
        >
          {session.name}
        </div>
      ))}
      <button onClick={createSession}>+ New Session</button>
    </div>
  );
};

export default SessionManager;
