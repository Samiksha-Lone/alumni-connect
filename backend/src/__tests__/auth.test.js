const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

const server = require('../src/app');
const User = require('../src/models/user.model');
const connectDB = require('../src/db/db');

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Connect to test database
    await connectDB();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear users after each test
    await User.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register a new student user', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'Computer Science'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('john@example.com');
    });

    it('should register a new alumni user', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'alumni',
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'SecurePass123',
          courseStudied: 'Computer Science',
          company: 'Tech Corp',
          graduationYear: 2020
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('alumni');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'invalid-email',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'CS'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Validation error');
    });

    it('should return 400 for weak password', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'weak',
          yearOfStudying: 2,
          course: 'CS'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Validation error');
    });

    it('should return 400 when registering duplicate email', async () => {
      // Register first user
      await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'CS'
        });

      // Try to register with same email
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'Jane Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'CS'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('already exists');
    });

    it('should require alumni specific fields', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'alumni',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          // Missing alumni fields
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Validation error');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'CS'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toContain('successful');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePass123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({
          password: 'SecurePass123'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /auth/logout', () => {
    let token;

    beforeEach(async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'CS'
        });

      token = res.body.token;
    });

    it('should logout successfully with valid token', async () => {
      const res = await request(server)
        .get('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('Logged out');
    });

    it('should return 401 without token', async () => {
      const res = await request(server)
        .get('/auth/logout');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    let token, userId;

    beforeEach(async () => {
      const res = await request(server)
        .post('/auth/register')
        .send({
          role: 'student',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'SecurePass123',
          yearOfStudying: 2,
          course: 'CS'
        });

      token = res.body.token;
      userId = res.body.user.id;
    });

    it('should get current user profile', async () => {
      const res = await request(server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('john@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const res = await request(server)
        .get('/auth/me');

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(server)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });
  });
});
