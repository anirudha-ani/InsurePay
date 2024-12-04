import request from 'supertest';
import express from 'express';
import { sequelize } from '../config/database';
import insurancePolicyRoutes from '../routes/insurancePolicy';
import InsurancePolicy from '../models/InsurancePolicy';
import InsurancePlan from '../models/InsurancePlan';
import User from '../models/User';

const app = express();
app.use(express.json());
app.use('/insurance-policies', insurancePolicyRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
  await User.create({ username: 'testuser' });
  await InsurancePlan.create({ premium: 100, taxFee: 20 });
});

afterAll(async () => {
  await sequelize.close(); 
});

describe('InsurancePolicy API', () => {
  it('should create a new insurance policy', async () => {
    const user = await User.findOne({ where: { username: 'testuser' } });
    const insurancePlan = await InsurancePlan.findOne({ where: { premium: 100 } });

    const response = await request(app)
      .post('/insurance-policies')
      .send({ userId: user!.id, insurancePlanId: insurancePlan!.id });
    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(user!.id);
    expect(response.body.insurancePlanId).toBe(insurancePlan!.id);
  });

  it('should not create an insurance policy with invalid userId', async () => {
    const insurancePlan = await InsurancePlan.findOne({ where: { premium: 100 } });

    const response = await request(app)
      .post('/insurance-policies')
      .send({ userId: 9999, insurancePlanId: insurancePlan!.id }); // Invalid userId
    expect(response.status).toBe(404);
    expect(response.body.error).toContain('User or Insurance Plan not found');
  });

  it('should not create an insurance policy with invalid insurancePlanId', async () => {
    const user = await User.findOne({ where: { username: 'testuser' } });

    const response = await request(app)
      .post('/insurance-policies')
      .send({ userId: user!.id, insurancePlanId: 9999 }); // Invalid insurancePlanId
    expect(response.status).toBe(404);
    expect(response.body.error).toContain('User or Insurance Plan not found');
  });

  it('should list all insurance policies', async () => {
    const response = await request(app).get('/insurance-policies');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a single insurance policy by ID', async () => {
    const insurancePolicy = await InsurancePolicy.findOne();
    const response = await request(app).get(`/insurance-policies/${insurancePolicy!.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(insurancePolicy!.id);
  });

  it('should update an insurance policy', async () => {
    const insurancePolicy = await InsurancePolicy.findOne();
    const user = await User.create({ username: 'newuser' });
    const insurancePlan = await InsurancePlan.create({ premium: 200, taxFee: 40 });

    const response = await request(app)
      .put(`/insurance-policies/${insurancePolicy!.id}`)
      .send({ userId: user.id, insurancePlanId: insurancePlan.id });
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.insurancePlanId).toBe(insurancePlan.id);
  });

  it('should delete an insurance policy', async () => {
    const insurancePolicy = await InsurancePolicy.findOne();
    const response = await request(app).delete(`/insurance-policies/${insurancePolicy!.id}`);
    expect(response.status).toBe(204);
  });
});