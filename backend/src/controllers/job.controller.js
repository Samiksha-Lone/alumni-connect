const Job = require('../models/job.model');

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
    });

    await newJob.save();
    res.status(201).json({ message: "Job added successfully", job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error adding job" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching jobs" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update jobs" });
    }

    const jobId = req.params.id;
    const { title, company, description, link, closingDate } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (title) job.title = title;
    if (company) job.company = company;
    if (description) job.description = description;
    if (link) job.link = link;
    if (closingDate) job.closingDate = closingDate;

    const updatedJob = await job.save();
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating job" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      console.warn('Unauthorized delete job attempt', { user: req.user, params: req.params })
      return res.status(403).json({ message: "Only admin can delete jobs" });
    }

    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const now = new Date();
    const closingDate = new Date(job.closingDate);
    const daysUntilClosing = Math.ceil((closingDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilClosing > 7 && closingDate > now) {
      return res.status(400).json({ 
        message: `Job cannot be deleted. Closing date is ${daysUntilClosing} days away. Can only delete if closing date is within 7 days or has passed.` 
      });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting job" });
  }
};
