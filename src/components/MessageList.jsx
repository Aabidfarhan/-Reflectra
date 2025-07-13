import React from 'react';

const MessageList = ({ messages = [], chatBoxRef, typing }) => (
  <div className="chat-box" ref={chatBoxRef}>
    {messages.map((msg, idx) => (
      <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
    ))}
    {typing && <div className="message ai">💬 Typing...</div>}
  </div>
);

export default MessageList;
