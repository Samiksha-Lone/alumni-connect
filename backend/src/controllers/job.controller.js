const Job = require('../models/job.model');
const { parsePagination, buildPaginationResponse } = require('../utils/pagination');

exports.addJob = async (req, res) => {
  try {
    const { title, company, description, link, closingDate } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ message: "Title, company and description are required" });
    }

    const newJob = new Job({
      title,
      company,
      description,
      link,
      closingDate,
      author: req.user ? req.user._id : undefined,
    });

    await newJob.save();
    res.status(201).json({ message: "Job added successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error adding job" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { page, limit } = parsePagination(req.query, { page: 1, limit: 12 });

    const [jobs, total] = await Promise.all([
      Job.find()
        .sort({ createdAt: -1 })
        .populate('author', 'name email')
        .skip((page - 1) * limit)
        .limit(limit),
      Job.countDocuments()
    ]);

    res.status(200).json(buildPaginationResponse(jobs, page, limit, total));
  } catch (error) {
    res.status(500).json({ message: "Server error fetching jobs" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, company, description, link, closingDate } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Allow admin or the user who created the job to update
    if (!req.user || (req.user.role !== 'admin' && String(job.author) !== String(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    if (title) job.title = title;
    if (company) job.company = company;
    if (description) job.description = description;
    if (link !== undefined) job.link = link;
    job.closingDate = closingDate || job.closingDate;

    const updatedJob = await job.save();
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error updating job" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Allow admin or the user who created the job to delete
    if (!req.user || (req.user.role !== 'admin' && String(job.author) !== String(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    // Keep the previous safety rule but allow admin override
    const now = new Date();
    if (job.closingDate) {
      const closingDate = new Date(job.closingDate);
      const daysUntilClosing = Math.ceil((closingDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntilClosing > 7 && closingDate > now && req.user.role !== 'admin') {
        return res.status(400).json({ 
          message: `Job cannot be deleted. Closing date is ${daysUntilClosing} days away. Can only delete if closing date is within 7 days or has passed.` 
        });
      }
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting job" });
  }
};

exports.saveJobForUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const jobId = req.params.id;
    const User = require('../models/user.model');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.savedJobs?.some(j => String(j) === String(jobId));
    if (exists) {
      user.savedJobs = user.savedJobs.filter(j => String(j) !== String(jobId));
      await user.save();
      return res.json({ message: 'Job removed from saved list' });
    }

    user.savedJobs = user.savedJobs || [];
    user.savedJobs.push(jobId);
    await user.save();
    return res.json({ message: 'Job saved' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error saving job' });
  }
};

