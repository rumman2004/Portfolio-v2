import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useFetch } from '../../hooks/useFetch';

const PublicLayout = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Fetch background images globally for the layout
    const { data: aboutData } = useFetch('/about');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                navigate('/admin/login');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    // Background Slider Logic
    useEffect(() => {
        if (!aboutData?.heroImages || aboutData.heroImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === aboutData.heroImages.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [aboutData]);

    const hasImages = aboutData?.heroImages && aboutData.heroImages.length > 0;
    const currentImage = hasImages ? aboutData.heroImages[currentImageIndex].url : null;

    return (
        <div className={`
            min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500
            ${isDark ? 'bg-[#020617] text-white' : 'bg-slate-100 text-slate-900'}
        `}>
            {/* --- GLOBAL BACKGROUND LAYER --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AnimatePresence mode="wait">
                    {hasImages ? (
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${currentImage})` }}
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${isDark
                            ? 'from-slate-900 via-[#0f172a] to-slate-900'
                            : 'from-slate-50 via-white to-slate-100'
                            }`} />
                    )}
                </AnimatePresence>

                {/* Dynamic Theme Overlay */}
                <div className={`absolute inset-0 backdrop-blur-[2px] transition-colors duration-500 z-10 ${isDark ? 'bg-black/70' : 'bg-white/80'
                    }`} />
            </div>

            {/* --- CONTENT LAYER --- */}
            {/* Relative z-10 ensures content sits ON TOP of the fixed background */}
            <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Navbar />

                {/* Main Content - Full Width & Responsive */}
                <main className="flex-1 w-full">
                    {/* Content wrapper with responsive top padding */}
                    <div className="w-full pt-16 sm:pt-20 md:pt-24 lg:pt-28">
                        <Outlet />
                    </div>
                </main>

                <Footer />
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        color: isDark ? '#fff' : '#0f172a',
                        backdropFilter: 'blur(10px)',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: isDark ? '#0f172a' : '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: isDark ? '#0f172a' : '#fff',
                        },
                    },
                }}
            />
        </div>
    );
};

export default PublicLayout;