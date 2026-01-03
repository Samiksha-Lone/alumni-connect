const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/events', authenticate, eventController.createEvent);
router.get('/events', eventController.getEvents);

router.put('/events/:id', authenticate, eventController.updateEvent);

router.delete('/events/:id', authenticate, eventController.deleteEvent);

module.exports = router;
