import About from '../model/About.js';
import { deleteImage } from '../utils/helpers.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get about info
// @route   GET /api/about
export const getAbout = async (req, res) => {
    try {
        const about = await About.findOne();
        res.status(200).json({ success: true, data: about });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create or update about info
// @route   POST /api/about
export const createOrUpdateAbout = async (req, res) => {
    try {
        let about = await About.findOne();

        // Basic Data
        const aboutData = {
            name: req.body.name,
            title: req.body.title,
            bio: req.body.bio,
            email: req.body.email,
            phone: req.body.phone,
            location: req.body.location,
        };

        if (req.body.stats) aboutData.stats = JSON.parse(req.body.stats);

        // --- HANDLE IMAGES ---

        // 1. Profile Image
        if (req.files?.profileImage) {
            if (about?.profileImage?.public_id) {
                await deleteFromCloudinary(about.profileImage.public_id);
            }
            aboutData.profileImage = {
                url: req.files.profileImage[0].path,
                public_id: req.files.profileImage[0].filename
            };
        }

        // 2. Resume
        if (req.files?.resume) {
            if (about?.resume?.public_id) {
                await deleteFromCloudinary(about.resume.public_id);
            }
            aboutData.resume = {
                url: req.files.resume[0].path,
                public_id: req.files.resume[0].filename
            };
        }

        // 3. Hero Images (Append new ones to existing list)
        let currentHeroImages = about ? [...about.heroImages] : [];

        if (req.files?.heroImages) {
            const newImages = req.files.heroImages.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
            currentHeroImages = [...currentHeroImages, ...newImages];
        }

        aboutData.heroImages = currentHeroImages;

        // --- SAVE ---
        if (about) {
            about = await About.findOneAndUpdate({}, aboutData, { new: true });
        } else {
            about = await About.create(aboutData);
        }

        res.status(200).json({ success: true, data: about });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete specific hero image
// @route   DELETE /api/about/hero-image/:id
export const deleteHeroImage = async (req, res) => {
    try {
        const about = await About.findOne();
        const imageId = req.params.id; // Could be public_id or _id

        // FIX: Find by _id (database ID) OR public_id (Cloudinary ID)
        // This handles legacy/ghost images that might not have a public_id
        const imageToDelete = about.heroImages.find(img =>
            (img._id && img._id.toString() === imageId) ||
            img.public_id === imageId
        );

        if (imageToDelete) {
            // Only try to delete from Cloudinary if it actually has a valid public_id
            if (imageToDelete.public_id) {
                await deleteFromCloudinary(imageToDelete.public_id);
            }

            // Remove from array (filtering out the match)
            about.heroImages = about.heroImages.filter(img =>
                !((img._id && img._id.toString() === imageId) || img.public_id === imageId)
            );

            await about.save();
        } else {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        res.status(200).json({ success: true, data: about });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete profile image
// @route   DELETE /api/about/profile-image
// @access  Private
export const deleteProfileImage = async (req, res) => {
    try {
        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: 'About information not found'
            });
        }

        if (!about.profileImage?.public_id) {
            return res.status(404).json({
                success: false,
                message: 'No profile image found'
            });
        }

        // Delete from Cloudinary
        try {
            await deleteImage(about.profileImage.public_id);
            console.log('🗑️ Deleted profile image from Cloudinary');
        } catch (error) {
            console.error('⚠️ Error deleting profile image from Cloudinary:', error);
        }

        // Update database
        about.profileImage = {
            url: '',
            public_id: ''
        };
        await about.save();

        res.status(200).json({
            success: true,
            message: 'Profile image deleted successfully',
            data: about
        });
    } catch (error) {
        console.error('❌ Error in deleteProfileImage:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while deleting profile image'
        });
    }
};

// @desc    Delete resume
// @route   DELETE /api/about/resume
// @access  Private
export const deleteResume = async (req, res) => {
    try {
        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: 'About information not found'
            });
        }

        if (!about.resume?.public_id) {
            return res.status(404).json({
                success: false,
                message: 'No resume found'
            });
        }

        // Delete from Cloudinary
        try {
            await deleteImage(about.resume.public_id);
            console.log('🗑️ Deleted resume from Cloudinary');
        } catch (error) {
            console.error('⚠️ Error deleting resume from Cloudinary:', error);
        }

        // Update database
        about.resume = {
            url: '',
            public_id: ''
        };
        await about.save();

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully',
            data: about
        });
    } catch (error) {
        console.error('❌ Error in deleteResume:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while deleting resume'
        });
    }
};