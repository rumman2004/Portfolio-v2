import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Briefcase, Save, Upload, TrendingUp,
    Code, Award, Users, X, Trash2, Image as ImageIcon
} from 'lucide-react';
import { Input, Button, Textarea, GlassCard } from '../../components/ui';
import { aboutAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const EditAbout = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        stats: {
            yearsExperience: 2,
            projectsCompleted: 10,
            certificatesEarned: 5,
            happyClients: 10
        }
    });

    // Profile Image State
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [removeProfileImage, setRemoveProfileImage] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    // Resume State
    const [resume, setResume] = useState(null);
    const [currentResume, setCurrentResume] = useState(null);

    // Hero Slider State
    const [existingHeroImages, setExistingHeroImages] = useState([]);
    const [newHeroFiles, setNewHeroFiles] = useState([]);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const response = await aboutAPI.get();
            const data = response.data.data;

            if (data) {
                setFormData({
                    name: data.name || '',
                    title: data.title || '',
                    bio: data.bio || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    stats: {
                        yearsExperience: data.stats?.yearsExperience || 2,
                        projectsCompleted: data.stats?.projectsCompleted || 10,
                        certificatesEarned: data.stats?.certificatesEarned || 5,
                        happyClients: data.stats?.happyClients || 10
                    }
                });

                if (data.profileImage?.url) setProfileImagePreview(data.profileImage.url);
                if (data.resume?.url) setCurrentResume(data.resume.url);
                if (data.heroImages && Array.isArray(data.heroImages)) {
                    setExistingHeroImages(data.heroImages);
                }
            }
        } catch (error) {
            console.log('No about data yet, starting fresh');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStatsChange = (e) => {
        setFormData({
            ...formData,
            stats: { ...formData.stats, [e.target.name]: parseInt(e.target.value) || 0 }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
            setRemoveProfileImage(false);
        }
    };

    const handleRemoveProfileImage = () => {
        setShowRemoveConfirm(false);
        setProfileImagePreview('');
        setProfileImage(null);
        setRemoveProfileImage(true);
        toast.success('Profile image will be removed on save');
    };

    const handleHeroFilesChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingHeroImages.length + newHeroFiles.length + files.length;

        if (totalImages > 5) {
            toast.error('You can only have a maximum of 5 Hero Images.');
            return;
        }

        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (Max 5MB)`);
                return false;
            }
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not a valid image`);
                return false;
            }
            return true;
        });

        setNewHeroFiles(prev => [...prev, ...validFiles]);
    };

    const removeNewHeroFile = (index) => {
        setNewHeroFiles(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingHeroImage = async (image) => {
        // Use _id (database ID) if available, otherwise fallback to public_id
        const imageId = image._id || image.public_id;

        if (!imageId) {
            // If no ID exists, just remove from UI
            setExistingHeroImages(prev => prev.filter(img => img !== image));
            toast.success("Removed from list (save to persist)");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            // Build the correct API URL
            const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const cleanHost = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
            const url = `${cleanHost}/api/about/hero-image/${imageId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Image deleted successfully");
                // Remove from state using the same ID we sent
                setExistingHeroImages(prev =>
                    prev.filter(img => (img._id || img.public_id) !== imageId)
                );
            } else {
                toast.error(data.message || "Failed to delete image");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Server error while deleting image");
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            if (!file.type.includes('pdf') && !file.type.includes('document')) {
                toast.error('Only PDF and DOC files are allowed');
                return;
            }
            setResume(file);
            toast.success('Resume selected');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim() || !formData.title.trim() || !formData.email.trim() || !formData.bio.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        try {
            const data = new FormData();

            // Add basic data
            data.append('name', formData.name.trim());
            data.append('title', formData.title.trim());
            data.append('bio', formData.bio.trim());
            data.append('email', formData.email.trim());

            if (formData.phone) data.append('phone', formData.phone.trim());
            if (formData.location) data.append('location', formData.location.trim());

            // Add stats
            data.append('stats', JSON.stringify(formData.stats));

            // Add flags and files
            if (removeProfileImage) {
                data.append('removeProfileImage', 'true');
            }

            if (profileImage) {
                data.append('profileImage', profileImage);
            }

            if (resume) {
                data.append('resume', resume);
            }

            // Add new hero images
            newHeroFiles.forEach((file) => {
                data.append('heroImages', file);
            });

            console.log('Submitting form data...');

            const response = await aboutAPI.update(data);

            if (response.data.success) {
                toast.success('About information updated successfully!');

                // Reset file states
                setProfileImage(null);
                setResume(null);
                setNewHeroFiles([]);
                setRemoveProfileImage(false);

                // Refresh data
                await fetchAbout();
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Failed to update about information');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Edit About Section</h1>
                <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                    Update your personal information, profile, and homepage stats
                </p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* HERO SLIDER IMAGES */}
                        <div className="pb-6 border-b border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                                Hero Slider Images (Max 5)
                            </h3>
                            <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">
                                Upload 3-5 images for your homepage hero slider
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {/* Existing Hero Images */}
                                {existingHeroImages.map((img, index) => (
                                    <div
                                        key={img._id || img.public_id || `existing-${index}`}
                                        className="relative group aspect-video rounded-lg overflow-hidden border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] transition-colors"
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Hero ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingHeroImage(img)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Delete image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* New Hero Files Preview */}
                                {newHeroFiles.map((file, index) => (
                                    <div
                                        key={`new-${index}`}
                                        className="relative group aspect-video rounded-lg overflow-hidden border-2 border-dashed border-[rgb(var(--accent))]"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <span className="text-xs font-bold text-white bg-[rgb(var(--accent))] px-2 py-1 rounded-full">
                                                NEW
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewHeroFile(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            title="Remove"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                {(existingHeroImages.length + newHeroFiles.length) < 5 && (
                                    <label className="border-2 border-dashed border-[rgb(var(--border))] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--accent))] transition-colors aspect-video bg-[rgb(var(--bg-secondary))]/30">
                                        <Upload className="w-6 h-6 mb-2" />
                                        <span className="text-xs font-medium">Add Image</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleHeroFilesChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* PROFILE IMAGE */}
                        <div className="pb-6 border-b border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Profile Image</h3>

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Image Preview */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[rgb(var(--accent))]/20 bg-[rgb(var(--bg-secondary))]">
                                        {profileImagePreview ? (
                                            <img
                                                src={profileImagePreview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-16 h-16 text-[rgb(var(--text-secondary))]/50" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Controls */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex gap-3">
                                        <label className="cursor-pointer">
                                            <div className="px-4 py-2 bg-[rgb(var(--accent))] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm font-medium">Upload New</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>

                                        {profileImagePreview && (
                                            <button
                                                type="button"
                                                onClick={() => setShowRemoveConfirm(true)}
                                                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-sm font-medium">Remove</span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-[rgb(var(--text-secondary))]">
                                        Recommended: Square image, min 400x400px, max 5MB
                                    </p>
                                </div>
                            </div>

                            {/* Remove Confirmation Modal */}
                            <AnimatePresence>
                                {showRemoveConfirm && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                        onClick={() => setShowRemoveConfirm(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0.9 }}
                                            className="bg-[rgb(var(--bg-card))] rounded-2xl p-6 max-w-sm w-full border border-[rgb(var(--border))]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <h3 className="text-lg font-bold mb-2">Remove Profile Image?</h3>
                                            <p className="text-sm text-[rgb(var(--text-secondary))] mb-6">
                                                This will remove your current profile image. You can upload a new one anytime.
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleRemoveProfileImage}
                                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                                <button
                                                    onClick={() => setShowRemoveConfirm(false)}
                                                    className="flex-1 px-4 py-2 border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--bg-secondary))] transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RESUME UPLOAD */}
                        <div className="pb-6 border-b border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Resume/CV</h3>

                            <div className="space-y-3">
                                {currentResume && (
                                    <div className="flex items-center gap-3 p-3 bg-[rgb(var(--bg-secondary))]/30 rounded-lg">
                                        <Award className="w-5 h-5 text-[rgb(var(--accent))]" />
                                        <span className="text-sm flex-1">Current resume uploaded</span>
                                        <a
                                            href={currentResume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[rgb(var(--accent))] hover:underline"
                                        >
                                            View
                                        </a>
                                    </div>
                                )}

                                <label className="cursor-pointer inline-block">
                                    <div className="px-4 py-2 border-2 border-dashed border-[rgb(var(--border))] rounded-lg hover:border-[rgb(var(--accent))] transition-colors flex items-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            {resume ? resume.name : 'Upload New Resume'}
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-[rgb(var(--text-secondary))]">
                                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                                </p>
                            </div>
                        </div>

                        {/* PERSONAL INFO & STATS */}
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold">Personal Information</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={User}
                                    required
                                />
                                <Input
                                    label="Professional Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    icon={Briefcase}
                                    required
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={Mail}
                                    required
                                />
                                <Input
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={Phone}
                                />
                                <Input
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    icon={MapPin}
                                />
                            </div>
                            <Textarea
                                label="Bio / About Me"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </div>

                        {/* HOMEPAGE STATISTICS */}
                        <div className="space-y-4 pt-6 border-t border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold">Homepage Statistics</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Years of Experience"
                                    type="number"
                                    name="yearsExperience"
                                    value={formData.stats.yearsExperience}
                                    onChange={handleStatsChange}
                                    icon={Briefcase}
                                    min="0"
                                />
                                <Input
                                    label="Projects Completed"
                                    type="number"
                                    name="projectsCompleted"
                                    value={formData.stats.projectsCompleted}
                                    onChange={handleStatsChange}
                                    icon={Code}
                                    min="0"
                                />
                                <Input
                                    label="Certificates Earned"
                                    type="number"
                                    name="certificatesEarned"
                                    value={formData.stats.certificatesEarned}
                                    onChange={handleStatsChange}
                                    icon={Award}
                                    min="0"
                                />
                                <Input
                                    label="Happy Clients"
                                    type="number"
                                    name="happyClients"
                                    value={formData.stats.happyClients}
                                    onChange={handleStatsChange}
                                    icon={Users}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <div className="pt-6 border-t border-[rgb(var(--border))]">
                            <Button
                                type="submit"
                                loading={submitting}
                                disabled={submitting}
                                icon={Save}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                {submitting ? 'Saving Changes...' : 'Save All Changes'}
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default EditAbout;