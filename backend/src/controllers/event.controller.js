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
    // Get only events not marked for deletion and sort by date
    const events = await eventModel.find({ markedForDeletion: false }).sort({ eventDate: 1 });
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

// Mark past events for deletion (1-2 days after event date)
async function markPastEventsForDeletion(req, res) {
  try {
    const now = new Date();
    
    // Mark events that ended 1-2 days ago for deletion
    const deletionThreshold = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    
    const markedEvents = await eventModel.updateMany(
      {
        eventDate: { $lt: deletionThreshold },
        markedForDeletion: false
      },
      {
        markedForDeletion: true,
        deletionScheduledAt: now
      }
    );

    return res.status(200).json({
      message: 'Past events marked for deletion',
      modifiedCount: markedEvents.modifiedCount
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error marking past events" });
  }
}

// Permanently delete events marked for deletion
async function cleanupMarkedEvents(req, res) {
  try {
    const deletedEvents = await eventModel.deleteMany({ markedForDeletion: true });

    return res.status(200).json({
      message: 'Marked events cleaned up successfully',
      deletedCount: deletedEvents.deletedCount
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error cleaning up events" });
  }
}

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  markPastEventsForDeletion,
  cleanupMarkedEvents
};

