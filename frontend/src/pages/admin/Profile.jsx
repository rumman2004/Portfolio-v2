import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Save, Shield, Calendar, Key } from 'lucide-react';
import { Input, Button, GlassCard, Badge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { admin, login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    useEffect(() => {
        if (admin) {
            setFormData(prev => ({
                ...prev,
                name: admin.name,
                email: admin.email,
            }));
        }
    }, [admin]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
            };

            // Only include password if trying to change it
            if (passwordMode) {
                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error('New passwords do not match');
                    setLoading(false);
                    return;
                }
                if (formData.newPassword.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                updateData.password = formData.newPassword;
            }

            const response = await authAPI.updateProfile(updateData);
            login(response.data.data);
            toast.success('Profile updated successfully');

            // Reset password fields
            if (passwordMode) {
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
                setPasswordMode(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Manage your account details and security
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard className="text-center p-6 flex flex-col items-center h-full">
                        <div className="relative mb-6 group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-purple-600 p-1 shadow-lg shadow-[rgb(var(--accent))]/20">
                                <div className="w-full h-full rounded-full bg-[rgb(var(--bg-card))] flex items-center justify-center text-4xl font-bold text-[rgb(var(--text-primary))]">
                                    {admin?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-2 p-2 bg-[rgb(var(--bg-secondary))] rounded-full border border-[rgb(var(--border))] shadow-sm">
                                <Shield className="w-4 h-4 text-[rgb(var(--accent))]" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-1">{admin?.name}</h2>
                        <p className="text-sm text-[rgb(var(--text-secondary))] break-all mb-4">
                            {admin?.email}
                        </p>

                        <Badge variant="default" className="px-3 py-1">Administrator</Badge>

                        <div className="w-full mt-auto pt-6 border-t border-[rgb(var(--border))] space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[rgb(var(--text-secondary))] flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Member Since
                                </span>
                                <span className="font-medium">
                                    {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <GlassCard className="h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgb(var(--border))]">
                            <User className="w-5 h-5 text-[rgb(var(--accent))]" />
                            <h3 className="text-lg font-semibold">Account Details</h3>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={User}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={Mail}
                                    required
                                />
                            </div>

                            <div className="pt-4 border-t border-[rgb(var(--border))]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-[rgb(var(--accent))]" />
                                        <h3 className="text-lg font-semibold">Security</h3>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPasswordMode(!passwordMode)}
                                        className="text-xs sm:text-sm"
                                    >
                                        {passwordMode ? 'Cancel Change' : 'Change Password'}
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {passwordMode && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            <div className="p-4 bg-[rgb(var(--bg-secondary))]/30 rounded-xl border border-[rgb(var(--border))] space-y-4">
                                                <Input
                                                    label="New Password"
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    icon={Key}
                                                    placeholder="Minimum 6 characters"
                                                    required={passwordMode}
                                                />
                                                <Input
                                                    label="Confirm Password"
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    icon={Key}
                                                    placeholder="Re-enter new password"
                                                    required={passwordMode}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-4 flex justify-end border-t border-[rgb(var(--border))]">
                                <Button
                                    type="submit"
                                    loading={loading}
                                    icon={Save}
                                    className="w-full sm:w-auto shadow-lg shadow-[rgb(var(--accent))]/20"
                                    size="lg"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Profile;