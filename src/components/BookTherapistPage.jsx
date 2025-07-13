import React, { useState } from 'react';
import '../styles/BookTherapistPage.css';

const BookTherapistPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Therapist booked for ${form.name} on ${form.date} at ${form.time}`);
    setForm({ name: '', email: '', date: '', time: '', notes: '' });
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
        <button type="submit">Book Session</button>
      </form>
    </div>
  );
};

export default BookTherapistPage;
