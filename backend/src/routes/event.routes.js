const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');
const { validateCreateEvent, validateEventId } = require('../middlewares/validation.middleware');

router.post('/', authenticate, validateCreateEvent, eventController.createEvent);
router.get('/', eventController.getEvents);
router.post('/:id/register', authenticate, validateEventId, eventController.registerForEvent);

router.put('/:id', authenticate, validateEventId, validateCreateEvent, eventController.updateEvent);

router.delete('/:id', authenticate, validateEventId, eventController.deleteEvent);

// Cleanup routes for automatic deletion of past events
router.post('/cleanup/mark-past', eventController.markPastEventsForDeletion);
router.post('/cleanup/delete-marked', eventController.cleanupMarkedEvents);

module.exports = router;
