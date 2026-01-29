import Social from '../model/Social.js';

// @desc    Get all social links
// @route   GET /api/socials
// @access  Public
export const getSocials = async (req, res) => {
    try {
        const { visible } = req.query;

        let query = {};
        if (visible !== undefined) query.visible = visible === 'true';

        const socials = await Social.find(query).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: socials.length,
            data: socials
        });
    } catch (error) {
        console.error('❌ Error in getSocials:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single social link
// @route   GET /api/socials/:id
// @access  Public
export const getSocial = async (req, res) => {
    try {
        const social = await Social.findById(req.params.id);

        if (!social) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }

        res.status(200).json({
            success: true,
            data: social
        });
    } catch (error) {
        console.error('❌ Error in getSocial:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create social link
// @route   POST /api/socials
// @access  Private
export const createSocial = async (req, res) => {
    try {
        const { platform, url, username } = req.body;

        // Validation
        if (!platform || !url) {
            return res.status(400).json({
                success: false,
                message: 'Please provide platform and URL'
            });
        }

        // Check for duplicates
        const existingSocial = await Social.findOne({
            platform: platform.toLowerCase()
        });

        if (existingSocial) {
            return res.status(400).json({
                success: false,
                message: `${platform} profile already exists. Please update the existing one.`
            });
        }

        const social = await Social.create({
            platform: platform.toLowerCase(),
            url: url.trim(),
            username: username?.trim() || ''
        });

        console.log('✅ Social link created:', social._id);

        res.status(201).json({
            success: true,
            message: 'Social link created successfully',
            data: social
        });
    } catch (error) {
        console.error('❌ Error in createSocial:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create social link'
        });
    }
};

// @desc    Update social link
// @route   PUT /api/socials/:id
// @access  Private
export const updateSocial = async (req, res) => {
    try {
        const { platform, url, username } = req.body;

        // Check if social exists
        const social = await Social.findById(req.params.id);

        if (!social) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }

        // Update fields
        if (platform) social.platform = platform.toLowerCase();
        if (url) social.url = url.trim();
        if (username !== undefined) social.username = username.trim();

        await social.save();

        console.log('✅ Social link updated:', social._id);

        res.status(200).json({
            success: true,
            message: 'Social link updated successfully',
            data: social
        });
    } catch (error) {
        console.error('❌ Error in updateSocial:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update social link'
        });
    }
};

// @desc    Delete social link
// @route   DELETE /api/socials/:id
// @access  Private
export const deleteSocial = async (req, res) => {
    try {
        const social = await Social.findById(req.params.id);

        if (!social) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }

        await social.deleteOne();

        console.log('🗑️ Social link deleted:', req.params.id);

        res.status(200).json({
            success: true,
            message: 'Social link deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deleteSocial:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Toggle social visibility
// @route   PATCH /api/socials/:id/toggle
// @access  Private
export const toggleSocialVisibility = async (req, res) => {
    try {
        const social = await Social.findById(req.params.id);

        if (!social) {
            return res.status(404).json({
                success: false,
                message: 'Social link not found'
            });
        }

        social.visible = !social.visible;
        await social.save();

        console.log(`👁️ Social visibility toggled to ${social.visible}:`, social._id);

        res.status(200).json({
            success: true,
            message: `Social link ${social.visible ? 'shown' : 'hidden'} successfully`,
            data: social
        });
    } catch (error) {
        console.error('❌ Error in toggleSocialVisibility:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reorder socials
// @route   PATCH /api/socials/reorder
// @access  Private
export const reorderSocials = async (req, res) => {
    try {
        const { orderedIds } = req.body;

        if (!orderedIds || !Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of social IDs'
            });
        }

        // Update order for each social
        const updatePromises = orderedIds.map((id, index) =>
            Social.findByIdAndUpdate(id, { order: index })
        );

        await Promise.all(updatePromises);

        console.log('🔄 Socials reordered');

        res.status(200).json({
            success: true,
            message: 'Socials reordered successfully'
        });
    } catch (error) {
        console.error('❌ Error in reorderSocials:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
