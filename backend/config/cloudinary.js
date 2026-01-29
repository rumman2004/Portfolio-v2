import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage
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

// --- FIXED: Handle Single AND Multiple Files ---
export const uploadToCloudinary = async (req, res, next) => {
    // 1. Collect all files (whether single 'req.file' or multiple 'req.files')
    let files = [];

    if (req.file) files.push(req.file);
    if (req.files) {
        if (Array.isArray(req.files)) {
            files = [...files, ...req.files];
        } else {
            // req.files is an object like { profileImage: [...], heroImages: [...] }
            Object.values(req.files).forEach(fileArray => {
                files = [...files, ...fileArray];
            });
        }
    }

    if (files.length === 0) return next();

    // 2. Define the upload function for a single file
    const uploadStream = (file) => {
        return new Promise((resolve, reject) => {
            const isRaw = file.mimetype.includes('svg') || file.mimetype.includes('pdf') || file.mimetype.includes('document');

            const options = {
                folder: 'portfolio',
                resource_type: isRaw ? 'raw' : 'image',
                public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
            };

            const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);

                // Attach Cloudinary data to the file object so the controller can use it
                file.path = result.secure_url;
                file.filename = result.public_id;
                resolve(result);
            });

            // Pipe buffer to stream
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            bufferStream.pipe(stream);
        });
    };

    // 3. Process all uploads in parallel
    try {
        console.log(`📤 Uploading ${files.length} file(s) to Cloudinary...`);
        await Promise.all(files.map(file => uploadStream(file)));
        console.log('✅ All files uploaded successfully');
        next();
    } catch (error) {
        console.error('❌ Cloudinary Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;

        let resourceType = 'image';
        if (publicId.toLowerCase().includes('.svg') ||
            publicId.toLowerCase().includes('.pdf') ||
            publicId.toLowerCase().includes('.doc')) {
            resourceType = 'raw';
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });
        return result;
    } catch (error) {
        console.error('Delete Error:', error);
    }
};

export default cloudinary;