import express from 'express';
import {
    getContacts,
    getContact,
    createContact,
    markAsRead,
    markAsReplied,
    deleteContact,
    getContactStats
} from '../controller/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createContact);

// Protected routes
router.get('/', protect, getContacts);
router.get('/stats', protect, getContactStats);
router.get('/:id', protect, getContact);
router.patch('/:id/read', protect, markAsRead);
router.patch('/:id/replied', protect, markAsReplied);
router.delete('/:id', protect, deleteContact);

export default router;
