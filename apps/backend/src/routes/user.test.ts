import request from 'supertest';
import express from 'express';
import userRoutes from './user';
import { sequelize } from '../config/database';
import User from '../models/User';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close(); 
});

describe('User API', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ username: 'User555' });
    expect(response.status).toBe(201);
    expect(response.body.username).toBe('User555');
  });

  it('should not create a user with an existing username', async () => {
    await User.create({ username: 'User 2' });
    const response = await request(app)
      .post('/users')
      .send({ username: 'User 2' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username already exists');
  });

  it('should get all users', async () => {
    await User.create({ username: 'User0' });
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a user', async () => {
    const user = await User.create({ username: 'User3' });
    const response = await request(app)
      .put(`/users/${user.id}`)
      .send({ username: 'User4' });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('User4');
  });

  it('should not update a user with an existing username', async () => {
    await User.create({ username: 'User5' });
    const user = await User.create({ username: 'User6' });
    const response = await request(app)
      .put(`/users/${user.id}`)
      .send({ username: 'User5' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username already exists');
  });

  it('should delete a user', async () => {
    const user = await User.create({ username: 'User7' });
    const response = await request(app).delete(`/users/${user.id}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 when deleting a non-existent user', async () => {
    const response = await request(app).delete('/users/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});