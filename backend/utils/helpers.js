import cloudinary from '../config/cloudinary.js';

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise}
 */
export const deleteImage = async (publicId) => {
    try {
        if (!publicId) {
            console.warn('⚠️ No public_id provided for deletion');
            return;
        }

        // Determine resource type
        let resourceType = 'image';

        // Check if it's a raw file (SVG, PDF, etc.)
        if (publicId.includes('.svg') ||
            publicId.includes('.pdf') ||
            publicId.includes('.doc') ||
            publicId.startsWith('portfolio/') && !publicId.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            resourceType = 'raw';
        }

        console.log(`🗑️ Deleting ${resourceType} from Cloudinary:`, publicId);

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true // Clear CDN cache
        });

        if (result.result === 'ok' || result.result === 'not found') {
            console.log('✅ Cloudinary deletion successful:', result);
            return result;
        } else {
            console.warn('⚠️ Unexpected Cloudinary deletion result:', result);
            return result;
        }
    } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error);
        throw error;
    }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public_ids to delete
 * @returns {Promise}
 */
export const deleteMultipleImages = async (publicIds) => {
    try {
        if (!publicIds || publicIds.length === 0) {
            console.warn('⚠️ No public_ids provided for deletion');
            return;
        }

        const deletePromises = publicIds.map(publicId => deleteImage(publicId));
        const results = await Promise.allSettled(deletePromises);

        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        console.log(`✅ Deleted ${successful}/${publicIds.length} images. Failed: ${failed}`);

        return results;
    } catch (error) {
        console.error('❌ Error deleting multiple images:', error);
        throw error;
    }
};

