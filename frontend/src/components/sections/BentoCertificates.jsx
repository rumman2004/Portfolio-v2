import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle, ChevronRight, ChevronLeft, Shield, Hash } from 'lucide-react';
import { certificatesAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

const BentoCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await certificatesAPI.getAll();
                setCertificates(response.data.data);
            } catch (error) {
                console.error("Failed to fetch certificates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    // Auto-advance slide every 6 seconds (increased for more reading time)
    useEffect(() => {
        if (certificates.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % certificates.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [certificates.length]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % certificates.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    };

    if (loading) return null;
    if (certificates.length === 0) return null;

    // Enhanced 3D Animation Variants
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.7,
            rotateY: direction > 0 ? -60 : 60,
            rotateX: -15,
            zIndex: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            zIndex: 1,
            transition: {
                duration: 0.9,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
            scale: 0.7,
            rotateY: direction > 0 ? 60 : -60,
            rotateX: 15,
            zIndex: 0,
            transition: {
                duration: 0.7,
                ease: "easeInOut"
            }
        })
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-6 border-2 backdrop-blur-md shadow-lg ${isDark
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
                        Certified <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-[rgb(var(--accent))] to-pink-500">Expertise</span>
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

            {/* 3D Carousel Container - Responsive Heights */}
            <div className="relative w-full max-w-7xl mx-auto h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] flex items-center justify-center px-4 sm:px-6">

                {/* Navigation Buttons - Enhanced Design */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 lg:left-8 z-20 p-2.5 sm:p-3 lg:p-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 text-white"
                    aria-label="Previous certificate"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 lg:right-8 z-20 p-2.5 sm:p-3 lg:p-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 text-white"
                    aria-label="Next certificate"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Certificate Card Container with 3D Perspective */}
                <div className="relative w-full h-full" style={{ perspective: '1500px' }}>
                    <AnimatePresence mode="wait" initial={false} custom={1}>
                        <motion.div
                            key={activeIndex}
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <TiltCard cert={certificates[activeIndex]} isDark={isDark} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-2 sm:bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {certificates.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`transition-all duration-300 rounded-full ${index === activeIndex
                                    ? 'w-6 sm:w-8 lg:w-10 h-2 bg-gradient-to-r from-purple-500 to-[rgb(var(--accent))] shadow-lg shadow-purple-500/50'
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to certificate ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Enhanced Sub-component for interactive 3D Hover Tilt ---
const TiltCard = ({ cert, isDark }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-200, 200], [8, -8]);
    const rotateY = useTransform(x, [-200, 200], [-8, 8]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 400);
        y.set(yPct * 400);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4"
            transition={{ duration: 0.3 }}
        >
            <GlassCard className="w-full flex flex-col overflow-hidden border-2 border-white/30 !bg-opacity-30 shadow-2xl backdrop-blur-2xl">

                {/* Image Section - Responsive Heights */}
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 w-full bg-gradient-to-br from-[rgb(var(--bg-secondary))]/80 to-[rgb(var(--bg-secondary))]/40 overflow-hidden group">
                    {cert.image?.url ? (
                        <>
                            <img
                                src={cert.image.url}
                                alt={cert.title || cert.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Award className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-20 text-[rgb(var(--text-secondary))]" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgb(var(--bg-card))]/60" />

                    {/* Date Badge - Responsive */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/20 font-semibold text-white flex items-center gap-1.5 sm:gap-2 shadow-2xl">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{formatDate(cert.issueDate || cert.date || cert.createdAt)}</span>
                    </div>

                    {/* Verified Badge - Responsive */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-400 flex items-center gap-1.5 sm:gap-2 shadow-xl">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-semibold">Verified</span>
                    </div>
                </div>

                {/* Content Section - No Scroll, Responsive Padding */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 bg-[rgb(var(--bg-card))]/95 backdrop-blur-2xl">
                    {/* Title Section */}
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                            <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'
                                }`}>
                                {cert.title || cert.name}
                            </h3>
                            {cert.credentialUrl && (
                                <a
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-[rgb(var(--accent))]/20 to-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] hover:from-[rgb(var(--accent))] hover:to-[rgb(var(--accent))]/80 hover:text-white transition-all transform hover:scale-110 shadow-lg border border-[rgb(var(--accent))]/20"
                                    title="View Certificate"
                                >
                                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            )}
                        </div>

                        {/* Issuer */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-[rgb(var(--accent))]/10 flex-shrink-0">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wide font-medium">
                                    Issued by
                                </p>
                                <p className="text-sm sm:text-base lg:text-lg font-bold text-[rgb(var(--accent))] truncate">
                                    {cert.issuer || 'Verified Organization'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description - Limit Lines on Mobile */}
                    {cert.description && (
                        <div className="pt-2 sm:pt-3 border-t border-[rgb(var(--border))]">
                            <p className="text-xs sm:text-sm lg:text-base text-[rgb(var(--text-secondary))] leading-relaxed line-clamp-2 sm:line-clamp-3">
                                {cert.description}
                            </p>
                        </div>
                    )}

                    {/* Credential Details Grid - Responsive */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-[rgb(var(--border))]">
                        {/* Issue Date */}
                        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[rgb(var(--bg-secondary))]/50 border border-[rgb(var(--border))]">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))] flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wide">
                                    Issued
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold truncate">
                                {formatDate(cert.issueDate || cert.date || cert.createdAt)}
                            </p>
                        </div>

                        {/* Expiry Date or Placeholder */}
                        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[rgb(var(--bg-secondary))]/50 border border-[rgb(var(--border))]">
                            {cert.expiryDate ? (
                                <>
                                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                                        <span className="text-[10px] sm:text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wide">
                                            Expires
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold truncate">
                                        {formatDate(cert.expiryDate)}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-[10px] sm:text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wide">
                                            Valid
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold">
                                        Lifetime
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Credential ID - Full Width if exists */}
                        {cert.credentialId && (
                            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[rgb(var(--bg-secondary))]/50 border border-[rgb(var(--border))] col-span-2">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))] flex-shrink-0" />
                                    <span className="text-[10px] sm:text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wide">
                                        Credential ID
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm font-mono font-bold break-all">
                                    {cert.credentialId}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Verification Footer - Responsive */}
                    <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between border-t-2 border-[rgb(var(--border))] gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-green-500">
                                Verified
                            </span>
                        </div>
                        {cert.credentialUrl && (
                            <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-[rgb(var(--accent))] hover:underline flex items-center gap-1 flex-shrink-0"
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

export default BentoCertificates;