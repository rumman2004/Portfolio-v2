import nodemailer from 'nodemailer';

// Create transporter with Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail
            pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
        },
    });
};

// Send email to admin (you)
export const sendAdminNotification = async (contactData) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL, // Your email
        subject: `New Contact Form Submission: ${contactData.subject}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .info-row {
                        margin: 15px 0;
                        padding: 10px;
                        background: white;
                        border-radius: 5px;
                    }
                    .label {
                        font-weight: bold;
                        color: #667eea;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .message-box {
                        background: white;
                        padding: 15px;
                        border-left: 4px solid #667eea;
                        margin-top: 20px;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎉 New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <p>You have received a new message from your portfolio website!</p>
                    
                    <div class="info-row">
                        <span class="label">👤 Name:</span>
                        ${contactData.name}
                    </div>
                    
                    <div class="info-row">
                        <span class="label">📧 Email:</span>
                        <a href="mailto:${contactData.email}">${contactData.email}</a>
                    </div>
                    
                    ${contactData.phone ? `
                        <div class="info-row">
                            <span class="label">📱 Phone:</span>
                            <a href="tel:${contactData.phone}">${contactData.phone}</a>
                        </div>
                    ` : ''}
                    
                    <div class="info-row">
                        <span class="label">📋 Subject:</span>
                        ${contactData.subject}
                    </div>
                    
                    <div class="message-box">
                        <span class="label">💬 Message:</span>
                        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <div class="info-row">
                        <span class="label">⏰ Received:</span>
                        ${new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        })}
                    </div>
                </div>
                <div class="footer">
                    <p>This email was sent from your portfolio contact form</p>
                </div>
            </body>
            </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending admin notification:', error);
        throw error;
    }
};

// Send thank you email to sender
export const sendThankYouEmail = async (contactData) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.YOUR_NAME || 'Your Name'}" <${process.env.EMAIL_USER}>`,
        to: contactData.email,
        subject: 'Thank you for contacting me! 🙏',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .message-preview {
                        background: white;
                        padding: 20px;
                        border-left: 4px solid #667eea;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✨ Thank You for Reaching Out!</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>${contactData.name}</strong>,</p>
                    
                    <p>Thank you for contacting me through my portfolio website! I appreciate you taking the time to reach out.</p>
                    
                    <p>I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
                    
                    <div class="message-preview">
                        <h3 style="color: #667eea; margin-top: 0;">📋 Your Message Summary:</h3>
                        <p><strong>Subject:</strong> ${contactData.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="color: #666;">${contactData.message.substring(0, 150)}${contactData.message.length > 150 ? '...' : ''}</p>
                    </div>
                    
                    <p>In the meantime, feel free to:</p>
                    <ul>
                        <li>Check out my latest projects on my portfolio</li>
                        <li>Connect with me on social media</li>
                        <li>Browse my blog for more insights</li>
                    </ul>
                    
                    <center>
                        <a href="${process.env.PORTFOLIO_URL || 'https://yourwebsite.com'}" class="cta-button">
                            Visit My Portfolio
                        </a>
                    </center>
                    
                    <p style="margin-top: 30px;">Best regards,<br>
                    <strong>${process.env.YOUR_NAME || 'Your Name'}</strong></p>
                </div>
                <div class="footer">
                    <p>This is an automated response. Please do not reply to this email.</p>
                    <p>© ${new Date().getFullYear()} ${process.env.YOUR_NAME || 'Your Name'}. All rights reserved.</p>
                </div>
            </body>
            </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Thank you email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending thank you email:', error);
        throw error;
    }
};
