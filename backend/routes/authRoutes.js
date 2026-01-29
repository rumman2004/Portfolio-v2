import express from 'express';
import {
    loginAdmin,
    getAdminProfile,
    updateAdminProfile
} from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);

export default router;
