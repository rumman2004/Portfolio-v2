import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: [true, 'Platform name is required'],
        trim: true,
        lowercase: true, // Convert to lowercase automatically
        enum: {
            values: [
                'github',
                'linkedin',
                'twitter',
                'instagram',
                'facebook',
                'youtube',
                'discord',
                'gmail',
                'email',
                'portfolio',
                'medium',
                'dev',
                'stackoverflow',
                'behance',
                'dribbble',
                'other'
            ],
            message: '{VALUE} is not a supported platform'
        }
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true,
        validate: {
            validator: function (v) {
                // Basic URL validation
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL starting with http:// or https://'
        }
    },
    icon: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    visible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
socialSchema.index({ visible: 1, order: 1 });

export default mongoose.model('Social', socialSchema);
