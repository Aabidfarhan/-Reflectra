import React, { useState } from 'react';
import '../styles/Sidebar.css'; // Keep your CSS import

const Sidebar = ({ onSelect, selected }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => setCollapsed(!collapsed);

  const menuItems = [
    { key: 'chat', label: 'Chat', icon: '💬' },
    { key: 'tasks', label: 'Tasks', icon: '🗂️' },
    { key: 'journals', label: 'Journals', icon: '📓' },
    { key: 'newJournal', label: 'New Journal', icon: '➕' },
    { key: 'bookTherapist', label: 'Book Therapist', icon: '📅' },
    { key: 'sessionSummary', label: 'Session Summary', icon: '🧾' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        title={collapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        {collapsed ? '☰' : '✖'}
      </button>

      {/* Logo section */}
      <div className="logo-container" title="Aura">
        <img src="/LOGO.png" alt="AURA Logo" className="logo" />
        {!collapsed && <h1 className="app-title">AURA</h1>}
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={selected === item.key ? 'active' : ''}
            onClick={() => onSelect(item.key)}
            title={item.label}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="label">{item.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
