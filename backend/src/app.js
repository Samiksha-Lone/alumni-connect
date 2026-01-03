//create server
const express = require('express');
const cookierParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);

// Socket.io setup FIRST
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",  // Vite port
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
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  socket.join(socket.userId); // Personal room
  
  socket.on('joinChat', (chatId) => socket.join(chatId));
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('typing', { 
      userId: socket.userId, 
      isTyping: data.isTyping 
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Pass io to app (for routes)
app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookierParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const galleryRoutes = require('./routes/gallery.routes');  
const jobRoutes = require('./routes/job.routes'); 
const chatRoutes = require('./routes/chat.routes');

const Event = require('./models/event.model');
const User = require('./models/user.model');
const Gallery = require('./models/gallery.model');
const Job = require('./models/job.model');

require('./models/index');

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', galleryRoutes);
app.use('/api', jobRoutes);
app.use('/api/chat', chatRoutes);

app.get('/debug/status', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const Message = require('./models/message.model'); // ADD THIS LINE
    const [users, events, gallery, jobs, messages] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Gallery.countDocuments(),
      Job.countDocuments(),
      Message.countDocuments() // ADD THIS LINE
    ]);
    res.json({ 
      state, 
      counts: { users, events, gallery, jobs, messages } // ADD messages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// module.exports = app;

module.exports = server;  // Export SERVER, not app