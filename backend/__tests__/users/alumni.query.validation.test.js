const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/user.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

const userRoutes = require('../../src/routes/user.routes');
const { errorHandler } = require('../../src/middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

describe('Alumni query validation', () => {
  it('rejects invalid pagination params for the alumni listing route', async () => {
    const res = await request(app)
      .get('/api/users/alumni?page=0&limit=0');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'page' }),
        expect.objectContaining({ field: 'limit' }),
      ])
    );
  });
});
