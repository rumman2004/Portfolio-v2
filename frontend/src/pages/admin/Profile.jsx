// Profile.jsx — GSAP version
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { User, Mail, Lock, Save, Shield, Calendar, Key } from 'lucide-react';
import { Input, Button, GlassCard, Badge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useCollapsible, useHeaderEntrance } from '../../utils/gsapHelpers';

const Profile = () => {
    const { admin, login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    const wrapRef = useRef(null);
    const { headerRef } = useHeaderEntrance();
    const { panelRef } = useCollapsible(passwordMode);

    useEffect(() => {
        if (admin) setFormData(p => ({ ...p, name: admin.name, email: admin.email }));
    }, [admin]);

    /* Grid entrance */
    useEffect(() => {
        if (!wrapRef.current) return;
        const cards = wrapRef.current.querySelectorAll('.profile-card');
        gsap.fromTo(cards,
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.1, delay: 0.2 }
        );
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const updateData = { name: formData.name, email: formData.email };
            if (passwordMode) {
                if (formData.newPassword !== formData.confirmPassword) { toast.error("Passwords don't match"); setLoading(false); return; }
                if (formData.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); setLoading(false); return; }
                updateData.password = formData.newPassword;
            }
            const res = await authAPI.updateProfile(updateData);
            login(res.data.data); toast.success('Profile updated successfully');
            if (passwordMode) { setFormData(p => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' })); setPasswordMode(false); }
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
        finally { setLoading(false); }
    };

    return (
        <div ref={wrapRef} className="space-y-8 pb-8 max-w-5xl mx-auto" style={{ fontFamily: "'Syne',sans-serif" }}>
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="page-heading" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'rgb(var(--text-primary))', marginBottom: '0.25rem' }}>Profile Settings</h1>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.78rem', color: 'rgb(var(--text-secondary))' }}>Manage your account details and security</p>
                    <div className="page-divider" style={{ height: '1px', marginTop: '0.75rem', background: 'linear-gradient(to right,rgba(var(--accent),0.4),transparent)' }} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Identity card */}
                <div className="lg:col-span-1">
                    <GlassCard className="profile-card text-center p-6 flex flex-col items-center h-full">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-purple-600 p-1 shadow-lg shadow-[rgb(var(--accent))]/20">
                                <div className="w-full h-full rounded-full bg-[rgb(var(--bg-card))] flex items-center justify-center" style={{ fontSize: '2rem', fontWeight: 800, color: 'rgb(var(--text-primary))' }}>
                                    {admin?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-2 p-2 bg-[rgb(var(--bg-secondary))] rounded-full border border-[rgb(var(--border))] shadow-sm">
                                <Shield className="w-4 h-4 text-[rgb(var(--accent))]" />
                            </div>
                        </div>
                        <h2 style={{ fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }} className="text-xl">{admin?.name}</h2>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.72rem', color: 'rgb(var(--text-secondary))' }} className="break-all mb-4">{admin?.email}</p>
                        <Badge variant="default" className="px-3 py-1">Administrator</Badge>
                        <div className="w-full mt-auto pt-6 border-t border-[rgb(var(--border))] space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.72rem', color: 'rgb(var(--text-secondary))' }} className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Member Since
                                </span>
                                <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.72rem' }}>
                                    {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Edit form */}
                <div className="lg:col-span-2">
                    <GlassCard className="profile-card h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgb(var(--border))]">
                            <User className="w-5 h-5 text-[rgb(var(--accent))]" />
                            <h3 style={{ fontWeight: 800, letterSpacing: '-0.02em' }} className="text-lg">Account Details</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={User} required />
                                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} icon={Mail} required />
                            </div>
                            <div className="pt-4 border-t border-[rgb(var(--border))]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-[rgb(var(--accent))]" />
                                        <h3 style={{ fontWeight: 800, letterSpacing: '-0.02em' }} className="text-lg">Security</h3>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setPasswordMode(!passwordMode)}>
                                        {passwordMode ? 'Cancel Change' : 'Change Password'}
                                    </Button>
                                </div>
                                <div ref={panelRef}>
                                    <div className="collapsible-inner p-4 bg-[rgb(var(--bg-secondary))]/30 rounded-xl border border-[rgb(var(--border))] space-y-4">
                                        <Input label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} icon={Key} placeholder="Minimum 6 characters" required={passwordMode} />
                                        <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} icon={Key} placeholder="Re-enter new password" required={passwordMode} />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end border-t border-[rgb(var(--border))]">
                                <Button type="submit" loading={loading} icon={Save} className="w-full sm:w-auto" size="lg">Save Changes</Button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export { Profile as default };