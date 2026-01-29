import Certificate from '../model/Certificate.js';
import { deleteImage } from '../utils/helpers.js';

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
export const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ issueDate: -1, order: 1 });

        res.status(200).json({
            success: true,
            count: certificates.length,
            data: certificates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        res.status(200).json({
            success: true,
            data: certificate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private
export const createCertificate = async (req, res) => {
    try {
        const certificateData = { ...req.body };

        if (req.file) {
            certificateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const certificate = await Certificate.create(certificateData);

        res.status(201).json({
            success: true,
            data: certificate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
export const updateCertificate = async (req, res) => {
    try {
        let certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (certificate.image?.public_id) {
                await deleteImage(certificate.image.public_id);
            }
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        certificate = await Certificate.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: certificate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
export const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        if (certificate.image?.public_id) {
            await deleteImage(certificate.image.public_id);
        }

        await certificate.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
