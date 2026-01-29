import express from 'express';
import {
    getExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
} from '../controller/experienceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperience);

// Protected routes
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

export default router;
