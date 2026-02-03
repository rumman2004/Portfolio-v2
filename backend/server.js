// Load environment variables FIRST - Before any imports
import dotenv from 'dotenv';
dotenv.config();

// Verify environment variables loaded
console.log('🔧 Environment Variables Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   PORT:', process.env.PORT || 'not set');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ MISSING');
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ SET' : '❌ MISSING');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');
console.log('');

// Now import other modules
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import Admin from './model/Admin.js'; // Import Admin Model

const syncAdmin = async () => {
    try {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;

        const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            await Admin.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });
            console.log(`🔐 Admin Account Auto-Created`);
        }
    } catch (error) {
        console.error('❌ Admin Sync Error:', error.message);
    }
};

// Connect to database
connectDB();
syncAdmin();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_ALT,
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Portfolio API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Configured' : '✗ Not Configured',
        database: 'Connected',
        endpoints: {
            auth: '/api/auth',
            about: '/api/about',
            projects: '/api/projects',
            experiences: '/api/experiences',
            certificates: '/api/certificates',
            skills: '/api/skills',
            socials: '/api/socials',
            contacts: '/api/contacts'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/contacts', contactRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// --- AUTO-SYNC ADMIN FUNCTION ---

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}
export default app;