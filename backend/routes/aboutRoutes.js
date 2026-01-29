import express from 'express';
import {
    getAbout,
    createOrUpdateAbout,
    deleteProfileImage,
    deleteHeroImage, // NEW Route
    deleteResume
} from '../controller/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js'; // Import directly from config
import { handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Define Upload Fields
const uploadFields = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'heroImages', maxCount: 5 } // NEW: Allows up to 5 slider images
]);

// Routes
router.get('/', getAbout);

router.post(
    '/',
    protect,
    uploadFields,
    handleUploadError,
    createOrUpdateAbout
);

router.delete('/profile-image', protect, deleteProfileImage);
router.delete('/resume', protect, deleteResume);
router.delete('/hero-image/:id', protect, deleteHeroImage); // NEW: Delete specific slider image

export default router;