import React, { useState, useEffect } from 'react';
import '../styles/TaskPanel.css';

const defaultTasks = {
  guided_journaling: [
    { title: 'Write Your Feelings', time: '09:00' },
    { title: 'Reflect on Wins', time: '20:00' },
  ],
  distortion_detection: [
    { title: 'Identify Cognitive Distortions', time: '08:00' },
  ],
  thought_deframing: [
    { title: 'Challenge Negative Thoughts', time: '10:00' },
  ],
  affirmation_separator: [
    { title: 'Separate Fact from Feeling', time: '11:00' },
  ],
};

const TaskPanel = ({ mode, onClose, onTaskClick }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', time: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const storageKey = `tasks_${mode}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(defaultTasks[mode] || []);
    }
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.time) return;

    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = newTask;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks((prev) => [...prev, newTask]);
    }

    setNewTask({ title: '', time: '' });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setNewTask(tasks[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="task-panel-overlay">
      <div className="task-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="task-title">Tasks for {mode.replace(/_/g, ' ')}</h2>
          <button
            onClick={onClose}
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

        <button className="add-task-btn" onClick={() => {
          setShowForm(!showForm);
          setNewTask({ title: '', time: '' });
          setEditingIndex(null);
        }}>
          {editingIndex !== null ? '✎ Edit Task' : '+ Add Task'}
        </button>

        {showForm && (
          <div className="task-form">
            <input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <input
              type="time"
              value={newTask.time}
              onChange={(e) =>
                setNewTask({ ...newTask, time: e.target.value })
              }
            />
            <button onClick={handleAddTask}>
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
          </div>
        )}

        <div className="task-cards">
          {tasks.map((task, idx) => (
            <div className="task-card" key={idx}>
              <div onClick={() => onTaskClick(task)} style={{ cursor: 'pointer' }}>
                <h4>{task.title}</h4>
                <p>{task.time}</p>
              </div>
              <div className="task-actions">
                <button onClick={() => handleEdit(idx)}>Edit</button>
                <button onClick={() => handleDelete(idx)} style={{ color: 'red' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPanel;
