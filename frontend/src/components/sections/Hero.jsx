import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '../ui';
import { useFetch } from '../../hooks/useFetch';
import { useTheme } from '../../context/ThemeContext';

const Hero = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { data: aboutData, loading } = useFetch('/about');

    // Typing Effect State
    const [typedTitle, setTypedTitle] = useState('');
    const fullTitle = "Full Stack Developer | UI/UX & Frontend Developer";

    // --- Looping Typing Animation ---
    useEffect(() => {
        let timeout;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentFullText = fullTitle;

            if (!isDeleting) {
                setTypedTitle(currentFullText.substring(0, charIndex + 1));
                charIndex++;

                if (charIndex === currentFullText.length) {
                    isDeleting = true;
                    timeout = setTimeout(type, 2000);
                } else {
                    timeout = setTimeout(type, 50);
                }
            } else {
                setTypedTitle('');
                charIndex = 0;
                isDeleting = false;
                timeout = setTimeout(type, 500);
            }
        };

        timeout = setTimeout(type, 500);

        return () => clearTimeout(timeout);
    }, []);

    if (loading) return <div className="h-[60vh] flex items-center justify-center">Loading...</div>;

    return (
        <section className="relative flex flex-col items-center justify-center py-12 md:py-20">

            {/* --- CONTENT --- */}
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Status Badge */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <span className={`
                            py-1.5 px-4 sm:py-2 sm:px-5 rounded-full text-[10px] sm:text-sm font-semibold tracking-wide shadow-lg border backdrop-blur-md
                            ${isDark
                                ? 'bg-white/5 border-white/10 text-emerald-400'
                                : 'bg-white/60 border-white/40 text-emerald-600'
                            }
                        `}>
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current inline-block mr-2 animate-pulse" />
                            Available for New Projects
                        </span>
                    </div>

                    {/* Name */}
                    <h1 className={`text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-1 sm:mb-6 tracking-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-slate-800'
                        }`}>
                        Rumman <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500">Ahmed</span>
                    </h1>

                    {/* Typing Title */}
                    <div className="h-12 sm:h-12 mb-4 sm:mb-8 flex items-center justify-center">
                        <h2 className={`text-sm sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide px-2 ${isDark ? 'text-gray-200' : 'text-slate-900'
                            }`}>
                            {typedTitle}
                            <span className="animate-pulse ml-1 text-[rgb(var(--accent))] font-bold">|</span>
                        </h2>
                    </div>

                    {/* Bio */}
                    <p className={`max-w-2xl mx-auto mb-8 sm:mb-10 text-sm sm:text-lg leading-relaxed font-light px-4 ${isDark ? 'text-gray-300' : 'text-slate-900'
                        }`}>
                        I design and develop high-quality digital solutions that balance performance, usability, and aesthetics. From responsive frontends to robust backend systems, I focus on delivering experiences that feel seamless and purposeful.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full px-8 sm:px-0">
                        <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-xl shadow-[rgb(var(--accent))]/20">
                            View My Work
                        </Button>

                        {aboutData?.resume?.url && (
                            <a
                                href={aboutData.resume.url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <button className={`
                                    w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 border
                                    ${isDark
                                        ? 'border-white/20 text-white hover:bg-white/10'
                                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                                    }
                                `}>
                                    <Download className="w-5 h-5" />
                                    Download CV
                                </button>
                            </a>
                        )}
                    </div>

                    {/* Neumorphic Glass Stats Bar */}
                    <div className={`
                        inline-flex flex-wrap items-center justify-center gap-4 sm:gap-16 p-6 sm:p-6 rounded-3xl backdrop-blur-xl border shadow-2xl mx-4
                        ${isDark
                            ? 'bg-white/5 border-white/10 shadow-black/30'
                            : 'bg-white/40 border-white/60 shadow-slate-200/60'
                        }
                    `}>
                        <div className="text-center min-w-[60px]">
                            <div className={`text-2xl sm:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {aboutData?.stats?.yearsExperience || 0}+
                            </div>
                            <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                Years Exp.
                            </div>
                        </div>

                        <div className={`h-8 sm:h-12 w-px ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />

                        <div className="text-center min-w-[60px]">
                            <div className={`text-2xl sm:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {aboutData?.stats?.projectsCompleted || 0}+
                            </div>
                            <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                Projects
                            </div>
                        </div>

                        <div className={`h-8 sm:h-12 w-px ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />

                        <div className="text-center min-w-[60px]">
                            <div className={`text-2xl sm:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {aboutData?.stats?.happyClients || 0}+
                            </div>
                            <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                Clients
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Animated Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute bottom-6 sm:bottom-6 left-1/2 -translate-x-1/2 ${isDark ? 'text-white/30' : 'text-slate-400'
                    }`}
            >
                <div className={`w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex justify-center p-1 ${isDark ? 'border-white/20' : 'border-slate-400'
                    }`}>
                    <div className={`w-1 h-1.5 sm:h-2 rounded-full ${isDark ? 'bg-white' : 'bg-slate-600'
                        }`} />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;