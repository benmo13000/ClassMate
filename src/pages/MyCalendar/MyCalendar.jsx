import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleEventSelect = (event) => {
    console.log('Event selected:', event);
  };

  const handleSlotSelect = ({ start, end }) => {
    setShowForm(true);
    setNewEvent({ title: '', start, end });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleFormSubmit = () => {
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => setEvents((prevEvents) => [...prevEvents, data]))
      .catch((error) => console.error('Error creating event:', error));

    setShowForm(false);
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventSelect}
        selectable
        onSelectSlot={handleSlotSelect}
      />
      {showForm && (
        <div>
          <h3>Create Event</h3>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleFormChange}
          />
          <br />
          <label>Start Time:</label>
          <input
            type="datetime-local"
            name="start"
            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
            onChange={handleFormChange}
          />
          <br />
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="end"
            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
            onChange={handleFormChange}
          />
          <br />
          <button onClick={handleFormSubmit}>Create Event</button>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
