const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/events', async (req, res) => {
  const { title, start, end } = req.body;
  try {
    const newEvent = new Event({ title, start, end });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/events/:id', async (req, res) => {
  const eventId = req.params.id;
  const { title, start, end } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, start, end },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
