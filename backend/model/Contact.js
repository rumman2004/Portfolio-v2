import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    subject: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    phone: {
        type: String,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    replied: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
