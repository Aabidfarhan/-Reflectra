import React, { useEffect, useState } from 'react';
import '../styles/JournalsPage.css';

const JournalsPage = ({ onNew }) => {
  const [journals, setJournals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('journals');
    if (stored) {
      setJournals(JSON.parse(stored));
    }
  }, []);

  const saveEdit = (index) => {
    const updated = [...journals];
    updated[index] = {
      ...updated[index],
      title: editTitle || 'Untitled',
      content: editContent,
      time: new Date().toLocaleString(),
    };
    setJournals(updated);
    localStorage.setItem('journals', JSON.stringify(updated));
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTitle(journals[index].title);
    setEditContent(journals[index].content);
  };

  return (
    <div className="journals-page">
      <h2>📓 Your Journals</h2>
      <div className="journal-grid">
        {/* New Journal Card */}
        <div className="journal-card new-journal" onClick={onNew}>
          <div className="new-icon">➕</div>
          <p>New Journal</p>
        </div>

        {/* Existing Journals */}
        {[...journals].reverse().map((j, idxReversed) => {
          const idx = journals.length - 1 - idxReversed;
          return (
            <div className="journal-card" key={idx}>
              {editingIndex === idx ? (
                <>
                  <input
                    className="journal-title-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="journal-edit-area"
                    rows="4"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => saveEdit(idx)}>✅ Save</button>
                    <button onClick={() => setEditingIndex(null)} style={{ marginLeft: '10px' }}>❌ Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>{j.title}</h4>
                    <button className="edit-btn" onClick={() => handleEdit(idx)}>✏️ Edit</button>
                  </div>
                  <p className="journal-snippet">
                    {j.content.slice(0, 100)}{j.content.length > 100 ? '...' : ''}
                  </p>
                  <span className="timestamp">{j.time}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JournalsPage;
