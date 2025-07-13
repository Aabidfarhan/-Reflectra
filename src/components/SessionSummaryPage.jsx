import React from 'react';
import '../styles/SessionSummaryPage.css';

const dummySession = {
  date: '2025-07-12',
  time: '4:00 PM',
  therapist: 'Dr. Maya Sharma',
  notes: `Today we talked about setting emotional boundaries and recognizing negative self-talk. 
We practiced cognitive reframing and agreed to continue journaling exercises.

Homework: Write down 3 thought distortions this week.`,
};

const SessionSummaryPage = () => {
  return (
    <div className="session-summary-page">
      <h2>🧾 Session Summary</h2>
      <div className="summary-card">
        <p><strong>Date:</strong> {dummySession.date}</p>
        <p><strong>Time:</strong> {dummySession.time}</p>
        <p><strong>Therapist:</strong> {dummySession.therapist}</p>
        <p><strong>Notes:</strong></p>
        <p className="notes">{dummySession.notes}</p>
      </div>
    </div>
  );
};

export default SessionSummaryPage;
