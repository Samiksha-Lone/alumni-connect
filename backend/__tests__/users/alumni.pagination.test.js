const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/user.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));

const User = require('../../src/models/user.model');
const userRoutes = require('../../src/routes/user.routes');
const { errorHandler } = require('../../src/middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

describe('Alumni pagination endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated alumni results with metadata', async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ _id: 'u1', role: 'alumni', name: 'Ava' }]),
          }),
        }),
      }),
    });

    User.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .get('/api/users/alumni?page=1&limit=10&search=ava');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toEqual(expect.objectContaining({ page: 1, limit: 10, total: 1 }));
  });
});
