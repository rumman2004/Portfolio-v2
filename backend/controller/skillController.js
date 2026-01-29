import Skill from '../model/Skill.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
    try {
        const { category } = req.query;

        let query = {};
        if (category) query.category = category.toLowerCase();

        const skills = await Skill.find(query).sort({ order: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (error) {
        console.error('❌ Error in getSkills:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get skills by category
// @route   GET /api/skills/grouped
// @access  Public
export const getSkillsByCategory = async (req, res) => {
    try {
        const skills = await Skill.aggregate([
            {
                $group: {
                    _id: '$category',
                    skills: { $push: '$$ROOT' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (error) {
        console.error('❌ Error in getSkillsByCategory:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.status(200).json({
            success: true,
            data: skill
        });
    } catch (error) {
        console.error('❌ Error in getSkill:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
    try {
        const { name, category, proficiency, iconName } = req.body;

        console.log('📝 Creating skill:', { name, category, proficiency, iconName });

        // Validation
        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide skill name and category'
            });
        }

        // FIXED: Escape special regex characters in skill name
        const escapeRegExp = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        // Check for duplicate (case-insensitive)
        const escapedName = escapeRegExp(name.trim());
        const existingSkill = await Skill.findOne({
            name: new RegExp(`^${escapedName}$`, 'i')
        });

        if (existingSkill) {
            return res.status(400).json({
                success: false,
                message: 'A skill with this name already exists'
            });
        }

        const skillData = {
            name: name.trim(),
            category: category.toLowerCase(),
            proficiency: proficiency || 50,
            iconName: iconName?.toLowerCase() || ''
        };

        // Handle uploaded icon (if provided)
        if (req.file) {
            skillData.icon = {
                url: req.file.path,
                public_id: req.file.filename
            };
            console.log('📁 Icon uploaded:', skillData.icon);
        }

        const skill = await Skill.create(skillData);

        console.log('✅ Skill created successfully:', skill._id);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: skill
        });
    } catch (error) {
        console.error('❌ Error in createSkill:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A skill with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create skill'
        });
    }
};


// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
    try {
        let skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        const { name, category, proficiency, iconName } = req.body;

        console.log('📝 Updating skill:', req.params.id);

        // Prepare update data
        const updateData = {};

        if (name) updateData.name = name.trim();
        if (category) updateData.category = category.toLowerCase();
        if (proficiency !== undefined) updateData.proficiency = proficiency;
        if (iconName !== undefined) updateData.iconName = iconName.toLowerCase();

        // Handle new uploaded icon
        if (req.file) {
            // Delete old uploaded icon if exists
            if (skill.icon?.public_id) {
                try {
                    await deleteFromCloudinary(skill.icon.public_id);
                    console.log('🗑️ Deleted old skill icon');
                } catch (error) {
                    console.error('⚠️ Error deleting old icon:', error);
                }
            }

            updateData.icon = {
                url: req.file.path,
                public_id: req.file.filename
            };

            // Clear iconName if uploading custom icon
            updateData.iconName = '';

            console.log('📁 New icon uploaded:', updateData.icon);
        }

        skill = await Skill.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        console.log('✅ Skill updated successfully');

        res.status(200).json({
            success: true,
            message: 'Skill updated successfully',
            data: skill
        });
    } catch (error) {
        console.error('❌ Error in updateSkill:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A skill with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update skill'
        });
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        // Delete icon from Cloudinary if exists
        if (skill.icon?.public_id) {
            try {
                await deleteFromCloudinary(skill.icon.public_id);
                console.log('🗑️ Deleted skill icon from Cloudinary');
            } catch (error) {
                console.error('⚠️ Error deleting icon:', error);
            }
        }

        await skill.deleteOne();

        console.log('🗑️ Skill deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deleteSkill:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
