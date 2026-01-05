const express = require('express');
const cookieParser = require('cookie-parser');
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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

var allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://alumni-connect-frontend-delta.vercel.app')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ""));

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  try {
    let token = socket.handshake.auth.token;
    if (!token && socket.handshake.headers.cookie) {
      const match = socket.handshake.headers.cookie.match(/(?:^|; )token=([^;]*)/);
      token = match ? match[1] : null;
    }
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
  socket.join(socket.userId);
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
  socket.on('error', (error) => {
    logger.error('Socket error', { userId: socket.userId, error: error.message });
  });
});

app.set('io', io);

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

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

app.get('/', (req, res) => {
  res.json({ message: 'Alumni Connect API - Server running' });
});

app.use('/auth/', loginLimiter);
app.use('/auth', authRoutes);

app.use('/docs', docsRoutes);

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

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});

module.exports = server;
