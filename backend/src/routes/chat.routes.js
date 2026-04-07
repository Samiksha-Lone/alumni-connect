const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const verifyToken = require('../middlewares/auth.middleware');
const upload = require('../utils/attachmentUpload');

router.get('/test', (req, res) => {
  res.json({ message: 'Chat routes working!', timestamp: new Date() });
});

router.post('/message', verifyToken, chatController.sendMessage);
router.post('/upload', verifyToken, upload.single('file'), chatController.uploadFile);
router.get('/messages/:userId', verifyToken, chatController.getMessages);
router.get('/conversations', verifyToken, chatController.getConversations);

router.get('/users', verifyToken, chatController.getChatUsers);

router.put('/read/:userId', verifyToken, chatController.markAsRead);
router.delete('/conversation/:userId', verifyToken, chatController.deleteConversation);

router.get('/search', verifyToken, chatController.searchMessages);

module.exports = router;