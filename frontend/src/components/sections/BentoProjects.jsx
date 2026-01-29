import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ExternalLink, Github, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

const BentoProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsAPI.getAll();
                const allProjects = response.data.data;
                const featuredProjects = allProjects.filter(p => p.featured);
                const projectData = featuredProjects.length > 0 ? featuredProjects : allProjects;
                setProjects(projectData);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (projects.length <= 1) return;
        const interval = setInterval(() => {
            handleNext();
        }, 6000);
        return () => clearInterval(interval);
    }, [projects.length, activeIndex]);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % projects.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    if (loading || projects.length === 0) return null;

    // Variants optimized for mobile responsiveness
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.7,
            rotateX: 10,
            rotateY: direction > 0 ? -15 : 15,
            zIndex: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateX: 5, // Reduced default tilt for mobile safety
            rotateY: 0,
            zIndex: 10,
            transition: {
                duration: 0.6,
                type: "spring",
                stiffness: 120,
                damping: 20
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
            scale: 0.7,
            rotateX: 10,
            rotateY: direction > 0 ? 15 : -15,
            zIndex: 0,
            transition: { duration: 0.5 }
        })
    };

    return (
        <section className="py-12 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 border-2 backdrop-blur-md shadow-lg ${isDark
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
                        Completed <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-[rgb(var(--accent))] to-purple-500">Projects</span>
                    </motion.h2>
                </div>
            </div>

            {/* Dynamic Perspective based on screen size */}
            <div className="relative w-full max-w-7xl mx-auto h-[450px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex items-center justify-center px-4 overflow-visible perspective-800 md:perspective-1200">

                {/* Desktop-only Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-8 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 text-white flex"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-8 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110 active:scale-95 text-white flex"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            whileHover={{
                                scale: 1.02,
                                rotateX: 0,
                                rotateY: 0,
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                            className="absolute w-full max-w-sm md:max-w-4xl cursor-pointer"
                        >
                            <ProjectCard project={projects[activeIndex]} isDark={isDark} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-30">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > activeIndex ? 1 : -1);
                                setActiveIndex(index);
                            }}
                            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                ? 'w-6 md:w-8 bg-gradient-to-r from-blue-500 to-[rgb(var(--accent))]'
                                : 'w-1.5 md:w-2 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, isDark }) => {
    return (
        <GlassCard className="w-full flex flex-col md:flex-row overflow-hidden border border-white/10 !bg-opacity-40 shadow-xl backdrop-blur-xl h-auto md:h-[450px] lg:h-[500px]">
            {/* Image Side */}
            <div className="w-full md:w-1/2 lg:w-3/5 relative h-48 sm:h-64 md:h-full bg-[rgb(var(--bg-secondary))] overflow-hidden group">
                {project.image?.url ? (
                    <img
                        src={project.image.url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 md:w-20 md:h-20 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r opacity-70" />

                <div className="absolute top-3 left-3 md:top-6 md:left-6 px-3 py-1 md:px-4 md:py-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] md:text-sm font-medium text-white flex items-center gap-2">
                    <Layers className="w-3 h-3 md:w-4 md:h-4" />
                    {project.category}
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 lg:w-2/5 p-5 md:p-8 lg:p-10 flex flex-col gap-4 md:gap-6 bg-gradient-to-br from-white/5 to-transparent relative">
                <div className="flex justify-between items-start">
                    <h3 className={`text-xl md:text-3xl lg:text-4xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {project.title}
                    </h3>
                </div>

                <p className={`text-xs md:text-sm lg:text-base text-[rgb(var(--text-secondary))] leading-relaxed line-clamp-3 md:line-clamp-4 font-medium`}>
                    {project.description}
                </p>

                <div className="mt-auto">
                    <div className="flex flex-wrap gap-1.5 md:gap-2.5 mb-4 md:mb-6">
                        {project.technologies?.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 md:px-3 md:py-1.5 rounded-md text-[9px] md:text-xs font-semibold bg-[rgb(var(--bg-secondary))]/80 border border-[rgb(var(--border))]">
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-2 md:gap-4 pt-4 border-t border-white/10">
                        {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-[10px] md:text-xs lg:text-sm font-semibold">
                                <Github className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                <span>Source</span>
                            </a>
                        )}
                        {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-xl bg-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/30 text-[rgb(var(--accent))] transition-all border border-[rgb(var(--accent))]/30 text-[10px] md:text-xs lg:text-sm font-semibold shadow-lg">
                                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                                <span>Live Demo</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default BentoProjects;