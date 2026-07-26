const eventModel = require('../models/event.model');
const { parsePagination, buildPaginationResponse } = require('../utils/pagination');

async function createEvent(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin has this privilege" });
    }

    const { title, description, eventDate, location, eventTime, category } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({ error: "Title and event date are required" });
    }

    const normalizeDate = (value) => {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value !== 'string') {
        return new Date(value);
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(value);
      }
      const dmy = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(value);
      if (dmy) {
        return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}`);
      }
      return new Date(value);
    };

    const parsedDate = normalizeDate(eventDate);
    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid event date format' });
    }

    const event = await eventModel.create({
      title,
      description: description || '',
      eventDate: parsedDate,
      location: location || 'Seminar Hall, MGM Campus',
      eventTime: eventTime || '10:30 AM · 2 hours',
      category: category || 'Alumni Event',
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
    const { page, limit } = parsePagination(req.query, { page: 1, limit: 12 });
    const { search, category, location, createdBy } = req.query;
    const query = { markedForDeletion: false };

    if (search) {
      const esc = String(search).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
      const regex = new RegExp(esc, 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { location: regex }
      ];
    }

    if (category) {
      const esc = String(category).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
      query.category = { $regex: esc, $options: 'i' };
    }

    if (location) {
      const esc = String(location).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
      query.location = { $regex: esc, $options: 'i' };
    }

    if (createdBy) {
      if (createdBy === 'me') {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        query.createdBy = req.user._id;
      } else {
        query.createdBy = createdBy;
      }
    }

    // Filter events the user registered for
    if (req.query.registeredBy) {
      const registeredBy = req.query.registeredBy;
      if (registeredBy === 'me') {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        query.attendees = { $in: [req.user._id] };
      } else {
        query.attendees = { $in: [registeredBy] };
      }
    }

    const [events, total] = await Promise.all([
      eventModel.find(query)
        .sort({ eventDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      eventModel.countDocuments(query)
    ]);

    res.status(200).json(buildPaginationResponse(events, page, limit, total));
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
    const { title, description, eventDate, location, eventTime, category } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (location !== undefined) event.location = location;
    if (eventTime !== undefined) event.eventTime = eventTime;
    if (category !== undefined) event.category = category;

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

async function registerForEvent(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const eventId = req.params.id;
    const User = require('../models/user.model');
    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Add user to attendees if not already present
    const userId = req.user._id;
    event.attendees = event.attendees || [];
    if (event.attendees.some(a => String(a) === String(userId))) {
      return res.json({ message: 'Already registered' });
    }
    event.attendees.push(userId);
    await event.save();

    // Add event to user's registeredEvents
    const user = await User.findById(userId);
    if (user) {
      user.registeredEvents = user.registeredEvents || [];
      if (!user.registeredEvents.some(e => String(e) === String(eventId))) {
        user.registeredEvents.push(eventId);
        await user.save();
      }
    }

    return res.json({ message: 'Registered for event' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error registering for event' });
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
  registerForEvent,
  markPastEventsForDeletion,
  cleanupMarkedEvents
};

