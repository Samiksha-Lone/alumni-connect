const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/', authenticate, eventController.createEvent);
router.get('/', eventController.getEvents);

router.put('/:id', authenticate, eventController.updateEvent);

router.delete('/:id', authenticate, eventController.deleteEvent);

// Cleanup routes for automatic deletion of past events
router.post('/cleanup/mark-past', eventController.markPastEventsForDeletion);
router.post('/cleanup/delete-marked', eventController.cleanupMarkedEvents);

module.exports = router;
