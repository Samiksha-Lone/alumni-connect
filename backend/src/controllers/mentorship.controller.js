const User = require('../models/user.model');
const MentorshipRequest = require('../models/mentorship.model');
const { moderateText } = require('../services/moderation.service');

async function searchMentors(req, res) {
  try {
    const { q } = req.query;
    const query = { role: 'alumni', mentorAvailable: true };
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { expertise: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } },
      ];
    }

    const mentors = await User.find(query)
      .select('name email company expertise skills bio profileStatus isVerified');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load mentors', error: error.message });
  }
}

async function getMatches(req, res) {
  try {
    const { course, skills } = req.query;
    const query = { role: 'alumni', mentorAvailable: true };

    if (course) query.courseStudied = { $regex: course, $options: 'i' };
    if (skills) query.skills = { $in: skills.split(',').map((skill) => skill.trim()).filter(Boolean) };

    const mentors = await User.find(query)
      .select('name company expertise skills bio profileStatus isVerified');

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to find mentor matches', error: error.message });
  }
}

async function createRequest(req, res) {
  try {
    const { mentorId, topics = [], message = '' } = req.body;
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'alumni') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const contentModeration = moderateText(message);
    if (contentModeration.blocked) {
      return res.status(400).json({ message: 'Request message contains prohibited words' });
    }

    const request = await MentorshipRequest.create({
      studentId: req.user._id,
      mentorId,
      studentName: req.user.name,
      mentorName: mentor.name,
      studentCourse: req.user.course || req.user.courseStudied || 'Not specified',
      mentorExpertise: mentor.expertise || mentor.courseStudied || 'Not specified',
      topics: Array.isArray(topics) ? topics.slice(0, 10) : [],
      message: contentModeration.sanitized,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create mentorship request', error: error.message });
  }
}

async function getRequests(req, res) {
  try {
    const query = {
      $or: [
        { studentId: req.user._id },
        { mentorId: req.user._id },
      ],
    };
    const requests = await MentorshipRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load mentorship requests', error: error.message });
  }
}

async function respondRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { status, responseMessage = '' } = req.body;
    const request = await MentorshipRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the selected mentor can respond' });
    }
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined' });
    }

    request.status = status;
    request.responseMessage = moderateText(responseMessage).sanitized;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to respond to mentorship request', error: error.message });
  }
}

module.exports = {
  searchMentors,
  getMatches,
  createRequest,
  getRequests,
  respondRequest,
};
