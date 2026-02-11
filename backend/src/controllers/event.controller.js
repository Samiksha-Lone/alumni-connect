const eventModel = require('../models/event.model');

async function createEvent(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin has this privilege" });
    }

    const { title, description, eventDate } = req.body;

    if (!title || !description || !eventDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = await eventModel.create({
      title,
      description,
      eventDate,
      createdBy: req.user._id
    });

    return res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error creating event" });
  }
}

async function getEvents(req, res) {
  try {
    const events = await eventModel.find().sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

async function updateEvent(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can update events" });
    }

    const eventId = req.params.id;
    const { title, description, eventDate } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;

    const updatedEvent = await event.save();

    return res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error updating event" });
  }
}

async function deleteEvent(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete events" });
    }

    const eventId = req.params.id;
    const event = await eventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventModel.findByIdAndDelete(eventId);

    return res.status(200).json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error deleting event" });
  }
}

async function rsvpEvent(req, res) {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.rsvps && event.rsvps.includes(userId)) {
      return res.status(400).json({ error: "Already RSVP'd for this event" });
    }

    if (!event.rsvps) event.rsvps = [];

    event.rsvps.push(userId);
    await event.save();

    return res.status(200).json({
      message: 'RSVP confirmed successfully',
      rsvps: event.rsvps.length
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error with RSVP" });
  }
}

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  rsvpEvent  
};

