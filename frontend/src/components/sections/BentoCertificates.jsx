import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle, ChevronRight, ChevronLeft, Shield, Hash } from 'lucide-react';
import { certificatesAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

/**
 * FIX: The previous maskImage gradient was applied to the same div that
 * contained the full-width card — so it clipped the card edges.
 *
 * SOLUTION:
 *  • The OUTER section has overflow-hidden — this clips the card during 3D transit.
 *  • The card itself is constrained to max-w-2xl and centered — it never touches
 *    the section edges, so no gradient or clip ever touches it.
 *  • The stage div (AnimatePresence parent) has NO mask, NO overflow-hidden.
 *    It's wider than the card so in-flight rotations look correct.
 *  • During animation the card may briefly appear at the edges — the section's
 *    overflow-hidden handles that cleanly without any gradient artifact.
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

const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// ── Main Component ──────────────────────────────────────────────────────
const BentoCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [activeIndex, setActiveIndex]   = useState(0);
    const [direction, setDirection]       = useState(0);
    const timerRef                        = useRef(null);
    const { theme }                       = useTheme();
    const isDark                          = theme === 'dark';

    useEffect(() => {
        (async () => {
            try {
                const res = await certificatesAPI.getAll();
                setCertificates(res.data.data);
            } catch (e) {
                console.error('Failed to fetch certificates', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const goNext = useCallback(() => {
        setDirection(1);
        setActiveIndex((p) => (p + 1) % certificates.length);
    }, [certificates.length]);

    const goPrev = useCallback(() => {
        setDirection(-1);
        setActiveIndex((p) => (p - 1 + certificates.length) % certificates.length);
    }, [certificates.length]);

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        if (certificates.length > 1) timerRef.current = setInterval(goNext, 6500);
    }, [goNext, certificates.length]);

    useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

    const handlePrev = () => { goPrev(); resetTimer(); };
    const handleNext = () => { goNext(); resetTimer(); };
    const handleDot  = (i) => {
        setDirection(i > activeIndex ? 1 : -1);
        setActiveIndex(i);
        resetTimer();
    };

    if (loading || certificates.length === 0) return null;

    return (
        /*
         * overflow-hidden on the section clips in-transit cards at screen edges.
         * This is the ONLY clip — nothing clips the resting card.
         */
        <section className="py-24 relative overflow-hidden">

            {/* ── Header ── */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-14 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-6 border-2 backdrop-blur-md shadow-lg ${
                            isDark
                                ? 'bg-gradient-to-r from-purple-500/20 to-[rgb(var(--accent))]/20 border-purple-500/30 text-purple-300'
                                : 'bg-gradient-to-r from-purple-100 to-purple-50 border-purple-300 text-purple-700'
                        }`}
                    >
                        <Award className="w-5 h-5" />
                        <span>Professional Achievements</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight"
                    >
                        Certified{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-[rgb(var(--accent))] to-pink-500">
                            Expertise
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-[rgb(var(--text-secondary))] max-w-2xl leading-relaxed"
                    >
                        Validated credentials and industry-recognized certifications showcasing continuous learning and professional excellence.
                    </motion.p>
                </div>
            </div>

            {/* ── Carousel shell ── */}
            {/*
                This outer div sets the 3D perspective space.
                It is NOT overflow-hidden — the section above handles clipping.
                The nav buttons sit outside the perspective div so they aren't distorted.
            */}
            <div className="relative w-full px-4 sm:px-6">

                {/* Perspective container — 3D space lives here */}
                <div
                    className="relative w-full"
                    style={{
                        perspective:       '1300px',
                        perspectiveOrigin: '50% 50%',
                    }}
                >
                    {/*
                        Stage: wide enough that a rotating card entering from the side
                        has room to spin. No overflow-hidden, no mask.
                        Cards are centered within; the outer section clips anything
                        that exits the viewport.
                    */}
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
                                /*
                                 * w-full + max-w-2xl keeps the card nicely contained
                                 * and well away from any edges that might look clipped.
                                 */
                                className="w-full max-w-2xl"
                                style={{
                                    willChange:     'transform, opacity',
                                    transformStyle: 'preserve-3d',
                                    transformOrigin:'center center',
                                }}
                            >
                                <TiltCard cert={certificates[activeIndex]} isDark={isDark} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Nav Buttons — outside the 3D container so they are never distorted */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous certificate"
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
                    aria-label="Next certificate"
                    className={`absolute right-0 sm:right-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                        isDark
                            ? 'bg-white/10 hover:bg-white/25 border-white/20 text-white'
                            : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800'
                    }`}
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Dots */}
                {certificates.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {certificates.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleDot(i)}
                                aria-label={`Go to certificate ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    i === activeIndex
                                        ? 'w-8 bg-gradient-to-r from-purple-500 to-[rgb(var(--accent))]'
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

// ── Tilt Card ───────────────────────────────────────────────────────────
const TiltCard = ({ cert, isDark }) => {
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
                {/* ── Certificate Image ── */}
                <div className={`relative h-52 sm:h-60 md:h-72 w-full overflow-hidden group ${
                    isDark
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900'
                        : 'bg-slate-100'
                }`}>
                    {cert.image?.url ? (
                        <>
                            <img
                                src={cert.image.url}
                                alt={cert.title || cert.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                loading="lazy"
                            />
                            {/* Subtle shine on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Award className={`w-20 h-20 sm:w-24 sm:h-24 opacity-15 ${isDark ? 'text-white' : 'text-slate-400'}`} />
                        </div>
                    )}

                    {/* Bottom fade — blends into the card content below */}
                    <div className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none ${
                        isDark
                            ? 'bg-gradient-to-t from-[rgb(var(--bg-card))] to-transparent'
                            : 'bg-gradient-to-t from-white to-transparent'
                    }`} />

                    {/* Date badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-xl">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">{formatDate(cert.issueDate || cert.date || cert.createdAt)}</span>
                    </div>

                    {/* Verified badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 rounded-xl bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-400 flex items-center gap-1.5 shadow-xl">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-semibold">Verified</span>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className={`flex-1 p-5 sm:p-6 lg:p-8 flex flex-col gap-4 ${
                    isDark ? '' : 'bg-white'
                }`}>
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3">
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {cert.title || cert.name}
                        </h3>
                        {cert.credentialUrl && (
                            <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))] hover:text-white border border-[rgb(var(--accent))]/20 transition-all duration-200 hover:scale-110"
                                title="View Certificate"
                            >
                                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                        )}
                    </div>

                    {/* Issuer */}
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-[rgb(var(--accent))]/10 flex-shrink-0">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wide font-medium">Issued by</p>
                            <p className="text-sm sm:text-base font-bold text-[rgb(var(--accent))] truncate">{cert.issuer || 'Verified Organization'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {cert.description && (
                        <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 pt-3 border-t text-[rgb(var(--text-secondary))] ${
                            isDark ? 'border-white/10' : 'border-slate-100'
                        }`}>
                            {cert.description}
                        </p>
                    )}

                    {/* Meta grid */}
                    <div className={`grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t ${
                        isDark ? 'border-white/10' : 'border-slate-100'
                    }`}>
                        <MetaBox
                            icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))]" />}
                            label="Issued"
                            value={formatDate(cert.issueDate || cert.date || cert.createdAt)}
                            isDark={isDark}
                        />
                        {cert.expiryDate ? (
                            <MetaBox
                                icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />}
                                label="Expires"
                                value={formatDate(cert.expiryDate)}
                                isDark={isDark}
                            />
                        ) : (
                            <MetaBox
                                icon={<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
                                label="Valid"
                                value="Lifetime"
                                isDark={isDark}
                            />
                        )}
                        {cert.credentialId && (
                            <MetaBox
                                icon={<Hash className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))]" />}
                                label="Credential ID"
                                value={cert.credentialId}
                                mono
                                full
                                isDark={isDark}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`mt-auto pt-3 sm:pt-4 flex items-center justify-between border-t-2 ${
                        isDark ? 'border-white/10' : 'border-slate-100'
                    }`}>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            <span className="text-xs sm:text-sm font-bold text-green-500">Verified</span>
                        </div>
                        {cert.credentialUrl && (
                            <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
                            >
                                <span className="hidden sm:inline">View Online</span>
                                <span className="sm:hidden">View</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

// ── MetaBox ─────────────────────────────────────────────────────────────
const MetaBox = ({ icon, label, value, mono, full, isDark }) => (
    <div className={`p-2.5 sm:p-3 rounded-xl border ${full ? 'col-span-2' : ''} ${
        isDark
            ? 'bg-white/[0.05] border-white/10'
            : 'bg-slate-50 border-slate-200/80'
    }`}>
        <div className="flex items-center gap-1.5 mb-1">
            {icon}
            <span className="text-[10px] sm:text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wide">{label}</span>
        </div>
        <p className={`text-xs sm:text-sm font-bold ${mono ? 'font-mono break-all' : 'truncate'} ${
            isDark ? 'text-white' : 'text-slate-800'
        }`}>
            {value}
        </p>
    </div>
);

export default BentoCertificates;