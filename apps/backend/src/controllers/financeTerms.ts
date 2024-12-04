import { Request, Response } from 'express';
import FinanceTerms from '../models/FinanceTerms';
import InsurancePolicy from '../models/InsurancePolicy';
import User from '../models/User';
import InsurancePlan from '../models/InsurancePlan';

// Create a new finance terms
export const createFinanceTerms = async (req: Request, res: Response) => {
  const { insurancePolicyIDs, dueDate, createdBy } = req.body;

  try {
    // Check if due date is in the future
    if (new Date(dueDate) <= new Date()) {
      return res.status(400).json({ error: 'Due date must be in the future' });
    }

    // Check if createdBy is a valid user ID
    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!insurancePolicyIDs || insurancePolicyIDs.length === 0) {
      return res.status(400).json({ error: 'At least one insurance policy ID is required' });
    }
    // Check if insurancePolicyIDs are valid
    const policies = await InsurancePolicy.findAll({
      where: {
      id: insurancePolicyIDs,
      },
    });

    if (policies.length !== insurancePolicyIDs.length) {
      return res.status(400).json({ error: 'One or more insurance policy IDs are invalid' });
    }
    const financeTerms = await FinanceTerms.create({
      dueDate,
      createdBy,
      status: 'non-agreed',
      insurancePolicyIDs,
    });
    
    res.status(201).json(financeTerms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agree to finance terms
export const agreeFinanceTerms = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { agreedBy } = req.body;
  const user = await User.findByPk(agreedBy);
  if (!user) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  try {
    const financeTerms = await FinanceTerms.findByPk(id);
    if (!financeTerms) {
      return res.status(404).json({ error: 'Finance terms not found' });
    }

    financeTerms.status = 'agreed';
    financeTerms.agreedBy = agreedBy;
    await financeTerms.save();

    res.status(200).json(financeTerms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all finance terms
export const listFinanceTerms = async (req: Request, res: Response) => {
  const { status, sortBy, order } = req.query;

  try {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const financeTerms = await FinanceTerms.findAll({
      where,
      order: [[(sortBy as string) || 'dueDate', (order as string) || 'ASC']],
    });

    res.status(200).json(financeTerms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to calculate downpayment and amount financed
const calculateFinanceDetails = async (insurancePolicyIDs: any[]) => {
  const policies = await InsurancePolicy.findAll({
    where: {
    id: insurancePolicyIDs,
    },
  });
  return Promise.all(policies.map(async policy => {
    const insurancePlan = await InsurancePlan.findByPk(policy.insurancePlanId);
    const downPayment = (insurancePlan.premium * 0.20) + insurancePlan.taxFee;
    const amountFinanced = (insurancePlan.premium + insurancePlan.taxFee) - downPayment;
    return {
      ...policy.toJSON(),
      downPayment,
      amountFinanced
    };
  }));
};

// List all finance terms with additional details
export const listFinanceTermsWithDetails = async (req: Request, res: Response) => {
  const { status, sortBy, order, downPaymentFilter, downPaymentAmount } = req.query;

  try {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const financeTerms = await FinanceTerms.findAll({
      where,
      order: [[(sortBy as string) || 'dueDate', (order as string) || 'ASC']],
    });

    const financeTermsWithDetails = await Promise.all(financeTerms.map(async term => {
      const policies = await calculateFinanceDetails(term.insurancePolicyIDs);
      return {
        ...term.toJSON(),
        policies
      };
    }));

    let filteredFinanceTerms = financeTermsWithDetails;

    if (downPaymentFilter && downPaymentAmount) {
      const amount = parseFloat(downPaymentAmount as string);
      filteredFinanceTerms = await Promise.all(financeTermsWithDetails.filter(async term => {
        const totalDownPayment = term.policies.reduce((sum, policy) => sum + policy.downPayment, 0);
        console.log("totalDownPayment = ", totalDownPayment);
        console.log("amount = ", amount);
        console.log("downPaymentFilter = ", downPaymentFilter);
        if (downPaymentFilter === 'greater') {
          return totalDownPayment > amount;
        } else if (downPaymentFilter === 'less') {
          return totalDownPayment < amount;
        } else if (downPaymentFilter === 'equal') {
          return totalDownPayment === amount;
        }
        return true;
      }));
    }

    res.status(200).json(filteredFinanceTerms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single finance terms by ID
export const getFinanceTermsById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const financeTerms = await FinanceTerms.findByPk(id);

    if (!financeTerms) {
      return res.status(404).json({ error: 'Finance terms not found' });
    }

    res.status(200).json(financeTerms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update finance terms
export const updateFinanceTerms = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dueDate, status, agreedBy, insurancePolicyIDs } = req.body;

  // Validate due date if provided
  if (dueDate && new Date(dueDate) <= new Date()) {
    return res.status(400).json({ error: 'Due date must be in the future' });
  }

  // Validate status if provided
  const validStatuses = ['non-agreed', 'agreed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Validate agreedBy if provided
  if (agreedBy) {
    const user = await User.findByPk(agreedBy);
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  }

  // Validate insurancePolicyIDs if provided
  if (insurancePolicyIDs ) {
    const policies = await InsurancePolicy.findAll({
      where: {
        id: insurancePolicyIDs,
      },
    });

    if (policies.length !== insurancePolicyIDs.length) {
      return res.status(400).json({ error: 'One or more insurance policy IDs are invalid' });
    }
  }

  try {
    const financeTerms = await FinanceTerms.findByPk(id);

    if (!financeTerms) {
      return res.status(404).json({ error: 'Finance terms not found' });
    }

    if (dueDate) {
      financeTerms.dueDate = dueDate;
    }
    if (status) {
      financeTerms.status = status;
    }
    if (agreedBy) {
      financeTerms.agreedBy = agreedBy;
    }
    if (insurancePolicyIDs) {
      financeTerms.insurancePolicyIDs = insurancePolicyIDs;
    }
    await financeTerms.save();

    res.status(200).json(financeTerms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete finance terms
export const deleteFinanceTerms = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const financeTerms = await FinanceTerms.findByPk(id);

    if (!financeTerms) {
      return res.status(404).json({ error: 'Finance terms not found' });
    }

    await financeTerms.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};