const express = require('express');
const router = express.Router();
const { generateIcebreaker } = require('../controllers/ai.controller');

router.post('/icebreaker', generateIcebreaker);

module.exports = router;
