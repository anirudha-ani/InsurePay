import request from 'supertest';
import express from 'express';
import { sequelize } from '../config/database';
import financeTermsRoutes from '../routes/financeTerms';
import FinanceTerms from '../models/FinanceTerms';
import InsurancePolicy from '../models/InsurancePolicy';
import InsurancePlan from '../models/InsurancePlan';
import User from '../models/User';

const app = express();
app.use(express.json());
app.use('/finance-terms', financeTermsRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({ username: 'testuser' });
  await InsurancePlan.create({ premium: 100, taxFee: 20 });
  await InsurancePlan.create({ premium: 200, taxFee: 40 });
});

afterAll(async () => {
  await sequelize.close();
});

describe('FinanceTerms API', () => {
  it('should create a new finance terms', async () => {
    const user = await User.findOne({ where: { username: 'testuser' } });
    const insurancePlan = await InsurancePlan.findOne({ where: { premium: 100 } });
    const insurancePolicy = await InsurancePolicy.create({ userId: user!.id, insurancePlanId: insurancePlan!.id });

    const response = await request(app)
      .post('/finance-terms')
      .send({ insurancePolicyIDs: [insurancePolicy.id], dueDate: new Date(Date.now() + 120400000), createdBy: user!.id });
    console.log("Oni response = ", response.body);
    expect(response.status).toBe(201);
    expect(response.body.createdBy).toBe(user!.id);
    expect(response.body.insurancePolicyIDs).toContain(insurancePolicy.id);
  });

  it('should not create finance terms with past due date', async () => {
    const user = await User.findOne({ where: { username: 'testuser' } });
    const insurancePlan = await InsurancePlan.findOne({ where: { premium: 100 } });
    const insurancePolicy = await InsurancePolicy.create({ userId: user!.id, insurancePlanId: insurancePlan!.id });

    const response = await request(app)
      .post('/finance-terms')
      .send({ insurancePolicyIDs: [insurancePolicy.id], dueDate: new Date(Date.now() - 86400000), createdBy: user!.id });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Due date must be in the future');
  });

  it('should agree to finance terms', async () => {
    const user = await User.findOne({ where: { username: 'testuser' } });
    const insurancePlan = await InsurancePlan.findOne({ where: { premium: 200 } });
    const insurancePolicy = await InsurancePolicy.create({ userId: user!.id, insurancePlanId: insurancePlan!.id });

    const financeTerms = await FinanceTerms.create({ dueDate: new Date(Date.now() + 86400000), createdBy: user!.id, status: 'non-agreed', insurancePolicyIDs: [insurancePolicy.id] });

    const response = await request(app)
      .put(`/finance-terms/${financeTerms.id}/agree`)
      .send({ agreedBy: user!.id });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('agreed');
    expect(response.body.agreedBy).toBe(user!.id);
  });

  it('should list all finance terms', async () => {
    
    const response = await request(app).get('/finance-terms');
    console.log("data = ", JSON.stringify(response.body));
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a single finance terms by ID', async () => {
    const financeTerms = await FinanceTerms.findOne();
    const response = await request(app).get(`/finance-terms/${financeTerms!.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(financeTerms!.id);
  });

  it('should update finance terms', async () => {
    const financeTerms = await FinanceTerms.findOne();
    const response = await request(app)
      .put(`/finance-terms/${financeTerms!.id}`)
      .send({ status: 'agreed' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('agreed');
  });

  it('should delete finance terms', async () => {
    const financeTerms = await FinanceTerms.findOne();
    const response = await request(app).delete(`/finance-terms/${financeTerms!.id}`);
    expect(response.status).toBe(204);
  });
  
  it('should filter finance terms by status', async () => {
    const response = await request(app).get('/finance-terms?status=agreed');
    expect(response.status).toBe(200);
    response.body.forEach((term: any) => {
      expect(term.status).toBe('agreed');
    });
  });
  
  it('should sort finance terms by due date in ascending order', async () => {
    const response = await request(app).get('/finance-terms?sortBy=dueDate&order=ASC');
    expect(response.status).toBe(200);
    for (let i = 1; i < response.body.length; i++) {
      expect(new Date(response.body[i - 1].dueDate) <= new Date(response.body[i].dueDate)).toBe(true);
    }
  });

  it('should sort finance terms by due date in descending order', async () => {
    const response = await request(app).get('/finance-terms?sortBy=dueDate&order=DESC');
    expect(response.status).toBe(200);
    for (let i = 1; i < response.body.length; i++) {
      expect(new Date(response.body[i - 1].dueDate) >= new Date(response.body[i].dueDate)).toBe(true);
    }
  });

  it('should filter finance terms by down payment amount greater than a specified amount', async () => {
    const response = await request(app).get('/finance-terms?downPaymentFilter=greater&downPaymentAmount=50');
    expect(response.status).toBe(200);
    response.body.forEach((term: any) => {
      const totalDownPayment = term.policies.reduce((sum: number, policy: any) => sum + policy.downPayment, 0);
      console.log("totalDownPayment = ", totalDownPayment);
      expect(totalDownPayment).toBeGreaterThan(50);
    });
  });

  it('should filter finance terms by down payment amount less than a specified amount', async () => {
    const response = await request(app).get('/finance-terms?downPaymentFilter=less&downPaymentAmount=150');
    expect(response.status).toBe(200);
    response.body.forEach((term: any) => {
      const totalDownPayment = term.policies.reduce((sum: number, policy: any) => sum + policy.downPayment, 0);
      expect(totalDownPayment).toBeLessThan(150);
    });
  });

  it('should filter finance terms by down payment amount equal to a specified amount', async () => {
    const response = await request(app).get('/finance-terms?downPaymentFilter=equal&downPaymentAmount=80');
    expect(response.status).toBe(200);
    response.body.forEach((term: any) => {
      const totalDownPayment = term.policies.reduce((sum: number, policy: any) => sum + policy.downPayment, 0);
      expect(totalDownPayment).toBe(80);
    });
  });
});