import express from 'express';
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} from '../controller/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, uploadSingle, handleUploadError, createProject);
router.put('/:id', protect, uploadSingle, handleUploadError, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
