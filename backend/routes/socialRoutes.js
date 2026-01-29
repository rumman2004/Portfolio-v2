import express from 'express';
import {
    getSocials,
    getSocial,
    createSocial,
    updateSocial,
    deleteSocial,
    toggleSocialVisibility,
    reorderSocials
} from '../controller/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getSocials);
router.get('/:id', getSocial);

// Protected routes
router.post('/', protect, createSocial);
router.put('/:id', protect, updateSocial);
router.delete('/:id', protect, deleteSocial);
router.patch('/:id/toggle', protect, toggleSocialVisibility);
router.patch('/reorder', protect, reorderSocials);

export default router;
