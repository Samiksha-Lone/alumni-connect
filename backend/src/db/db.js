const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

function getMongoUri() {
    const useLocalDb = process.env.USE_LOCAL_DB !== 'false';

    if (useLocalDb) {
        return process.env.MONGO_URI_LOCAL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alumni_connect';
    }

    return process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/alumni_connect';
}

function connectDB() {
    return mongoose.connect(getMongoUri())
    .then(() => {
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        throw err;
    });
}

module.exports = connectDB;