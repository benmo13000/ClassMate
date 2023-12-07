import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);



  const handleEventSelect = (event) => {
    setShowForm(true);
    setSelectedEvent(event);
    setNewEvent(event);
  };

  const handleSlotSelect = ({ start, end }) => {
    setShowForm(true);
    setSelectedEvent(null);
    setNewEvent({ title: '', start, end });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch(`/api/events/${selectedEvent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });
        const updatedEvent = await response.json();
        const formattedEvent = {
          ...updatedEvent,
          start: new Date(updatedEvent.start),
          end: new Date(updatedEvent.end),

        }
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event._id === formattedEvent._id ? formattedEvent : event))

        );
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else {
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });
        const createdEvent = await response.json();
        const formattedEvent = {
          ...createdEvent,
          start: new Date(createdEvent.start),
          end: new Date(createdEvent.end),

        }
        setEvents((prevEvents) => [...prevEvents, formattedEvent]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }

    setShowForm(false);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch(`/api/events/${selectedEvent._id}`, {
          method: 'DELETE',
        });
        const deletedEvent = await response.json();
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== deletedEvent._id));
        setShowForm(false);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
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
          <h3>{selectedEvent ? 'Edit Event' : 'Create Event'}</h3>
          <label>Title:</label>
          <input type="text" name="title" value={newEvent.title} onChange={handleFormChange} />
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
          <button onClick={handleFormSubmit}>
            {selectedEvent ? 'Update Event' : 'Create Event'}
          </button>
          {selectedEvent && (
            <button onClick={handleDeleteEvent} style={{ marginLeft: '10px', color: 'red' }}>
              Delete Event
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
