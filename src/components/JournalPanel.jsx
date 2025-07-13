import React, { useState, useEffect, useRef } from 'react';
import '../styles/JournalPanel.css';

const JournalPanel = ({ task, onClose }) => {
  const panelRef = useRef(null);
  const hasSavedRef = useRef(false);

  const [journals, setJournals] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [isNewJournal, setIsNewJournal] = useState(true);

  // Load saved journals and drafts
  useEffect(() => {
    const storedJournals = localStorage.getItem('journals');
    const storedDrafts = localStorage.getItem('journalDrafts');
    if (storedJournals) setJournals(JSON.parse(storedJournals));
    if (storedDrafts) setDrafts(JSON.parse(storedDrafts));
  }, []);

  // Set journal title from task
  useEffect(() => {
    if (task?.title) {
      setTitle(task.title);
      setContent('');
      setIsNewJournal(true);
      setEditIndex(null);
    }
  }, [task]);

  // Warn user before closing tab if unsaved content
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content]);

  const saveJournal = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle && !trimmedContent) return;

    const newJournal = {
      title: trimmedTitle || 'Untitled',
      content: trimmedContent,
      time: new Date().toLocaleString(),
    };

    const updated = [...journals, newJournal];
    setJournals(updated);
    localStorage.setItem('journals', JSON.stringify(updated));

    setTitle('');
    setContent('');
    setIsNewJournal(true);
    setEditIndex(null);
    hasSavedRef.current = true;
  };

  const saveDraft = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle && !trimmedContent) return;

    const newDraft = {
      title: trimmedTitle || 'Untitled Draft',
      content: trimmedContent,
      time: new Date().toLocaleString(),
    };

    const updatedDrafts = [...drafts.filter(d => d.title !== newDraft.title), newDraft];
    setDrafts(updatedDrafts);
    localStorage.setItem('journalDrafts', JSON.stringify(updatedDrafts));
  };

  const handleEdit = (index, field, value) => {
    const updated = [...journals];
    updated[index][field] = value;
    setJournals(updated);
    localStorage.setItem('journals', JSON.stringify(updated));
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('🗑️ Are you sure you want to delete this journal?');
    if (!confirmDelete) return;

    const updated = journals.filter((_, i) => i !== index);
    setJournals(updated);
    localStorage.setItem('journals', JSON.stringify(updated));
    if (editIndex === index) setEditIndex(null);
  };

  return (
    <div className="journal-panel-overlay">
      <div className="journal-panel" ref={panelRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>📝 New Journal</h3>
          <button
            onClick={() => {
              const confirm = window.confirm("Do you want to save your changes before closing?");
              if (confirm) saveJournal();
              else saveDraft();
              onClose();
            }}
            style={{
              background: 'transparent',
              color: 'hotpink',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✖
          </button>
        </div>

        <input
          placeholder="Journal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="journal-title-input"
        />

        <textarea
          rows="6"
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <button
            onClick={saveJournal}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            💾 Save
          </button>
        </div>

        <hr style={{ margin: '20px 0', opacity: 0.3 }} />
        <h4>🕓 Previous Journals</h4>

        <div className="journal-history">
          {journals.length === 0 && <p>No journals yet.</p>}
          {[...journals].reverse().map((j, idx) => {
            const realIndex = journals.length - 1 - idx;
            return (
              <div
                key={realIndex}
                className="journal-entry"
                style={{ position: 'relative', paddingRight: '80px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.hover-buttons').style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.hover-buttons').style.opacity = 0;
                }}
              >
                {editIndex === realIndex ? (
                  <>
                    <input
                      className="journal-title-input"
                      value={j.title}
                      onChange={(e) => handleEdit(realIndex, 'title', e.target.value)}
                    />
                    <textarea
                      className="journal-edit-area"
                      value={j.content}
                      onChange={(e) => handleEdit(realIndex, 'content', e.target.value)}
                    />
                    <button onClick={() => setEditIndex(null)}>✅ Done</button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{j.title}</strong>
                      <div className="hover-buttons" style={{ opacity: 0, transition: 'opacity 0.3s' }}>
                        <button className="edit-btn" onClick={() => {
                          setEditIndex(realIndex);
                          setIsNewJournal(false);
                        }}>✏️ Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(realIndex)}>🗑️ Delete</button>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'gray' }}>{j.time}</span>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{j.content}</p>
                  </>
                )}
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JournalPanel;
