import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        lowercase: true,
        enum: {
            values: ['frontend', 'backend', 'database', 'tools', 'languages', 'other'],
            message: '{VALUE} is not a valid category'
        },
        default: 'other'
    },
    proficiency: {
        type: Number,
        min: [0, 'Proficiency must be at least 0'],
        max: [100, 'Proficiency cannot exceed 100'],
        default: 50
    },
    icon: {
        url: String,
        public_id: String
    },
    // NEW: For built-in icon support
    iconName: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better performance
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ name: 1 });

export default mongoose.model('Skill', skillSchema);
