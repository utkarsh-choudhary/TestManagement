import express from 'express';
import { auth, isAdmin, isHR } from '../middleware/auth.js';
import {
  inviteUser,
  completeRegistration,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', completeRegistration);

// Protected routes
router.post('/invite',auth,isHR,inviteUser);
router.get('/', auth, isHR, getAllUsers);
router.patch('/:userId/role', auth, isHR, updateUserRole);
router.delete('/:userId', auth, isAdmin, deleteUser);

export default router; 