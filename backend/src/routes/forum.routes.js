const express = require('express');
const router = express.Router();

const forumController = require('../controllers/forum.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', forumController.getThreads);
router.get('/:threadId', forumController.getThreadById);
router.post('/', verifyToken, forumController.createThread);
router.post('/:threadId/comments', verifyToken, forumController.addComment);

module.exports = router;
