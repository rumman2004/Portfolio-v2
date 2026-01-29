import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    shortDescription: {
        type: String,
        trim: true
    },
    image: {
        url: {
            type: String,
            required: [true, 'Project image is required']
        },
        public_id: String
    },
    technologies: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['web', 'mobile', 'fullstack', 'other'],
        default: 'web'
    },
    githubLink: {
        type: String,
        trim: true
    },
    liveLink: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
