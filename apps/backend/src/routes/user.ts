import { Router } from 'express';
import { createUser, updateUser, deleteUser, listUsers } from '../controllers/user';


const router = Router();

// Create a new user
router.post('/', createUser);

// Search for users
router.get('/', listUsers);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

export default router;