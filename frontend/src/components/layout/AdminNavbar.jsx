import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from '../ui'; // Using the new 3D toggle
import { contactsAPI } from '../../services/api';

const AdminNavbar = ({ toggleSidebar }) => {
    const { admin } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread messages count on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await contactsAPI.getStats();
                setUnreadCount(res.data.data.unread);
            } catch (error) {
                console.error("Failed to fetch notifications");
            }
        };

        fetchNotifications();

        // Optional: Poll for new messages every 60s
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Placeholder for global search logic
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className={`
            sticky top-4 z-40 mx-4 rounded-2xl mb-6
            backdrop-blur-xl border shadow-lg transition-all duration-300
            ${isDark
                ? 'bg-[#0f172a]/80 border-white/10 shadow-black/20'
                : 'bg-white/80 border-white/40 shadow-slate-200/50'
            }
        `}>
            <div className="px-4 py-3 flex items-center justify-between gap-4">

                {/* --- Left: Sidebar Toggle & Search --- */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={toggleSidebar}
                        className={`lg:hidden p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                            }`}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* 3D Inset Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md relative group">
                        <Search className={`w-4 h-4 absolute left-3.5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-[rgb(var(--accent))]' : 'text-slate-400 group-focus-within:text-[rgb(var(--accent))]'
                            }`} />
                        <input
                            type="text"
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`
                                w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all border
                                ${isDark
                                    ? 'bg-[#020617]/50 border-white/5 text-slate-200 focus:bg-[#020617]/80 focus:border-[rgb(var(--accent))]/50 focus:shadow-[0_0_15px_rgba(var(--accent),0.1)]'
                                    : 'bg-slate-100/50 border-slate-200 text-slate-800 focus:bg-white focus:border-[rgb(var(--accent))]/50 focus:shadow-sm'
                                }
                            `}
                        />
                    </form>
                </div>

                {/* --- Right: Actions & Profile --- */}
                <div className="flex items-center gap-3 sm:gap-5">

                    {/* Dark Mode Toggle */}
                    <div className="scale-75 sm:scale-90 origin-right">
                        <DarkModeToggle />
                    </div>

                    {/* Notification Bell */}
                    <div className="relative">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/admin/contacts')}
                            className={`
                                relative p-2.5 rounded-xl transition-all duration-300
                                ${isDark
                                    ? 'hover:bg-white/5 text-slate-400 hover:text-white'
                                    : 'hover:bg-slate-100 text-slate-600 hover:text-[rgb(var(--accent))]'
                                }
                            `}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                            )}
                        </motion.button>
                    </div>

                    {/* Profile Divider */}
                    <div className={`h-8 w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

                    {/* Admin Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                {admin?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-[rgb(var(--text-secondary))]">Administrator</p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-purple-600 p-0.5 shadow-lg cursor-pointer"
                            onClick={() => navigate('/admin/profile')}
                        >
                            <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-800'
                                }`}>
                                {admin?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;