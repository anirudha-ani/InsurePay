import { Request, Response } from 'express';
import InsurancePlan from '../models/InsurancePlan';

// Create a new insurance plan
export const createInsurancePlan = async (req: Request, res: Response) => {
  const { premium, taxFee } = req.body;

  if (premium < 0 || taxFee < 0) {
    return res.status(400).json({ error: 'Premium and tax fee must be non-negative' });
  }

  try {
    const insurancePlan = await InsurancePlan.create({ premium, taxFee });
    res.status(201).json(insurancePlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all insurance plans
export const listInsurancePlans = async (req: Request, res: Response) => {
  try {
    const insurancePlans = await InsurancePlan.findAll();
    res.status(200).json(insurancePlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single insurance plan by ID
export const getInsurancePlanById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const insurancePlan = await InsurancePlan.findByPk(id);
    if (!insurancePlan) {
      return res.status(404).json({ error: 'Insurance plan not found' });
    }
    res.status(200).json(insurancePlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an insurance plan
export const updateInsurancePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { premium, taxFee } = req.body;

  if (premium < 0 || taxFee < 0) {
    return res.status(400).json({ error: 'Premium and tax fee must be non-negative' });
  }

  try {
    const insurancePlan = await InsurancePlan.findByPk(id);
    if (!insurancePlan) {
      return res.status(404).json({ error: 'Insurance plan not found' });
    }

    insurancePlan.premium = premium;
    insurancePlan.taxFee = taxFee;
    await insurancePlan.save();

    res.status(200).json(insurancePlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an insurance plan
export const deleteInsurancePlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const insurancePlan = await InsurancePlan.findByPk(id);
    if (!insurancePlan) {
      return res.status(404).json({ error: 'Insurance plan not found' });
    }

    await insurancePlan.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};