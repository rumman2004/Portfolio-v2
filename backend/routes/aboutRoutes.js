import express from 'express';
import {
    getAbout,
    createOrUpdateAbout,
    deleteProfileImage,
    deleteHeroImage,
    deleteResume
} from '../controller/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js'; // ✅ import uploadToCloudinary
import { handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const uploadFields = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'heroImages', maxCount: 5 }
]);

// Routes
router.get('/', getAbout);

router.post(
    '/',
    protect,
    uploadFields,
    handleUploadError,
    uploadToCloudinary,   // ✅ THIS IS THE MISSING PIECE
    createOrUpdateAbout
);

router.delete('/profile-image', protect, deleteProfileImage);
router.delete('/resume', protect, deleteResume);
router.delete('/hero-image/:id', protect, deleteHeroImage);

export default router;