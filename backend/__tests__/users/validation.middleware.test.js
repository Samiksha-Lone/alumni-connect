const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/user.model', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

const authRoutes = require('../../src/routes/auth.routes');
const { errorHandler } = require('../../src/middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Validation middleware', () => {
  it('rejects invalid email input on forgot-password requests', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('Invalid email format')
        })
      ])
    );
  });
});
