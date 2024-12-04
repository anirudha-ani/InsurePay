import request from 'supertest';
import express from 'express';
import { sequelize } from '../config/database';
import insurancePlanRoutes from '../routes/insurancePlan';
import InsurancePlan from '../models/InsurancePlan';

const app = express();
app.use(express.json());
app.use('/insurance-plans', insurancePlanRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Sync all models
});

afterAll(async () => {
  await sequelize.close(); // Close the connection
});

describe('InsurancePlan API', () => {
  it('should create a new insurance plan', async () => {
    const response = await request(app)
      .post('/insurance-plans')
      .send({ premium: 200, taxFee: 50 });
    expect(response.status).toBe(201);
    expect(response.body.premium).toBe(200);
    expect(response.body.taxFee).toBe(50);
  });

  it('should not create an insurance plan with negative premium', async () => {
    const response = await request(app)
      .post('/insurance-plans')
      .send({ premium: -200, taxFee: 50 });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Premium and tax fee must be non-negative');
  });

  it('should not create an insurance plan with negative tax fee', async () => {
    const response = await request(app)
      .post('/insurance-plans')
      .send({ premium: 200, taxFee: -50 });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Premium and tax fee must be non-negative');
  });

  it('should list all insurance plans', async () => {
    await InsurancePlan.create({ premium: 300, taxFee: 75 });
    const response = await request(app).get('/insurance-plans');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a single insurance plan by ID', async () => {
    const insurancePlan = await InsurancePlan.create({ premium: 400, taxFee: 100 });
    const response = await request(app).get(`/insurance-plans/${insurancePlan.id}`);
    expect(response.status).toBe(200);
    expect(response.body.premium).toBe(400);
    expect(response.body.taxFee).toBe(100);
  });

  it('should update an insurance plan', async () => {
    const insurancePlan = await InsurancePlan.create({ premium: 500, taxFee: 125 });
    const response = await request(app)
      .put(`/insurance-plans/${insurancePlan.id}`)
      .send({ premium: 600, taxFee: 150 });
    expect(response.status).toBe(200);
    expect(response.body.premium).toBe(600);
    expect(response.body.taxFee).toBe(150);
  });

  it('should delete an insurance plan', async () => {
    const insurancePlan = await InsurancePlan.create({ premium: 700, taxFee: 175 });
    const response = await request(app).delete(`/insurance-plans/${insurancePlan.id}`);
    expect(response.status).toBe(204);
  });
});