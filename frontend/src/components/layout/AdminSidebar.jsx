import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderOpen,
    Award,
    Briefcase,
    Wrench,
    Share2,
    Mail,
    User,
    LogOut,
    X,
    Settings,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout, admin } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'About', path: '/admin/about', icon: User },
        { name: 'Projects', path: '/admin/projects', icon: FolderOpen },
        { name: 'Skills', path: '/admin/skills', icon: Wrench },
        { name: 'Experience', path: '/admin/experience', icon: Briefcase },
        { name: 'Certificates', path: '/admin/certificates', icon: Award },
        { name: 'Socials', path: '/admin/socials', icon: Share2 },
        { name: 'Messages', path: '/admin/contacts', icon: Mail },
        { name: 'Profile', path: '/admin/profile', icon: Settings },
    ];

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                    
                    /* --- Mobile/Tablet: Floating Drawer Style --- */
                    top-4 bottom-4 w-72 rounded-3xl border shadow-2xl
                    ${isOpen ? 'left-4 translate-x-0' : '-translate-x-[120%] left-4'}
                    
                    /* --- Desktop: Full Height Docked Sidebar --- */
                    lg:translate-x-0 lg:top-0 lg:left-0 lg:bottom-0 lg:w-72 lg:rounded-none lg:border-r lg:border-y-0 lg:border-l-0 lg:shadow-xl

                    /* --- Theme Styles --- */
                    backdrop-blur-2xl
                    ${isDark
                        ? 'bg-[#0f172a]/95 border-white/10 shadow-black/50'
                        : 'bg-slate-100/95 border-white/50 shadow-slate-300/50'
                    }
                `}
            >
                <div className="flex flex-col h-full relative overflow-hidden">

                    {/* Decorative Gradient Blob (Top) */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[rgb(var(--accent))]/10 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="p-6 relative z-10 flex-shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-[rgb(var(--accent))] to-purple-600 shadow-lg shadow-[rgb(var(--accent))]/30">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Admin<span className="text-[rgb(var(--accent))]">Panel</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`lg:hidden p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Profile Summary */}
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/50 border-white/40'
                            }`}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                {admin?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                    {admin?.name || 'Admin'}
                                </p>
                                <p className="text-xs text-[rgb(var(--text-secondary))] truncate">
                                    {admin?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar relative z-10">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={handleLinkClick}
                                            className={`
                                                group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden
                                                ${isActive
                                                    ? 'text-white shadow-lg shadow-[rgb(var(--accent))]/25'
                                                    : isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'
                                                }
                                            `}
                                        >
                                            {/* Active Background with Gradient */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent))] to-purple-600"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}

                                            {/* Hover Background (Inactive) */}
                                            {!isActive && (
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-white/5' : 'bg-black/5'
                                                    }`} />
                                            )}

                                            <item.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 duration-300 ${isActive ? 'text-white' : 'text-[rgb(var(--text-secondary))] group-hover:text-[rgb(var(--accent))]'
                                                }`} />

                                            <span className="font-medium relative z-10">{item.name}</span>

                                            {/* Active Indicator Dot */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeDot"
                                                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer Actions */}
                    <div className={`p-4 border-t relative z-10 ${isDark ? 'border-white/5' : 'border-slate-200/50'
                        }`}>
                        <button
                            onClick={logout}
                            className={`
                                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                                ${isDark
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20'
                                    : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20'
                                }
                            `}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;