const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/event.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock('../../src/models/job.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock('../../src/models/user.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock('../../src/middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { _id: 'admin1', id: 'admin1', role: 'admin' };
  next();
});

jest.mock('../../src/middlewares/role.middleware', () => () => (req, res, next) => next());

const Event = require('../../src/models/event.model');
const Job = require('../../src/models/job.model');
const User = require('../../src/models/user.model');

const eventRoutes = require('../../src/routes/event.routes');
const jobRoutes = require('../../src/routes/job.routes');
const userRoutes = require('../../src/routes/user.routes');

const app = express();
app.use(express.json());
app.use('/api/events', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

describe('server-side pagination for list endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated event data with metadata', async () => {
    Event.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ _id: 'e1', title: 'Demo event' }]),
        }),
      }),
    });
    Event.countDocuments.mockResolvedValue(2);

    const res = await request(app).get('/api/events?page=2&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toEqual(expect.objectContaining({ page: 2, limit: 1, total: 2 }));
  });

  it('returns paginated job data with metadata', async () => {
    Job.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ _id: 'j1', title: 'Software Engineer' }]),
          }),
        }),
      }),
    });
    Job.countDocuments.mockResolvedValue(3);

    const res = await request(app).get('/api/jobs?page=1&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toEqual(expect.objectContaining({ page: 1, limit: 1, total: 3 }));
  });

  it('returns paginated user data with metadata for admin listing', async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ _id: 'u1', name: 'Ada' }]),
          }),
        }),
      }),
    });
    User.countDocuments.mockResolvedValue(5);

    const res = await request(app).get('/api/users?page=2&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toEqual(expect.objectContaining({ page: 2, limit: 1, total: 5 }));
  });
});
