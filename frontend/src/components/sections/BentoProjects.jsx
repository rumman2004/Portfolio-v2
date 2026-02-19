import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Briefcase, ExternalLink, Github, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

/**
 * SAME FIX AS BentoCertificates:
 *  • No maskImage — was clipping the card edges.
 *  • overflow-hidden on the outer <section> clips in-transit cards only.
 *  • Card constrained to max-w-2xl and centered — never touches edges.
 *  • Nav buttons outside the 3D perspective container — no distortion.
 *  • Mouse-tilt (useSpring) added to ProjectCard for consistent feel.
 */

const ROTATE_DEG = 52;

const slideVariants = {
    enter: (dir) => ({
        x:       dir > 0 ? '100%' : '-100%',
        rotateY: dir > 0 ? ROTATE_DEG : -ROTATE_DEG,
        scale:   0.78,
        opacity: 0,
        z:       -260,
    }),
    center: {
        x:       0,
        rotateY: 0,
        scale:   1,
        opacity: 1,
        z:       0,
        transition: {
            duration: 0.72,
            ease:     [0.22, 1, 0.36, 1],
            opacity:  { duration: 0.3 },
        },
    },
    exit: (dir) => ({
        x:       dir > 0 ? '-100%' : '100%',
        rotateY: dir > 0 ? -ROTATE_DEG : ROTATE_DEG,
        scale:   0.78,
        opacity: 0,
        z:       -260,
        transition: {
            duration: 0.55,
            ease:     [0.55, 0, 1, 0.45],
            opacity:  { duration: 0.22 },
        },
    }),
};

// ── Main Component ──────────────────────────────────────────────────────
const BentoProjects = () => {
    const [projects, setProjects]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [activeIndex, setActiveIndex]   = useState(0);
    const [direction, setDirection]       = useState(0);
    const timerRef                        = useRef(null);
    const { theme }                       = useTheme();
    const isDark                          = theme === 'dark';

    useEffect(() => {
        (async () => {
            try {
                const res      = await projectsAPI.getAll();
                const all      = res.data.data;
                const featured = all.filter((p) => p.featured);
                setProjects(featured.length > 0 ? featured : all);
            } catch (e) {
                console.error('Failed to fetch projects', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const goNext = useCallback(() => {
        setDirection(1);
        setActiveIndex((p) => (p + 1) % projects.length);
    }, [projects.length]);

    const goPrev = useCallback(() => {
        setDirection(-1);
        setActiveIndex((p) => (p - 1 + projects.length) % projects.length);
    }, [projects.length]);

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        if (projects.length > 1) timerRef.current = setInterval(goNext, 6500);
    }, [goNext, projects.length]);

    useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

    const handlePrev = () => { goPrev(); resetTimer(); };
    const handleNext = () => { goNext(); resetTimer(); };
    const handleDot  = (i) => {
        setDirection(i > activeIndex ? 1 : -1);
        setActiveIndex(i);
        resetTimer();
    };

    if (loading || projects.length === 0) return null;

    return (
        /* overflow-hidden on section clips in-transit cards at viewport edges only */
        <section id="work" className="py-12 md:py-24 relative overflow-hidden">

            {/* ── Header ── */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-14 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 border-2 backdrop-blur-md shadow-lg ${
                            isDark
                                ? 'bg-gradient-to-r from-blue-500/20 to-[rgb(var(--accent))]/20 border-blue-500/30 text-blue-300'
                                : 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-300 text-blue-700'
                        }`}
                    >
                        <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Featured Work</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight"
                    >
                        Completed{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-[rgb(var(--accent))] to-purple-500">
                            Projects
                        </span>
                    </motion.h2>
                </div>
            </div>

            {/* ── Carousel shell ── */}
            <div className="relative w-full px-4 sm:px-6">

                {/* Perspective container — 3D space */}
                <div
                    className="relative w-full"
                    style={{
                        perspective:       '1300px',
                        perspectiveOrigin: '50% 50%',
                    }}
                >
                    {/* Stage — full width, flex-centered, no overflow-hidden, no mask */}
                    <div
                        className="relative w-full flex justify-center"
                        style={{ transformStyle: 'preserve-3d', minHeight: '20px' }}
                    >
                        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                /* max-w-2xl keeps card well away from edges — nothing clips it */
                                className="w-full max-w-2xl"
                                style={{
                                    willChange:     'transform, opacity',
                                    transformStyle: 'preserve-3d',
                                    transformOrigin:'center center',
                                }}
                            >
                                <ProjectCard project={projects[activeIndex]} isDark={isDark} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Nav Buttons — outside 3D container, no perspective distortion */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous project"
                    className={`absolute left-0 sm:left-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                        isDark
                            ? 'bg-white/10 hover:bg-white/25 border-white/20 text-white'
                            : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={handleNext}
                    aria-label="Next project"
                    className={`absolute right-0 sm:right-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                        isDark
                            ? 'bg-white/10 hover:bg-white/25 border-white/20 text-white'
                            : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800'
                    }`}
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Dots */}
                {projects.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {projects.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleDot(i)}
                                aria-label={`Go to project ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    i === activeIndex
                                        ? 'w-8 bg-gradient-to-r from-blue-500 to-[rgb(var(--accent))]'
                                        : isDark
                                        ? 'w-2 bg-white/20 hover:bg-white/40'
                                        : 'w-2 bg-slate-300 hover:bg-slate-500'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// ── Project Card — with spring mouse-tilt like TiltCard in Certificates ─
const ProjectCard = ({ project, isDark }) => {
    const mx  = useMotionValue(0.5);
    const my  = useMotionValue(0.5);
    const smx = useSpring(mx, { stiffness: 120, damping: 18 });
    const smy = useSpring(my, { stiffness: 120, damping: 18 });
    const rotateX = useTransform(smy, [0, 1], [6, -6]);
    const rotateY = useTransform(smx, [0, 1], [-6, 6]);

    const onMouseMove  = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top)  / r.height);
    };
    const onMouseLeave = () => { mx.set(0.5); my.set(0.5); };

    return (
        <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="w-full"
        >
            <GlassCard
                className={`w-full flex flex-col overflow-hidden border shadow-2xl rounded-2xl ${
                    isDark
                        ? 'bg-white/[0.07] border-white/15 backdrop-blur-2xl'
                        : 'bg-white border-slate-200/80 backdrop-blur-md shadow-slate-200/60'
                }`}
            >
                {/* ── Image ── */}
                <div className={`relative h-52 sm:h-60 md:h-72 w-full overflow-hidden group ${
                    isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-slate-100'
                }`}>
                    {project.image?.url ? (
                        <>
                            <img
                                src={project.image.url}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                loading="lazy"
                            />
                            {/* Subtle shine on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Briefcase className="w-16 h-16 opacity-10" />
                        </div>
                    )}

                    {/* Bottom fade into card content */}
                    <div className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none ${
                        isDark
                            ? 'bg-gradient-to-t from-[rgb(var(--bg-card))] to-transparent'
                            : 'bg-gradient-to-t from-white to-transparent'
                    }`} />

                    {/* Category tag */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1.5 shadow-xl">
                        <Layers className="w-3 h-3" />
                        {project.category}
                    </div>
                </div>

                {/* ── Content ── */}
                <div className={`flex-1 p-5 sm:p-6 lg:p-8 flex flex-col gap-4 ${
                    isDark ? '' : 'bg-white'
                }`}>
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                        {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] leading-relaxed line-clamp-3">
                        {project.description}
                    </p>

                    <div className="mt-auto space-y-4">
                        {/* Tech chips */}
                        <div className="flex flex-wrap gap-1.5">
                            {project.technologies?.slice(0, 5).map((tech, i) => (
                                <span
                                    key={i}
                                    className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold border ${
                                        isDark
                                            ? 'bg-white/[0.06] border-white/10 text-white/75'
                                            : 'bg-slate-100 border-slate-200 text-slate-600'
                                    }`}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Links */}
                        <div className={`flex gap-3 pt-4 border-t ${
                            isDark ? 'border-white/10' : 'border-slate-100'
                        }`}>
                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                                        isDark
                                            ? 'bg-white/5 hover:bg-white/12 border-white/10 text-white/80'
                                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                >
                                    <Github className="w-4 h-4" />
                                    Source
                                </a>
                            )}
                            {project.liveLink && (
                                <a
                                    href={project.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/35 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/30 text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

export default BentoProjects;