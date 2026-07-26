const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/user.model', () => ({
  findOne: jest.fn(),
}));

const userModel = require('../../src/models/user.model');
const authRoutes = require('../../src/routes/auth.routes');
const { errorHandler } = require('../../src/middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Authentication response standardization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a standardized error payload for invalid login', async () => {
    userModel.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toEqual(
      expect.objectContaining({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      })
    );
    expect(res.body.message).toBe('Invalid email or password');
  });
});
