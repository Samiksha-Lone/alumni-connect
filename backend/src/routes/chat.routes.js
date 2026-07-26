const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../utils/attachmentUpload');
const { validateSendMessage, validateMessageParams, validateUserId } = require('../middlewares/validation.middleware');

router.get('/test', (req, res) => {
  res.json({ message: 'Chat routes working!', timestamp: new Date() });
});

router.post('/message', verifyToken, validateSendMessage, chatController.sendMessage);
router.post('/upload', verifyToken, upload.single('file'), chatController.uploadFile);
router.get('/messages/:userId', verifyToken, validateMessageParams, chatController.getMessages);
router.get('/conversations', verifyToken, chatController.getConversations);

router.get('/users', verifyToken, chatController.getChatUsers);

router.get('/mentorship-status/:mentorId', verifyToken, chatController.checkMentorshipStatus);

router.get('/mentorship/requests', verifyToken, chatController.getMentorshipRequests);

router.put('/read/:userId', verifyToken, validateUserId, chatController.markAsRead);
router.delete('/conversation/:userId', verifyToken, validateUserId, chatController.deleteConversation);

router.get('/search', verifyToken, chatController.searchMessages);

module.exports = router;