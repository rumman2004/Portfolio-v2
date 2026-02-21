import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import multer from 'multer';

// Single image upload with Cloudinary
export const uploadSingle = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) return handleUploadError(err, req, res, next);
        uploadToCloudinary(req, res, next);
    });
};

// Multiple images upload
export const uploadMultiple = (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) return handleUploadError(err, req, res, next);
        uploadToCloudinary(req, res, next);
    });
};

// --- CRITICAL FIX: Added heroImages to allowed fields ---
export const uploadFields = (req, res, next) => {
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'heroImages', maxCount: 5 } // THIS WAS MISSING
    ])(req, res, (err) => {
        if (err) return handleUploadError(err, req, res, next);
        uploadToCloudinary(req, res, next);
    });
};

// Handle multer errors
export const handleUploadError = (err, req, res, next) => {
    if (err) {
        console.error('❌ Upload error:', err.message);

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File size is too large. Maximum size is 5MB' });
            if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ success: false, message: 'Too many files.' });
            if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ success: false, message: 'Unexpected field in file upload.' });
            return res.status(400).json({ success: false, message: err.message || 'File upload error' });
        }
        return res.status(400).json({ success: false, message: err.message || 'Server error during file upload' });
    }
    next();
};