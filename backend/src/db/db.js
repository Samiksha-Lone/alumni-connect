const mongoose = require('mongoose');
require('dotenv').config();

function getMongoUri() {
  return process.env.MONGO_URI_LOCAL;
}

async function connectDB() {
  try {
    await mongoose.connect(getMongoUri());

    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;