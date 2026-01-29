import express from 'express';
import {
    getSkills,
    getSkillsByCategory,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill
} from '../controller/skillController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes - ORDER MATTERS!
router.get('/grouped', getSkillsByCategory); // This must come BEFORE /:id
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes
router.post('/', protect, uploadSingle, handleUploadError, createSkill);
router.put('/:id', protect, uploadSingle, handleUploadError, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;
