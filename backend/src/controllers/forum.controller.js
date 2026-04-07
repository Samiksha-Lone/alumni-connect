const ForumThread = require('../models/forum.model');
const { moderateText } = require('../services/moderation.service');

async function createThread(req, res) {
  try {
    const { title, content, category, tags = [] } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const titleModeration = moderateText(title);
    const contentModeration = moderateText(content);
    if (titleModeration.blocked || contentModeration.blocked) {
      return res.status(400).json({ message: 'Content contains prohibited words' });
    }

    const thread = await ForumThread.create({
      title: titleModeration.sanitized,
      content: contentModeration.sanitized,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      authorId: req.user._id,
      authorName: req.user.name,
    });

    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create thread', error: error.message });
  }
}

async function getThreads(req, res) {
  try {
    const { q, category } = req.query;
    const query = {};

    if (category) query.category = category;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    const threads = await ForumThread.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-comments');

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load discussion threads', error: error.message });
  }
}

async function getThreadById(req, res) {
  try {
    const { threadId } = req.params;
    const thread = await ForumThread.findById(threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    thread.views += 1;
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load thread', error: error.message });
  }
}

async function addComment(req, res) {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const commentModeration = moderateText(content);
    if (commentModeration.blocked) {
      return res.status(400).json({ message: 'Comment contains prohibited words' });
    }

    const thread = await ForumThread.findById(threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    thread.comments.push({
      authorId: req.user._id,
      authorName: req.user.name,
      content: commentModeration.sanitized,
    });

    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
}

module.exports = {
  createThread,
  getThreads,
  getThreadById,
  addComment,
};
