import { Router } from 'express';
import {
  createInsurancePolicy,
  listInsurancePolicies,
  getInsurancePolicyById,
  updateInsurancePolicy,
  deleteInsurancePolicy,
} from '../controllers/insurancePolicy';

const router = Router();

// Create insurance policy
router.post('/', createInsurancePolicy);

// List insurance policies
router.get('/', listInsurancePolicies);

// Get insurance policy by ID
router.get('/:id', getInsurancePolicyById);

// Update insurance policy
router.put('/:id', updateInsurancePolicy);

// Delete insurance policy
router.delete('/:id', deleteInsurancePolicy);

export default router;