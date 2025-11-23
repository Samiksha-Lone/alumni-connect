const mongoose = require('mongoose');
require('dotenv').config();

function connectDB() {
    return mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        throw err;
    });
}

module.exports = connectDB;