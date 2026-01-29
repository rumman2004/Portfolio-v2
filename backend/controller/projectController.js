import Project from '../model/Project.js';
import { deleteImage } from '../utils/helpers.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const { category, featured } = req.query;

        let query = {};

        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';

        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            technologies: req.body.technologies ? JSON.parse(req.body.technologies) : []
        };

        if (req.file) {
            projectData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const project = await Project.create(projectData);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const updateData = {
            ...req.body,
            technologies: req.body.technologies ? JSON.parse(req.body.technologies) : project.technologies
        };

        // Handle new image upload
        if (req.file) {
            // Delete old image
            if (project.image?.public_id) {
                await deleteImage(project.image.public_id);
            }
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        project = await Project.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete image from cloudinary
        if (project.image?.public_id) {
            await deleteImage(project.image.public_id);
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
