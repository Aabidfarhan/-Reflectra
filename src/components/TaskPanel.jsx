import React, { useState, useEffect } from 'react';
import '../styles/TaskPanel.css';

const defaultTasks = {
  guided_journaling: [
    { title: 'Write Your Feelings', time: 'Daily at 9:00am' },
    { title: 'Reflect on Wins', time: 'Every Evening' },
  ],
  distortion_detection: [
    { title: 'Identify Cognitive Distortions', time: 'Every Monday' },
  ],
  thought_deframing: [
    { title: 'Challenge Negative Thoughts', time: 'Weekly Review' },
  ],
  affirmation_separator: [
    { title: 'Separate Fact from Feeling', time: 'Every Saturday' },
  ],
};

const TaskPanel = ({ mode, onClose, onTaskClick }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', time: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTasks(defaultTasks[mode] || []);
  }, [mode]);

  const handleAddTask = () => {
    if (newTask.title && newTask.time) {
      setTasks((prev) => [...prev, newTask]);
      setNewTask({ title: '', time: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="task-panel-overlay">
      <div className="task-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="task-title">Tasks for {mode.replace(/_/g, ' ')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'hotpink', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
        </div>

        <button className="add-task-btn" onClick={() => setShowForm(!showForm)}>
          + Add Task
        </button>

        {showForm && (
          <div className="task-form">
            <input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="time"
              value={newTask.time}
              onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
            />

            <button onClick={handleAddTask}>Save</button>
          </div>
        )}

        <div className="task-cards">
          {tasks.map((task, idx) => (
            <div
              className="task-card"
              key={idx}
              onClick={() => onTaskClick(task)}
              style={{ cursor: 'pointer' }}
            >
              <h4>{task.title}</h4>
              <p>{task.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPanel;
