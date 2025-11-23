const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/jobs', authenticate, jobController.addJob);
router.get('/jobs', jobController.getJobs);

router.put('/jobs/:id', authenticate, jobController.updateJob);

router.delete('/jobs/:id', authenticate, jobController.deleteJob);

module.exports = router;
