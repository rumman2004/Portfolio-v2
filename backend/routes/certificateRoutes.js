import express from 'express';
import {
    getCertificates,
    getCertificate,
    createCertificate,
    updateCertificate,
    deleteCertificate
} from '../controller/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCertificates);
router.get('/:id', getCertificate);

// Protected routes
router.post('/', protect, uploadSingle, handleUploadError, createCertificate);
router.put('/:id', protect, uploadSingle, handleUploadError, updateCertificate);
router.delete('/:id', protect, deleteCertificate);

export default router;
