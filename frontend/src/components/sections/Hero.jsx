import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '../ui';
import { useFetch } from '../../hooks/useFetch';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../ui/Loader';

const FULL_TITLE = 'Full Stack Developer | UI/UX & Frontend Developer';
const TYPE_SPEED         = 60;
const DELETE_SPEED       = 30;
const PAUSE_AFTER_TYPE   = 2200;
const PAUSE_AFTER_DELETE = 500;

const Hero = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { data: aboutData, loading } = useFetch('/about');
    const [typedTitle, setTypedTitle] = useState('');

    useEffect(() => {
        let timeout;
        let charIndex = 0;
        let isDeleting = false;

        const tick = () => {
            if (!isDeleting) {
                charIndex += 1;
                setTypedTitle(FULL_TITLE.substring(0, charIndex));
                if (charIndex === FULL_TITLE.length) {
                    isDeleting = true;
                    timeout = setTimeout(tick, PAUSE_AFTER_TYPE);
                } else {
                    timeout = setTimeout(tick, TYPE_SPEED);
                }
            } else {
                charIndex -= 1;
                setTypedTitle(FULL_TITLE.substring(0, charIndex));
                if (charIndex === 0) {
                    isDeleting = false;
                    timeout = setTimeout(tick, PAUSE_AFTER_DELETE);
                } else {
                    timeout = setTimeout(tick, DELETE_SPEED);
                }
            }
        };

        timeout = setTimeout(tick, PAUSE_AFTER_DELETE);
        return () => clearTimeout(timeout);
    }, []);

    const scrollToWork = useCallback(() => {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );

    return (
        <section className="relative flex flex-col items-center justify-center py-12 md:py-20">

            {/* Liquid glass styles */}
            <style>{`
                .liquid-glass-btn {
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(16px) saturate(180%);
                    -webkit-backdrop-filter: blur(16px) saturate(180%);
                    transition: all 0.3s ease;
                }

                /* Sheen sweep on hover */
                .liquid-glass-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        120deg,
                        transparent 20%,
                        rgba(255,255,255,0.25) 50%,
                        transparent 80%
                    );
                    transform: translateX(-100%);
                    transition: transform 0.55s ease;
                    pointer-events: none;
                    z-index: 1;
                }
                .liquid-glass-btn:hover::before {
                    transform: translateX(100%);
                }

                /* Ripple bubble on hover */
                .liquid-glass-btn::after {
                    content: '';
                    position: absolute;
                    width: 120%;
                    height: 120%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    border-radius: 50%;
                    background: radial-gradient(
                        circle,
                        rgba(255,255,255,0.15) 0%,
                        transparent 70%
                    );
                    transition: transform 0.5s ease, opacity 0.5s ease;
                    opacity: 0;
                    pointer-events: none;
                    z-index: 0;
                }
                .liquid-glass-btn:hover::after {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }

                .liquid-glass-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15),
                                0 2px 8px rgba(255,255,255,0.1) inset;
                }
                .liquid-glass-btn:active {
                    transform: translateY(0px) scale(0.97);
                }

                /* Dark mode */
                .liquid-glass-dark {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.10) 0%,
                        rgba(255,255,255,0.05) 100%
                    );
                    border: 1px solid rgba(255,255,255,0.18);
                    color: rgba(255,255,255,0.90);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.2),
                                0 1px 0 rgba(255,255,255,0.1) inset;
                }
                .liquid-glass-dark:hover {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.16) 0%,
                        rgba(255,255,255,0.08) 100%
                    );
                    border-color: rgba(255,255,255,0.30);
                }

                /* Light mode */
                .liquid-glass-light {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.65) 0%,
                        rgba(255,255,255,0.35) 100%
                    );
                    border: 1px solid rgba(255,255,255,0.75);
                    color: #334155;
                    box-shadow: 0 4px 24px rgba(100,116,139,0.15),
                                0 1px 0 rgba(255,255,255,0.8) inset;
                }
                .liquid-glass-light:hover {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.80) 0%,
                        rgba(255,255,255,0.50) 100%
                    );
                    border-color: rgba(255,255,255,0.90);
                }
            `}</style>

            {/* ── Content ── */}
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
                            py-1.5 px-4 sm:py-2 sm:px-5 rounded-full text-[10px] sm:text-sm
                            font-semibold tracking-wide shadow-lg border backdrop-blur-md
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
                    <h1 className={`
                        text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-1 sm:mb-6
                        tracking-tight drop-shadow-sm
                        ${isDark ? 'text-white' : 'text-slate-800'}
                    `}>
                        Rumman{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500">
                            Ahmed
                        </span>
                    </h1>

                    {/* Typing Title */}
                    <div className="h-10 sm:h-12 mb-4 sm:mb-8 flex items-center justify-center overflow-hidden">
                        <h2 className={`
                            text-sm sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide px-2
                            ${isDark ? 'text-gray-200' : 'text-slate-700'}
                        `}>
                            {typedTitle}
                            <span className="animate-pulse ml-0.5 text-[rgb(var(--accent))] font-bold select-none">
                                |
                            </span>
                        </h2>
                    </div>

                    {/* Bio */}
                    <p className={`
                        max-w-2xl mx-auto mb-8 sm:mb-10 text-sm sm:text-lg
                        leading-relaxed font-light px-4
                        ${isDark ? 'text-gray-300' : 'text-slate-600'}
                    `}>
                        I design and develop high-quality digital solutions that balance
                        performance, usability, and aesthetics. From responsive frontends
                        to robust backend systems, I focus on delivering experiences that
                        feel seamless and purposeful.
                    </p>

                    {/* ── Buttons ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full px-8 sm:px-0">

                        {/* Primary CTA */}
                        <Button
                            size="lg"
                            icon={ArrowRight}
                            onClick={scrollToWork}
                            className="w-full sm:w-auto shadow-xl shadow-[rgb(var(--accent))]/20"
                        >
                            View My Works
                        </Button>

                        {/* ── Liquid Glass Download CV Button ── */}
                        {aboutData?.resume?.url && (
                            <a
                                href={aboutData.resume.url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <button className={`
                                    liquid-glass-btn
                                    ${isDark ? 'liquid-glass-dark' : 'liquid-glass-light'}
                                    w-full sm:w-auto
                                    flex items-center justify-center gap-1.5 sm:gap-2
                                    px-5 py-4 sm:px-7 sm:py-3
                                    text-xs sm:text-sm
                                    rounded-xl font-medium
                                    cursor-pointer
                                `}>
                                    {/* Animated download icon */}
                                    <motion.span
                                        animate={{ y: [0, 2, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        className="relative z-10 flex items-center"
                                    >
                                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </motion.span>
                                    <span className="relative z-10">Download CV</span>
                                </button>
                            </a>
                        )}
                    </div>

                    {/* ── Stats Bar ── */}
                    <div className={`
                        inline-flex flex-wrap items-center justify-center
                        gap-6 sm:gap-0 p-6 rounded-3xl backdrop-blur-xl border shadow-2xl mx-4
                        ${isDark
                            ? 'bg-white/5 border-white/10 shadow-black/30'
                            : 'bg-white/40 border-white/60 shadow-slate-200/60'
                        }
                    `}>
                        {[
                            { value: aboutData?.stats?.yearsExperience,   label: 'Years Exp.' },
                            { value: aboutData?.stats?.projectsCompleted, label: 'Projects'   },
                            { value: aboutData?.stats?.happyClients,      label: 'Clients'    },
                        ].map((stat, i) => (
                            <div key={stat.label} className="contents">
                                {i > 0 && (
                                    <div className={`
                                        hidden sm:block h-12 w-px mx-8 flex-shrink-0
                                        ${isDark ? 'bg-white/10' : 'bg-slate-300'}
                                    `} />
                                )}
                                <div className="text-center min-w-[70px]">
                                    <div className={`text-2xl sm:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {stat.value || 0}+
                                    </div>
                                    <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </motion.div>
            </div>

            {/* ── Scroll Indicator ── */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`
                    absolute bottom-6 left-1/2 -translate-x-1/2
                    ${isDark ? 'text-white/30' : 'text-slate-400'}
                `}
            >
                <div className={`
                    w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex justify-center p-1
                    ${isDark ? 'border-white/20' : 'border-slate-400'}
                `}>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-1 h-1.5 sm:h-2 rounded-full ${isDark ? 'bg-white' : 'bg-slate-600'}`}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;