import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { DarkModeToggle } from '../ui';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'About', path: '/about', icon: User },
        { name: 'Work', path: '/work', icon: Briefcase },
        { name: 'Contact', path: '/contact', icon: Mail },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active Link Styles
    const getLinkStyles = (path) => {
        const isActive = location.pathname === path;

        if (isActive) {
            return "bg-gradient-to-r from-[rgb(var(--accent))] to-purple-600 text-white shadow-lg shadow-[rgb(var(--accent))]/25 scale-105";
        }

        return isDark
            ? "text-slate-300 hover:text-white hover:bg-white/10"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`
                fixed top-4 left-0 right-0 z-50 mx-auto w-[95%] max-w-5xl rounded-2xl
                transition-all duration-300
                ${scrolled
                    ? `backdrop-blur-xl border shadow-xl ${isDark ? 'bg-[#0f172a]/80 border-white/10 shadow-black/20' : 'bg-white/80 border-white/40 shadow-slate-200/50'}`
                    : `backdrop-blur-sm border border-transparent ${isDark ? 'bg-black/10' : 'bg-white/10'}`
                }
            `}
        >
            <div className="px-3 md:px-6 py-2.5 md:py-3">
                <div className="flex items-center justify-between">

                    {/* Navigation Links - Visible on ALL screens */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-start">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    relative px-3 py-2 md:px-4 md:py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                                    ${getLinkStyles(item.path)}
                                `}
                                title={item.name} // Tooltip for desktop hover
                            >
                                <item.icon className="w-5 h-5" />
                                {/* Text is hidden on mobile, visible on md screens and up */}
                                <span className="hidden md:block">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="scale-90 sm:scale-100 origin-right">
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;