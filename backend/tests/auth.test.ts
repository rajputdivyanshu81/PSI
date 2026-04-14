import request from 'supertest';
import app from '../src/app';
import prisma from '../src/db';

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // clean up before tests
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should fail registration if email exists', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login an existing user', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
