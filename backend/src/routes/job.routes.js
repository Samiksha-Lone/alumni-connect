const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authenticate = require('../middlewares/auth.middleware');
const { validateCreateJob, validateJobId } = require('../middlewares/validation.middleware');

router.post('/', authenticate, validateCreateJob, jobController.addJob);
router.get('/', jobController.getJobs);
router.post('/:id/save', authenticate, validateJobId, jobController.saveJobForUser);

router.put('/:id', authenticate, validateJobId, validateCreateJob, jobController.updateJob);

router.delete('/:id', authenticate, validateJobId, jobController.deleteJob);

module.exports = router;
