import dotenv from 'dotenv';
import { sendAdminNotification, sendThankYouEmail } from './utils/emailService.js';

dotenv.config();

const testData = {
    name: 'Test User',
    email: 'sahnazy99@gmail.com',
    subject: 'Test Email',
    message: 'This is a test message to verify email functionality.',
    phone: '+1234567890'
};

console.log('📧 Testing email configuration...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Admin Email:', process.env.ADMIN_EMAIL);

// Test admin notification
sendAdminNotification(testData)
    .then(() => {
        console.log('✅ Admin email sent successfully!');
        // Test thank you email
        return sendThankYouEmail(testData);
    })
    .then(() => {
        console.log('✅ Thank you email sent successfully!');
        console.log('🎉 All emails working!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Email test failed:', error);
        process.exit(1);
    });
