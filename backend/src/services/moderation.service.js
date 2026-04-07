const crypto = require('crypto');

const blockedTerms = [
  'spam',
  'scam',
  'fraud',
  'fake',
  'abuse',
  'offensive',
  'malware',
  'phishing'
];

function containsBlockedWords(text) {
  if (!text || typeof text !== 'string') return false;
  const normalized = text.toLowerCase();
  return blockedTerms.some((term) => normalized.includes(term));
}

function moderateText(text) {
  if (!text || typeof text !== 'string') return { blocked: false, sanitized: text };
  const blocked = containsBlockedWords(text);
  const sanitized = text.replace(/\b(spam|scam|fraud|fake|abuse|offensive|malware|phishing)\b/gi, '****');
  return { blocked, sanitized };
}

function calculateFakeProfileScore(user) {
  let score = 0;
  if (!user.avatar) score += 10;
  if (!user.company && user.role === 'alumni') score += 10;
  if (!user.courseStudied && user.role === 'alumni') score += 10;
  if (!user.yearOfStudying && user.role === 'student') score += 10;
  if (!user.skills || user.skills.length === 0) score += 5;
  if (!user.bio || user.bio.length < 20) score += 5;
  if (user.email && /@(gmail|yahoo|hotmail|outlook)\./i.test(user.email)) score += 10;
  return Math.min(100, score);
}

function createVerificationHash(userId, email) {
  return crypto
    .createHash('sha256')
    .update(`${userId}:${email}:${Date.now()}`)
    .digest('hex');
}

module.exports = {
  moderateText,
  containsBlockedWords,
  calculateFakeProfileScore,
  createVerificationHash,
};
