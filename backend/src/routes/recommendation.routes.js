const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendation.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/for/:userId', verifyToken, recommendationController.getRecommendations);
router.get('/top-matches', recommendationController.getTopMatches);

module.exports = router;
