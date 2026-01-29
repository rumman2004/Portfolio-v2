import Experience from '../model/Experience.js';

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ startDate: -1, order: 1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Public
export const getExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            data: experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create experience
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (req, res) => {
    try {
        console.log('📝 Creating experience with data:', req.body);

        // Handle responsibilities - it's already an array from frontend
        const experienceData = {
            ...req.body,
            // If responsibilities is already an array, use it; otherwise keep it as is
            responsibilities: Array.isArray(req.body.responsibilities)
                ? req.body.responsibilities
                : req.body.responsibilities || []
        };

        const experience = await Experience.create(experienceData);

        res.status(201).json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('❌ Error creating experience:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
export const updateExperience = async (req, res) => {
    try {
        console.log('📝 Updating experience with data:', req.body);

        // Handle responsibilities - it's already an array from frontend
        const updateData = {
            ...req.body,
            responsibilities: Array.isArray(req.body.responsibilities)
                ? req.body.responsibilities
                : req.body.responsibilities || undefined
        };

        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('❌ Error updating experience:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
export const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        await experience.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
