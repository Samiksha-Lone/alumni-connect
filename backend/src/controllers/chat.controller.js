const mongoose = require('mongoose');

const Message = require('../models/message.model');
const User = require('../models/user.model');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const chatId = [req.user.id, receiverId].sort().join('_');
    
    const message = new Message({
      chatId,
      senderId: req.user.id,
      receiverId,
      content: content.trim()
    });
    
    await message.save();
    
    await message.populate('senderId', 'name email role avatar');
    
    const io = req.app.get('io');
    io.to(receiverId).emit('newMessage', message);
    
    await User.findByIdAndUpdate(req.user.id, { isOnline: true, lastSeen: new Date() });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const chatId = [req.user.id, userId].sort().join('_');

    const messages = await Message.find({ chatId })
      .populate('senderId', 'name email role avatar')
      .sort({ createdAt: -1, timestamp: -1 })
      .limit(parseInt(limit, 10) || 50)
      .skip(((parseInt(page, 10) || 1) - 1) * (parseInt(limit, 10) || 50))
      .lean();

    await Message.updateMany(
      { chatId, receiverId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(req.user._id) },
            { receiverId: new mongoose.Types.ObjectId(req.user._id) }
          ]
        }
      },
      {
        $group: {
          _id: '$chatId',
          partnerId: {
            $first: {
              $cond: [
                { $eq: ['$senderId', new mongoose.Types.ObjectId(req.user._id)] },
                '$receiverId',
                '$senderId'
              ]
            }
          },
          lastMessage: { $last: '$content' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(req.user._id)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'partnerId',
          foreignField: '_id',
          as: 'partner'
        }
      },
      { $unwind: { path: '$partner', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          partnerId: { $toString: '$partnerId' },
          partnerName: '$partner.name',
          partnerRole: '$partner.role',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatUsers = async (req, res) => {
  try {
    const { role = 'alumni', search = '', page = 1, limit = 20 } = req.query;
    
    const query = {
      _id: { $ne: req.user.id },
      role: { $in: role === 'all' ? ['student', 'alumni'] : [role] }
    };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('name email role avatar isOnline lastSeen')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ isOnline: -1, name: 1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatId = [req.user.id, userId].sort().join('_');
    
    const result = await Message.updateMany(
      { chatId, receiverId: req.user.id, isRead: false },
      { isRead: true }
    );
    
    res.json({ updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatId = [req.user.id, userId].sort().join('_');
    
    await Message.updateMany(
      { chatId },
      { $set: { deletedBy: req.user.id } }
    );
    
    res.json({ message: 'Conversation archived successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { query, userId } = req.query;
    const chatId = [req.user.id, userId].sort().join('_');
    
    const messages = await Message.find({
      chatId,
      content: { $regex: query, $options: 'i' }
    })
      .populate('senderId', 'name role')
      .limit(50)
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversationStats = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(100);

    const conversations = {};
    
    messages.forEach(msg => {
      const chatId = [msg.senderId.toString(), msg.receiverId.toString()].sort().join('_');
      const partnerId = msg.senderId.toString() === req.user._id.toString() ? msg.receiverId : msg.senderId;
      
      if (!conversations[chatId]) {
        conversations[chatId] = {
          partnerId: partnerId.toString(),
          partnerName: 'User',
          partnerRole: 'user', 
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.receiverId.toString() === req.user._id.toString() && !msg.isRead ? 1 : 0
        };
      } else {
        conversations[chatId].lastMessage = msg.content;
        conversations[chatId].lastMessageTime = msg.createdAt;
      }
    });

    const conversationList = Object.values(conversations);
    res.json(conversationList.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)));
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

