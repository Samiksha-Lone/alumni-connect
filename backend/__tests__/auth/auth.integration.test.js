const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

jest.mock('../../src/models/user.model', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
}));

const userModel = require('../../src/models/user.model');
const authRoutes = require('../../src/routes/auth.routes');
const verifyToken = require('../../src/middlewares/auth.middleware');
const { errorHandler } = require('../../src/middlewares/error.middleware');

process.env.JWT_SECRET = 'test-secret';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});
app.use(errorHandler);

describe('Authentication integration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in a user and allows access to a protected route', async () => {
    const hashedPassword = await bcrypt.hash('password123', 12);
    const storedUser = {
      _id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'student',
      password: hashedPassword,
    };

    userModel.findOne.mockResolvedValue(storedUser);
    userModel.findById.mockResolvedValue(storedUser);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ada@example.com', password: 'password123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.email).toBe('ada@example.com');
    expect(loginRes.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('token=')])
    );

    const protectedRes = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(protectedRes.status).toBe(200);
    expect(protectedRes.body.ok).toBe(true);
    expect(protectedRes.body.user.email).toBe('ada@example.com');
  });
});
