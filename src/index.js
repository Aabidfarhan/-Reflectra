import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'; // ✅ Fix path

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
