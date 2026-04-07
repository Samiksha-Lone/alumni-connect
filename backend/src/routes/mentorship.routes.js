const express = require('express');
const router = express.Router();

const mentorshipController = require('../controllers/mentorship.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/mentors', verifyToken, mentorshipController.searchMentors);
router.get('/matches', verifyToken, mentorshipController.getMatches);
router.post('/requests', verifyToken, mentorshipController.createRequest);
router.get('/requests', verifyToken, mentorshipController.getRequests);
router.patch('/requests/:requestId/respond', verifyToken, mentorshipController.respondRequest);

module.exports = router;
