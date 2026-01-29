import Contact from '../model/Contact.js';
import { sendAdminNotification, sendThankYouEmail } from '../utils/emailService.js';

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
    try {
        const { isRead, replied, page = 1, limit = 10 } = req.query;

        let query = {};
        if (isRead !== undefined) query.isRead = isRead === 'true';
        if (replied !== undefined) query.replied = replied === 'true';

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            count: contacts.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: contacts
        });
    } catch (error) {
        console.error('❌ Error in getContacts:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single contact message
// @route   GET /api/contacts/:id
// @access  Private
export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        // Mark as read when viewed
        if (!contact.isRead) {
            contact.isRead = true;
            await contact.save();
            console.log('📖 Message marked as read:', contact._id);
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('❌ Error in getContact:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create contact message
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message, phone } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create contact in database
        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject?.trim() || 'No Subject',
            message: message.trim(),
            phone: phone?.trim() || ''
        });

        console.log('✅ Contact message saved:', contact._id);

        // Send emails asynchronously (non-blocking)
        const emailPromises = [];

        // Send admin notification
        emailPromises.push(
            sendAdminNotification(contact)
                .then(() => console.log('📧 Admin notification sent'))
                .catch(error => console.error('⚠️ Failed to send admin notification:', error.message))
        );

        // Send thank you email to sender
        emailPromises.push(
            sendThankYouEmail(contact)
                .then(() => console.log('📧 Thank you email sent'))
                .catch(error => console.error('⚠️ Failed to send thank you email:', error.message))
        );

        // Don't wait for emails, respond immediately
        Promise.allSettled(emailPromises)
            .then(results => {
                const failedEmails = results.filter(r => r.status === 'rejected');
                if (failedEmails.length > 0) {
                    console.warn('⚠️ Some emails failed to send:', failedEmails.length);
                }
            });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! You will receive a confirmation email shortly.',
            data: contact
        });

    } catch (error) {
        console.error('❌ Error in createContact:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
};

// @desc    Mark contact as read
// @route   PATCH /api/contacts/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        console.log('📖 Marked as read:', contact._id);

        res.status(200).json({
            success: true,
            message: 'Message marked as read',
            data: contact
        });
    } catch (error) {
        console.error('❌ Error in markAsRead:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark contact as replied
// @route   PATCH /api/contacts/:id/replied
// @access  Private
export const markAsReplied = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { replied: true, isRead: true },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        console.log('✅ Marked as replied:', contact._id);

        res.status(200).json({
            success: true,
            message: 'Message marked as replied',
            data: contact
        });
    } catch (error) {
        console.error('❌ Error in markAsReplied:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await contact.deleteOne();
        console.log('🗑️ Contact deleted:', req.params.id);

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deleteContact:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get contact stats
// @route   GET /api/contacts/stats
// @access  Private
export const getContactStats = async (req, res) => {
    try {
        const total = await Contact.countDocuments();
        const unread = await Contact.countDocuments({ isRead: false });
        const replied = await Contact.countDocuments({ replied: true });

        res.status(200).json({
            success: true,
            data: {
                total,
                unread,
                read: total - unread,
                replied,
                pending: total - replied
            }
        });
    } catch (error) {
        console.error('❌ Error in getContactStats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Bulk mark as read
// @route   PATCH /api/contacts/bulk/read
// @access  Private
export const bulkMarkAsRead = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of contact IDs'
            });
        }

        const result = await Contact.updateMany(
            { _id: { $in: ids } },
            { isRead: true }
        );

        console.log(`📖 Bulk marked ${result.modifiedCount} messages as read`);

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} messages marked as read`,
            data: { modifiedCount: result.modifiedCount }
        });
    } catch (error) {
        console.error('❌ Error in bulkMarkAsRead:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Bulk delete contacts
// @route   DELETE /api/contacts/bulk
// @access  Private
export const bulkDeleteContacts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of contact IDs'
            });
        }

        const result = await Contact.deleteMany({ _id: { $in: ids } });

        console.log(`🗑️ Bulk deleted ${result.deletedCount} messages`);

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} messages deleted`,
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        console.error('❌ Error in bulkDeleteContacts:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
