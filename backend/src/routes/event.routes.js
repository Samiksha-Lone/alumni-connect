const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/events', authenticate, eventController.createEvent);
// allow public GET of events (no authentication required)
router.get('/events', eventController.getEvents);

// Update event (admin only)
router.put('/events/:id', authenticate, eventController.updateEvent);

// Delete event (admin only)
router.delete('/events/:id', authenticate, eventController.deleteEvent);

module.exports = router;
