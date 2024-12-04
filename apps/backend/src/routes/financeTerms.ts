import { Router } from 'express';
import {
  createFinanceTerms,
  agreeFinanceTerms,
  listFinanceTerms,
  getFinanceTermsById,
  updateFinanceTerms,
  deleteFinanceTerms,
  listFinanceTermsWithDetails,
} from '../controllers/financeTerms';

const router = Router();

// Create finance terms
router.post('/', createFinanceTerms);

// Agree to finance terms
router.put('/:id/agree', agreeFinanceTerms);

// List finance terms
router.get('/', listFinanceTermsWithDetails);

// Get finance terms by ID
router.get('/:id', getFinanceTermsById);

// Update finance terms
router.put('/:id', updateFinanceTerms);

// Delete finance terms
router.delete('/:id', deleteFinanceTerms);

export default router;