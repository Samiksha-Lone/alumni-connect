//create server
const express = require('express');
const cookierParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler, asyncHandler } = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Socket.io setup FIRST
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || process.env.ALLOWED_ORIGINS?.split(',')[0] || "https://alumni-connect-frontend-delta.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket JWT Auth (for your cookie-based JWT)
io.use((socket, next) => {
  try {
    // Extract token from cookies or auth header
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];
    
    if (!token) return next(new Error('No token provided'));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.role = decoded.role || 'student';
    next();
  } catch (error) {
    logger.warn('Socket authentication failed', { error: error.message });
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  logger.info(`User ${socket.userId} connected via Socket.IO`);
  socket.join(socket.userId); // Personal room
  
  socket.on('joinChat', (chatId) => socket.join(chatId));
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('typing', { 
      userId: socket.userId, 
      isTyping: data.isTyping 
    });
  });
  
  socket.on('disconnect', () => {
    logger.info(`User ${socket.userId} disconnected from Socket.IO`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    logger.error('Socket error', { userId: socket.userId, error: error.message });
  });
});

// Pass io to app (for routes)
app.set('io', io);

// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookierParser());

// CORS configuration with environment variables
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://alumni-connect-frontend-delta.vercel.app/').split(',');
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.some(o => origin.includes(o.trim()))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    userId: req.user?.id,
    ip: req.ip,
  });
  next();
});

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const galleryRoutes = require('./routes/gallery.routes');  
const jobRoutes = require('./routes/job.routes'); 
const chatRoutes = require('./routes/chat.routes');
const docsRoutes = require('./routes/docs.routes');

const Event = require('./models/event.model');
const User = require('./models/user.model');
const Gallery = require('./models/gallery.model');
const Job = require('./models/job.model');

require('./models/index');

// API Routes with rate limiting
app.get('/', (req, res) => {
    res.json({ message: 'Alumni Connect API - Server running' });
});

// Auth routes with stricter rate limiting
app.use('/auth/login', loginLimiter);
app.use('/auth/register', loginLimiter);
app.use('/auth', authRoutes);

// API docs (Swagger)
app.use('/docs', docsRoutes);
 
// Other routes with standard rate limiting
app.use('/users', apiLimiter, userRoutes);
app.use('/api', apiLimiter, eventRoutes);
app.use('/api', apiLimiter, galleryRoutes);
app.use('/api', apiLimiter, jobRoutes);
app.use('/api/chat', apiLimiter, chatRoutes);

app.get('/debug/status', asyncHandler(async (req, res) => {
  const state = mongoose.connection.readyState;
  const Message = require('./models/message.model');
  const [users, events, gallery, jobs, messages] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Gallery.countDocuments(),
    Job.countDocuments(),
    Message.countDocuments()
  ]);
  res.json({ 
    state, 
    counts: { users, events, gallery, jobs, messages }
  });
}));

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = server;
