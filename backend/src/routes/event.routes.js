const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/', authenticate, eventController.createEvent);
router.get('/', eventController.getEvents);

router.put('/:id', authenticate, eventController.updateEvent);

router.delete('/:id', authenticate, eventController.deleteEvent);

router.post('/:id/rsvp', authenticate, eventController.rsvpEvent);

module.exports = router;
