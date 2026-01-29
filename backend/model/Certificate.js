import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Certificate title is required'],
        trim: true
    },
    issuer: {
        type: String,
        required: [true, 'Issuer is required'],
        trim: true
    },
    issueDate: {
        type: Date,
        required: [true, 'Issue date is required']
    },
    expiryDate: {
        type: Date
    },
    credentialId: {
        type: String,
        trim: true
    },
    credentialUrl: {
        type: String,
        trim: true
    },
    image: {
        url: {
            type: String,
            required: [true, 'Certificate image is required']
        },
        public_id: String
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
