import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}`), false);
        }
    },
});

export const uploadToCloudinary = async (req, res, next) => {
    let files = [];
    if (req.file) files.push(req.file);
    if (req.files) {
        if (Array.isArray(req.files)) {
            files = [...files, ...req.files];
        } else {
            Object.values(req.files).forEach(fileArray => {
                files = [...files, ...fileArray];
            });
        }
    }

    if (files.length === 0) return next();

    const uploadStream = (file) => {
        return new Promise((resolve, reject) => {
            // --- FIX: Use 'auto' to let Cloudinary handle PDFs vs Images natively ---
            const options = {
                folder: 'portfolio',
                resource_type: 'auto', 
                public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
            };

            const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);
                file.path = result.secure_url;
                file.filename = result.public_id;
                resolve(result);
            });

            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            bufferStream.pipe(stream);
        });
    };

    try {
        await Promise.all(files.map(file => uploadStream(file)));
        next();
    } catch (error) {
        console.error('❌ Cloudinary Upload Error:', error);
        res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        
        // --- FIX: Try deleting as image first, fallback to raw if it's a doc ---
        let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        
        if (result.result === 'not found') {
            result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }
        
        return result;
    } catch (error) {
        console.error('Delete Error:', error);
    }
};

export default cloudinary;