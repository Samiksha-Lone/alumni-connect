const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const verifyToken = require('../middlewares/auth.middleware');

// 🔥 TEMP PUBLIC ROUTE - NO AUTH
router.get('/test', (req, res) => {
  res.json({ message: 'Chat routes working!', timestamp: new Date() });
});

// CORE CHAT FUNCTIONALITY
router.post('/message', verifyToken, chatController.sendMessage);
router.get('/messages/:userId', verifyToken, chatController.getMessages);
router.get('/conversations', verifyToken, chatController.getConversations);

// 🟡 USER DISCOVERY (Find alumni/students to chat)
router.get('/users', verifyToken, chatController.getChatUsers);

// 🔵 CONVERSATION MANAGEMENT
router.put('/read/:userId', verifyToken, chatController.markAsRead);
router.delete('/conversation/:userId', verifyToken, chatController.deleteConversation);

// 🟠 SEARCH & STATS
router.get('/search', verifyToken, chatController.searchMessages);
// router.get('/stats', verifyToken, chatController.getMessageStats);

module.exports = router;