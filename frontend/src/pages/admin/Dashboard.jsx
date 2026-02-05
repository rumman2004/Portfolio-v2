import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FolderOpen, Award, Briefcase, Wrench, Mail,
    MessageSquare, ArrowRight, Clock, Calendar, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, GlassCard, Button, Badge } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import { useTheme } from '../../context/ThemeContext';
import {
    projectsAPI,
    skillsAPI,
    experienceAPI,
    certificatesAPI,
    contactsAPI
} from '../../services/api';

const Dashboard = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        certificates: 0,
        contacts: { total: 0, unread: 0, replied: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [recentContacts, setRecentContacts] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [
                projectsRes,
                skillsRes,
                experienceRes,
                certificatesRes,
                contactStatsRes,
                contactsRes
            ] = await Promise.all([
                projectsAPI.getAll(),
                skillsAPI.getAll(),
                experienceAPI.getAll(),
                certificatesAPI.getAll(),
                contactsAPI.getStats(),
                contactsAPI.getAll()
            ]);

            setStats({
                projects: projectsRes.data.count,
                skills: skillsRes.data.count,
                experiences: experienceRes.data.count,
                certificates: certificatesRes.data.count,
                contacts: contactStatsRes.data.data
            });

            // Get last 4 messages
            setRecentContacts(contactsRes.data.data.slice(0, 4));
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    // Configuration for the 3D Stat Cards
    const statCards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: FolderOpen,
            color: 'blue',
            trend: 12 // Dummy trend data for visual
        },
        {
            title: 'Total Skills',
            value: stats.skills,
            icon: Wrench,
            color: 'purple',
            trend: 5
        },
        {
            title: 'Experience',
            value: stats.experiences,
            icon: Briefcase,
            color: 'green',
            trend: 1
        },
        {
            title: 'Certificates',
            value: stats.certificates,
            icon: Award,
            color: 'orange',
            trend: 7
        },
        {
            title: 'Messages',
            value: stats.contacts.total,
            icon: Mail,
            color: 'blue',
            trend: stats.contacts.unread > 0 ? stats.contacts.unread : 0
        }
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* --- Header Section --- */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Dashboard
                    </h1>
                    <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Overview of your portfolio activity and content.
                    </p>
                </div>

                <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    ${isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-white text-slate-600 shadow-sm border border-slate-200'}
                `}>
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </motion.div>

            {/* --- 3D Stats Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            trend={stat.trend}
                        />
                    </motion.div>
                ))}
            </div>

            {/* --- Split Section: Messages & Quick Actions --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Recent Messages (Takes up 2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Recent Messages
                        </h2>
                        <Link to="/admin/contacts">
                            <Button variant="secondary" size="sm" icon={ArrowRight}>
                                View All
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {recentContacts.length > 0 ? (
                            recentContacts.map((contact, index) => (
                                <motion.div
                                    key={contact._id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                >
                                    {/* Using GlassCard for List Items */}
                                    <GlassCard className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-12 h-12 rounded-full flex items-center justify-center shrink-0
                                                ${isDark
                                                    ? 'bg-slate-800 text-indigo-400 shadow-[inset_2px_2px_4px_#0f172a]'
                                                    : 'bg-slate-100 text-indigo-600 shadow-[inset_2px_2px_4px_#cbd5e1]'
                                                }
                                            `}>
                                                <span className="font-bold text-lg">
                                                    {contact.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                        {contact.name}
                                                    </h3>
                                                    {!contact.isRead && (
                                                        <Badge variant="info">New</Badge>
                                                    )}
                                                </div>
                                                <p className={`text-sm line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {contact.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                <Clock className="w-3 h-3" />
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                glowColor={isDark ? '#6366f1' : '#4f46e5'}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        ) : (
                            <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No messages yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Portfolio Health / Quick Stats (Takes up 1 column) */}
                <div className="space-y-6">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Portfolio Health
                    </h2>

                    <GlassCard className="space-y-6">
                        {/* Status Item */}
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                System Status
                            </span>
                            <Badge variant="success" className="animate-pulse">
                                Operational
                            </Badge>
                        </div>

                        {/* Response Rate Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Response Rate</span>
                                <span className="font-bold text-indigo-500">
                                    {stats.contacts.total > 0
                                        ? Math.round((stats.contacts.replied / stats.contacts.total) * 100)
                                        : 100}%
                                </span>
                            </div>
                            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${stats.contacts.total > 0
                                            ? (stats.contacts.replied / stats.contacts.total) * 100
                                            : 100}%`
                                    }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                />
                            </div>
                        </div>

                        <div className={`h-px w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                        {/* Checklist */}
                        <div className="space-y-3">
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                QUICK CHECKS
                            </p>
                            {[
                                { label: 'Database Connected', status: true },
                                { label: 'Cloudinary Sync', status: true },
                                { label: 'Admin Access', status: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className={`w-5 h-5 ${item.status ? 'text-emerald-500' : 'text-slate-500'}`} />
                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Quick Action Button */}
                    <Link to="/admin/projects" className="block">
                        <Button className="w-full" variant="primary" icon={FolderOpen}>
                            Manage Projects
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;