const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  link: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  closingDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('job', jobSchema);
