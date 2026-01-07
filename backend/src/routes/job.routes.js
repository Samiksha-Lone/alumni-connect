const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/', authenticate, jobController.addJob);
router.get('/', jobController.getJobs);

router.put('/:id', authenticate, jobController.updateJob);

router.delete('/:id', authenticate, jobController.deleteJob);

module.exports = router;
