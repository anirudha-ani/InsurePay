import { Request, Response } from 'express';
import InsurancePolicy from '../models/InsurancePolicy';
import InsurancePlan from '../models/InsurancePlan';
import User from '../models/User';

// Create a new insurance policy
export const createInsurancePolicy = async (req: Request, res: Response) => {
  const { userId, insurancePlanId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const insurancePlan = await InsurancePlan.findByPk(insurancePlanId);

    if (!user || !insurancePlan) {
      return res.status(404).json({ error: 'User or Insurance Plan not found' });
    }

    const insurancePolicy = await InsurancePolicy.create({ userId, insurancePlanId });

    res.status(201).json(insurancePolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all insurance policies
export const listInsurancePolicies = async (req: Request, res: Response) => {
  try {
    const insurancePolicies = await InsurancePolicy.findAll({
      include: [
        { model: User, attributes: ['username'] },
        { model: InsurancePlan, attributes: ['premium', 'taxFee'] },
      ],
    });

    res.status(200).json(insurancePolicies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single insurance policy by ID
export const getInsurancePolicyById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const insurancePolicy = await InsurancePolicy.findByPk(id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: InsurancePlan, attributes: ['premium', 'taxFee'] },
      ],
    });

    if (!insurancePolicy) {
      return res.status(404).json({ error: 'Insurance policy not found' });
    }

    res.status(200).json(insurancePolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an insurance policy
export const updateInsurancePolicy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, insurancePlanId } = req.body;

  try {
    const insurancePolicy = await InsurancePolicy.findByPk(id);

    if (!insurancePolicy) {
      return res.status(404).json({ error: 'Insurance policy not found' });
    }

    const user = await User.findByPk(userId);
    const insurancePlan = await InsurancePlan.findByPk(insurancePlanId);

    if (!user || !insurancePlan) {
      return res.status(404).json({ error: 'User or Insurance Plan not found' });
    }

    insurancePolicy.userId = userId;
    insurancePolicy.insurancePlanId = insurancePlanId;
    await insurancePolicy.save();

    res.status(200).json(insurancePolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an insurance policy
export const deleteInsurancePolicy = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const insurancePolicy = await InsurancePolicy.findByPk(id);

    if (!insurancePolicy) {
      return res.status(404).json({ error: 'Insurance policy not found' });
    }

    await insurancePolicy.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};