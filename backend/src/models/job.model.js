const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  link: String,
  closingDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('job', jobSchema);
