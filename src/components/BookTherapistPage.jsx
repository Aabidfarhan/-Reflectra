import React, { useState, useEffect } from 'react';
import '../styles/BookTherapistPage.css';

const BookTherapistPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(savedAppointments);

    const savedDraft = JSON.parse(localStorage.getItem('draft'));
    if (savedDraft) setForm(savedDraft);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedAppointments = [...appointments, form];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    alert(`Therapist booked for ${form.name} on ${form.date} at ${form.time}`);
    setForm({ name: '', email: '', date: '', time: '', notes: '' });
    localStorage.removeItem('draft');
    setDraft(null);
  };

  const saveDraft = () => {
    localStorage.setItem('draft', JSON.stringify(form));
    alert('Draft saved!');
    setDraft(form);
  };

  const deleteDraft = () => {
    localStorage.removeItem('draft');
    setDraft(null);
    setForm({ name: '', email: '', date: '', time: '', notes: '' });
    alert('Draft deleted!');
  };

  return (
    <div className="book-therapist-page">
      <h2>📅 Book a Therapist Session</h2>
      <form onSubmit={handleSubmit} className="therapist-form">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="time" name="time" value={form.time} onChange={handleChange} required />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional Notes (Optional)" />

        <div className="button-group">
          <button type="submit">Book Session</button>
          <button type="button" onClick={saveDraft}>💾 Save Draft</button>
          {draft && <button type="button" onClick={deleteDraft} style={{ backgroundColor: '#ff5b5b' }}>🗑 Delete Draft</button>}
        </div>
      </form>

      <div className="appointments-list">
        <h3>📋 All Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <ul>
            {appointments.map((appt, index) => (
              <li key={index}>
                <strong>{appt.name}</strong> — {appt.date} at {appt.time}<br />
                <small>{appt.email}</small><br />
                <em>{appt.notes}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookTherapistPage;
