const User = require('../models/user.model');

function calculateMatchScore(student, alumni) {
  let score = 0;
  const weights = {
    courseMatch: 30,
    skillMatch: 25,
    companyMatch: 15,
    degreeMatch: 20,
    verificationBonus: 10,
  };

  // Course/degree match
  if (student.course && alumni.courseStudied) {
    if (student.course.toLowerCase() === alumni.courseStudied.toLowerCase()) {
      score += weights.courseMatch;
    } else if (
      student.course.toLowerCase().includes(alumni.courseStudied.toLowerCase().split(' ')[0]) ||
      alumni.courseStudied.toLowerCase().includes(student.course.toLowerCase().split(' ')[0])
    ) {
      score += weights.courseMatch * 0.5;
    }
  }

  // Skill match
  const studentSkills = (student.skills || []).map((s) => s.toLowerCase());
  const alumniSkills = (alumni.skills || []).map((s) => s.toLowerCase());
  if (studentSkills.length > 0 && alumniSkills.length > 0) {
    const matches = studentSkills.filter((skill) => alumniSkills.includes(skill)).length;
    const matchPercentage = matches / Math.max(studentSkills.length, alumniSkills.length);
    score += weights.skillMatch * matchPercentage;
  }

  // Company/industry interest (if student has a target company)
  if (student.expertise && alumni.company) {
    if (student.expertise.toLowerCase().includes(alumni.company.toLowerCase())) {
      score += weights.companyMatch * 0.7;
    }
  }

  // Verification bonus
  if (alumni.isVerified) {
    score += weights.verificationBonus;
  }

  // Prefer mentors set to mentor availability
  if (alumni.mentorAvailable) {
    score += 5;
  }

  return Math.min(100, score);
}

async function getRecommendations(req, res) {
  try {
    const { userId } = req.params;
    const student = await User.findById(userId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const alumni = await User.find({
      role: 'alumni',
      _id: { $ne: userId },
      isVerified: true,
    }).select('-password');

    const recommendations = alumni
      .map((alumnus) => ({
        ...alumnus.toObject(),
        matchScore: calculateMatchScore(student, alumnus),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
}

async function getTopMatches(req, res) {
  try {
    const { skills, course, interests } = req.query;

    const alumni = await User.find({
      role: 'alumni',
      isVerified: true,
      mentorAvailable: true,
    }).select('-password');

    if (alumni.length === 0) {
      return res.json([]);
    }

    const mockStudent = {
      course: course || '',
      skills: skills ? skills.split(',').map((s) => s.trim()) : [],
      expertise: interests || '',
    };

    const recommendations = alumni
      .map((alumnus) => ({
        ...alumnus.toObject(),
        matchScore: calculateMatchScore(mockStudent, alumnus),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter((rec) => rec.matchScore > 30)
      .slice(0, 12);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get top matches', error: error.message });
  }
}

module.exports = {
  getRecommendations,
  getTopMatches,
};
