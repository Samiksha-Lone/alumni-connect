//create server
const express = require('express');
const cookierParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookierParser());
app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET','POST','PUT','DELETE','OPTIONS']
}))

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const galleryRoutes = require('./routes/gallery.routes');  
const jobRoutes = require('./routes/job.routes');   
const mongoose = require('mongoose');
const Event = require('./models/event.model');
const User = require('./models/user.model');
const Gallery = require('./models/gallery.model');
const Job = require('./models/job.model');

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', galleryRoutes);
app.use('/api', jobRoutes);

// Dev debug route - reports DB connection state and counts
app.get('/debug/status', async (req, res) => {
    try {
        const state = mongoose.connection.readyState; // 0 disconnected,1 connected
        const [users, events, gallery, jobs] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Gallery.countDocuments(),
            Job.countDocuments()
        ]);
        res.json({ state, counts: { users, events, gallery, jobs } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;