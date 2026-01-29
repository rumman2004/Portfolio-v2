import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button, Modal, Input, GlassCard, Badge } from '../../components/ui';
import { socialsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import { socialIconMap } from '../../components/icons/SocialIcons';

const ManageSocials = () => {
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSocial, setEditingSocial] = useState(null);
    const [formData, setFormData] = useState({
        platform: 'github',
        url: '',
        username: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const response = await socialsAPI.getAll();
            setSocials(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch social links');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (social = null) => {
        if (social) {
            setEditingSocial(social);
            setFormData({
                platform: social.platform,
                url: social.url,
                username: social.username || '',
            });
        } else {
            setEditingSocial(null);
            setFormData({
                platform: 'github',
                url: '',
                username: '',
            });
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingSocial) {
                await socialsAPI.update(editingSocial._id, formData);
                toast.success('Social link updated successfully');
            } else {
                await socialsAPI.create(formData);
                toast.success('Social link created successfully');
            }

            setModalOpen(false);
            fetchSocials();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this social link?')) return;

        try {
            await socialsAPI.delete(id);
            toast.success('Social link deleted successfully');
            fetchSocials();
        } catch (error) {
            toast.error('Failed to delete social link');
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await socialsAPI.toggleVisibility(id);
            // Optimistic update or refetch
            fetchSocials();
            toast.success('Visibility updated');
        } catch (error) {
            toast.error('Failed to update visibility');
        }
    };

    // Get icon component for platform
    const getIcon = (platform) => {
        const key = platform.toLowerCase();
        return socialIconMap[key] || socialIconMap.other || socialIconMap.github;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Social Links</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Manage your social media presence
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-lg shadow-[rgb(var(--accent))]/20">
                    Add Link
                </Button>
            </div>

            {/* Socials Grid */}
            {socials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {socials.map((social, index) => {
                            const Icon = getIcon(social.platform);

                            return (
                                <motion.div
                                    key={social._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <GlassCard className="h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Platform Icon Box */}
                                            <div className="p-3.5 glass rounded-xl flex-shrink-0 bg-[rgb(var(--bg-secondary))]/50">
                                                <Icon className="w-8 h-8 text-[rgb(var(--text-primary))]" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-lg font-bold capitalize truncate pr-2">
                                                        {social.platform}
                                                    </h3>
                                                    <Badge variant={social.visible ? 'success' : 'default'} className="flex-shrink-0">
                                                        {social.visible ? 'Visible' : 'Hidden'}
                                                    </Badge>
                                                </div>
                                                {social.username && (
                                                    <p className="text-sm text-[rgb(var(--text-secondary))] truncate">
                                                        @{social.username}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <a
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[rgb(var(--accent))] hover:underline break-all mb-4"
                                            >
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                {social.url}
                                            </a>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[rgb(var(--border))]">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleVisibility(social._id)}
                                                className="w-full justify-center"
                                            >
                                                {social.visible ? (
                                                    <><EyeOff className="w-4 h-4 mr-2" /> Hide</>
                                                ) : (
                                                    <><Eye className="w-4 h-4 mr-2" /> Show</>
                                                )}
                                            </Button>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    icon={Edit}
                                                    onClick={() => handleOpenModal(social)}
                                                    className="flex-1 justify-center"
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={() => handleDelete(social._id)}
                                                    className="flex-1 justify-center"
                                                />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                    <p className="text-[rgb(var(--text-secondary))] text-lg mb-4">
                        No social links yet. Add your first link!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Social Link
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSocial ? 'Edit Link' : 'Add Link'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Platform
                        </label>
                        <select
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                        >
                            <option value="github">GitHub</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">X (Twitter)</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">YouTube</option>
                            <option value="discord">Discord</option>
                            <option value="gmail">Gmail</option>
                            <option value="medium">Medium</option>
                            <option value="dev">Dev.to</option>
                            <option value="stackoverflow">Stack Overflow</option>
                            <option value="behance">Behance</option>
                            <option value="dribbble">Dribbble</option>
                            <option value="portfolio">Portfolio Website</option>
                            <option value="other">Other</option>
                        </select>

                        {/* Icon Preview */}
                        <div className="mt-3 p-3 bg-[rgb(var(--bg-secondary))]/50 rounded-lg flex items-center gap-3 border border-[rgb(var(--border))]">
                            {(() => {
                                const PreviewIcon = getIcon(formData.platform);
                                return <PreviewIcon className="w-6 h-6 text-[rgb(var(--text-primary))]" />;
                            })()}
                            <span className="text-sm text-[rgb(var(--text-secondary))]">
                                Icon preview
                            </span>
                        </div>
                    </div>

                    <Input
                        label="Profile URL"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        required
                    />

                    <Input
                        label="Username (Optional)"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="@username"
                    />

                    <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                        <Button type="submit" className="flex-1" loading={submitting}>
                            {editingSocial ? 'Update' : 'Create'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageSocials;