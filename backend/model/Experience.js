import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    responsibilities: [{
        type: String
    }],
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
