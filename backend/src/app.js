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

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
  }
}

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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://alumni-connect-frontendd.vercel.app',
  'https://alumni-connect-frontend.vercel.app'
];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  try {
    let token = null
    
    if (socket.handshake.auth?.token) {
      token = socket.handshake.auth.token
    } 
    else if (socket.handshake.headers.cookie) {
      const tokenMatch = socket.handshake.headers.cookie.match(/(?:^|; )token=([^;]+)/)
      const authMatch = socket.handshake.headers.cookie.match(/(?:^|; )authToken=([^;]+)/)
      const jwtMatch = socket.handshake.headers.cookie.match(/(?:^|; )jwt=([^;]+)/)
      token = tokenMatch?.[1] || authMatch?.[1] || jwtMatch?.[1] || null
    }
    
    if (!token) {
      return next(new Error('No auth token in auth or cookies'))
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id
    socket.role = decoded.role || 'student'
    next()
  } catch (error) {
    logger.warn('Socket auth failed', { error: error.message })
    next(new Error('Invalid token'))
  }
})

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
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/docs', docsRoutes);
apiRouter.use('/users', apiLimiter, userRoutes);
apiRouter.use('/events', apiLimiter, eventRoutes);
apiRouter.use('/gallery', apiLimiter, galleryRoutes);
apiRouter.use('/jobs', apiLimiter, jobRoutes);
apiRouter.use('/chat', apiLimiter, chatRoutes);


app.use('/api', apiRouter);

app.get('/api/debug/status', asyncHandler(async (req, res) => {
  const state = mongoose.connection.readyState;
  const Message = require('./models/message.model');
  const [totalUsers, alumni, students, admins, events, gallery, jobs, messages] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'alumni' }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'admin' }),
    Event.countDocuments(),
    Gallery.countDocuments(),
    Job.countDocuments(),
    Message.countDocuments()
  ]);
  res.json({ 
    state, 
    counts: { 
      totalUsers, 
      alumni, 
      students, 
      admins, 
      events, 
      gallery, 
      jobs, 
      messages 
    }
  });
}));

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
});

module.exports = server;

