const express = require('express');
const router = express.Router();
const { generateIcebreaker, generateChatbotResponse } = require('../controllers/ai.controller');

router.post('/icebreaker', generateIcebreaker);
router.post('/chatbot', generateChatbotResponse);

module.exports = router;
