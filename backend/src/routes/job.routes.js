const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/jobs', authenticate, jobController.addJob);
// public GET to load job/opportunities without auth
router.get('/jobs', jobController.getJobs);

// Update job (Admin only)
router.put('/jobs/:id', authenticate, jobController.updateJob);

// Delete job (Admin only) - can only delete if closing date is within 7 days or has passed
router.delete('/jobs/:id', authenticate, jobController.deleteJob);

module.exports = router;
