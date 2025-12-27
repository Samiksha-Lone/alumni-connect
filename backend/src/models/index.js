const mongoose = require('mongoose');

// Register ALL models
require('./user.model');
require('./message.model');
require('./event.model');
require('./gallery.model');
require('./job.model');

module.exports = mongoose.models;
