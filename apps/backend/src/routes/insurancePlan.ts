import { Router } from 'express';
import {
  createInsurancePlan,
  listInsurancePlans,
  getInsurancePlanById,
  updateInsurancePlan,
  deleteInsurancePlan,
} from '../controllers/insurancePlan';

const router = Router();

// Create insurance plan
router.post('/', createInsurancePlan);

// List insurance plans
router.get('/', listInsurancePlans);

// Get insurance plan by ID
router.get('/:id', getInsurancePlanById);

// Update insurance plan
router.put('/:id', updateInsurancePlan);

// Delete insurance plan
router.delete('/:id', deleteInsurancePlan);

export default router;