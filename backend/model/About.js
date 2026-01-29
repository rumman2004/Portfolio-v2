import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,

    // Primary Profile Image
    profileImage: {
        public_id: String,
        url: String
    },

    // NEW: Hero Slider Images (3-4 images)
    heroImages: [{
        public_id: String,
        url: String
    }],

    resume: {
        public_id: String,
        url: String
    },

    stats: {
        yearsExperience: { type: Number, default: 0 },
        projectsCompleted: { type: Number, default: 0 },
        certificatesEarned: { type: Number, default: 0 },
        happyClients: { type: Number, default: 0 }
    }
}, { timestamps: true });

const About = mongoose.model('About', aboutSchema);

export default About;
