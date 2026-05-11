import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projectsAPI } from '../../services/api';
import { GlassCard, Badge, Button } from '../../components/ui';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Github, Filter, X, Maximize2, Monitor,
    AlertCircle, Code2, Globe, Info
} from 'lucide-react';
import Loader from '../../components/ui/Loader';

gsap.registerPlugin(ScrollTrigger);

/*
 * Fonts: Syne 800 (headings) + DM Mono 300/400 (labels, meta, tags)
 * GSAP handles page-level entrance & scroll animations.
 * AnimatePresence/motion kept ONLY for the project detail modal (layoutId
 * requires Framer's shared-layout engine — replacing that would lose the
 * card-expansion effect).
 */

const WorkPage = () => {
    const [projects, setProjects]               = useState([]);
    const [loading, setLoading]                 = useState(true);
    const [filter, setFilter]                   = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab]             = useState('preview');

    /* refs */
    const sectionRef  = useRef(null);
    const tagRef      = useRef(null);
    const rulerRef    = useRef(null);
    const headingRef  = useRef(null);
    const subRef      = useRef(null);
    const filterRef   = useRef(null);
    const gridRef     = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const r = await projectsAPI.getAll();
                setProjects(r.data.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    useEffect(() => {
        if (selectedProject) setActiveTab('preview');
    }, [selectedProject]);

    /* ── GSAP entrance ── */
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {

            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            /* 1 · Tag: slide from left */
            tl.fromTo(tagRef.current,
                { x: -36, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.9 }, 0.1
            );

            /* 2 · Ruler: scaleX expand */
            tl.fromTo(rulerRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 1.2 }, 0.22
            );

            /* 3 · Heading: rise + deskew */
            tl.fromTo(headingRef.current,
                { y: 64, opacity: 0, skewY: 2.5 },
                { y: 0, opacity: 1, skewY: 0, duration: 1.15 }, 0.3
            );

            /* 4 · Sub: fade up */
            tl.fromTo(subRef.current,
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9 }, 0.55
            );

            /* 5 · Filter pills: stagger in */
            tl.fromTo(
                filterRef.current?.querySelectorAll('.filter-pill') ?? [],
                { y: 16, opacity: 0, scale: 0.92 },
                { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.06 },
                0.65
            );

            /* 6 · Project cards: staggered rise */
            const cards = gridRef.current?.querySelectorAll('.project-card') ?? [];
            gsap.fromTo(cards,
                { y: 48, opacity: 0, scale: 0.96 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.75, ease: 'expo.out',
                    stagger: 0.08,
                    scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
                }
            );

        }, sectionRef.current);

        return () => ctx.revert();
    }, [loading]);

    const categories = ['all', 'web', 'mobile', 'fullstack', 'design', 'other'];
    const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category?.toLowerCase() === filter.toLowerCase());

    /* Re-animate cards when filter changes */
    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll('.project-card');
        if (cards.length === 0) return;

        // Kill any existing tweens on these elements to prevent conflicts
        gsap.killTweensOf(cards);

        gsap.fromTo(cards,
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', stagger: 0.07 }
        );
    }, [filter, filteredProjects.length]);

    if (loading) return <Loader fullScreen size="lg" />;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
                .work-heading { font-family: 'Syne', sans-serif; font-weight: 800; }
                .work-mono    { font-family: 'DM Mono', monospace; }
                .bg-grid-subtle {
                    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 64px 64px;
                }
                /* Project card hover */
                .project-card {
                    transition: transform 0.3s cubic-bezier(0.23,1,0.32,1),
                                box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .project-card:hover {
                    transform: translateY(-8px);
                }
                /* Filter pill */
                .filter-pill {
                    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }
                .filter-pill:hover { transform: translateY(-2px); }
            `}</style>

            <div className="min-h-screen bg-grid-subtle" ref={sectionRef}>
                <section className="container mx-auto px-4 py-12 sm:py-20">

                    {/* ── Header ── */}
                    <div className="mb-12 sm:mb-16">

                        {/* Tag row */}
                        <div
                            ref={tagRef}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0 }}
                        >
                            <span className="work-mono" style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgb(var(--accent))', opacity: 0.8 }}>
                                03 /
                            </span>
                            <span className="work-mono" style={{ fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>
                                Selected Works
                            </span>
                            <div
                                ref={rulerRef}
                                style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }}
                            />
                            <Code2 style={{ width: '0.8rem', height: '0.8rem', color: 'rgb(var(--accent))', opacity: 0.5, flexShrink: 0 }} />
                        </div>

                        {/* Heading */}
                        <h1
                            ref={headingRef}
                            className="work-heading"
                            style={{ fontSize: 'clamp(3rem, 7.5vw, 6.5rem)', lineHeight: 0.9, letterSpacing: '-0.035em', color: 'rgb(var(--text-primary))', marginBottom: '1.5rem', opacity: 0 }}
                        >
                            My{' '}
                            <em style={{ color: 'rgb(var(--accent))', fontStyle: 'italic', fontWeight: 800 }}>Work</em>
                        </h1>

                        {/* Sub */}
                        <p
                            ref={subRef}
                            className="work-mono"
                            style={{ fontWeight: 300, fontSize: 'clamp(0.78rem, 1vw, 0.9rem)', lineHeight: 1.85, letterSpacing: '0.01em', color: 'rgb(var(--text-secondary))', maxWidth: '50ch', opacity: 0 }}
                        >
                            Explore my projects with interactive live previews — each one built with care and attention to detail.
                        </p>
                    </div>

                    {/* ── Filter pills ── */}
                    <div
                        ref={filterRef}
                        className="flex flex-wrap justify-center items-center gap-3 mb-10 sm:mb-14"
                    >
                        <Filter style={{ width: '0.85rem', height: '0.85rem', color: 'rgb(var(--text-secondary))', opacity: 0.5 }} />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`filter-pill px-5 py-2 rounded-full ${filter === cat ? 'bg-[rgb(var(--accent))] text-white' : 'glass hover:bg-[rgb(var(--accent))]/20'}`}
                            >
                                <span
                                    className="work-mono"
                                    style={{ fontWeight: filter === cat ? 400 : 300, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                                >
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* ── Projects grid ── */}
                    <div
                        ref={gridRef}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20"
                    >
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project._id}
                                layoutId={`project-card-${project._id}`}
                                onClick={() => setSelectedProject(project)}
                                className="project-card"
                            >
                                <GlassCard className="h-full flex flex-col group">
                                    {/* Image */}
                                    <div className="relative overflow-hidden rounded-lg mb-4 h-48 sm:h-56">
                                        <img
                                            src={project.image.url}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span
                                                className="work-mono px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center gap-2"
                                                style={{ fontWeight: 400, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                                            >
                                                <Maximize2 className="w-4 h-4" /> View Details
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3
                                                className="work-heading line-clamp-1"
                                                style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}
                                            >
                                                {project.title}
                                            </h3>
                                            {project.featured && <Badge variant="warning">Featured</Badge>}
                                        </div>
                                        <p
                                            className="work-mono mb-4 line-clamp-2"
                                            style={{ fontWeight: 300, fontSize: '0.75rem', lineHeight: 1.8, color: 'rgb(var(--text-secondary))' }}
                                        >
                                            {project.description}
                                        </p>
                                        <div className="mt-auto flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 3).map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="work-mono px-2.5 py-1 rounded-md bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))]"
                                                    style={{ fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.1em' }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 3 && (
                                                <span
                                                    className="work-mono self-center"
                                                    style={{ fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.08em', color: 'rgb(var(--text-secondary))' }}
                                                >
                                                    +{project.technologies.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Project detail modal (Framer layoutId kept for card-expand animation) ── */}
                    <AnimatePresence>
                        {selectedProject && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                />

                                <motion.div
                                    layoutId={`project-card-${selectedProject._id}`}
                                    className="relative w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-[rgb(var(--bg-card))] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                                >
                                    {/* Mobile tab bar */}
                                    <div className="lg:hidden flex items-center justify-center gap-4 p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg-secondary))]/50 backdrop-blur-sm shrink-0">
                                        {[
                                            { id: 'preview', Icon: Monitor, label: 'Preview' },
                                            { id: 'details', Icon: Info,    label: 'Details' },
                                        ].map(({ id, Icon, label }) => (
                                            <button
                                                key={id}
                                                onClick={() => setActiveTab(id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === id ? 'bg-[rgb(var(--accent))] text-white shadow-lg' : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))]'}`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="work-mono" style={{ fontWeight: 400, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                                            </button>
                                        ))}
                                        <button onClick={() => setSelectedProject(null)} className="ml-auto p-2 rounded-full hover:bg-[rgb(var(--bg-secondary))] transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 overflow-hidden lg:grid lg:grid-cols-4 lg:gap-4 lg:p-4">

                                        {/* Preview pane */}
                                        <div className={`lg:col-span-3 flex-col bg-white lg:rounded-xl overflow-hidden border border-[rgb(var(--border))] ${activeTab === 'preview' ? 'flex h-full' : 'hidden lg:flex'}`}>
                                            <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                                </div>
                                                <div className="flex-1 mx-4 bg-white h-7 rounded shadow-sm flex items-center px-3 truncate">
                                                    <Monitor className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
                                                    <span className="work-mono text-gray-500 truncate" style={{ fontWeight: 300, fontSize: '0.65rem' }}>
                                                        {selectedProject.liveLink || 'Local Preview'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 relative bg-gray-50">
                                                {selectedProject.liveLink ? (
                                                    <iframe src={selectedProject.liveLink} title="Preview" className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-forms" loading="lazy" />
                                                ) : (
                                                    <img src={selectedProject.image.url} alt="Preview" className="w-full h-full object-contain" />
                                                )}
                                                <div className="absolute inset-0 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Sidebar */}
                                        <div className={`lg:col-span-1 flex-col bg-[rgb(var(--bg-card))] lg:rounded-xl lg:border lg:border-[rgb(var(--border))] lg:shadow-sm overflow-hidden ${activeTab === 'details' ? 'flex h-full' : 'hidden lg:flex'}`}>
                                            <div className="hidden lg:flex justify-end p-4 pb-2 shrink-0">
                                                <button onClick={() => setSelectedProject(null)} className="p-2 rounded-full hover:bg-[rgb(var(--bg-secondary))] transition-colors">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <Badge variant="accent">{selectedProject.category}</Badge>
                                                        {selectedProject.featured && <Badge variant="warning">Featured</Badge>}
                                                    </div>
                                                    <h2
                                                        className="work-heading leading-tight mb-3"
                                                        style={{ fontSize: '1.4rem', letterSpacing: '-0.025em' }}
                                                    >
                                                        {selectedProject.title}
                                                    </h2>
                                                    <p
                                                        className="work-mono leading-relaxed"
                                                        style={{ fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.85, color: 'rgb(var(--text-secondary))' }}
                                                    >
                                                        {selectedProject.description}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className="work-mono mb-3"
                                                        style={{ fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}
                                                    >
                                                        Tech Stack
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedProject.technologies?.map((tech, i) => (
                                                            <span
                                                                key={i}
                                                                className="work-mono px-2.5 py-1 rounded-md bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))]"
                                                                style={{ fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.08em' }}
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop action buttons */}
                                            <div className="hidden lg:flex flex-col gap-3 p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--bg-secondary))]/30 shrink-0">
                                                {selectedProject.liveLink && (
                                                    <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                                        <Button className="w-full py-2.5 text-sm shadow-lg shadow-[rgb(var(--accent))]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                            <Globe className="w-4 h-4" /> Live Demo
                                                        </Button>
                                                    </a>
                                                )}
                                                {selectedProject.githubLink && (
                                                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                                        <Button variant="outline" className="w-full py-2.5 text-sm border-2 hover:scale-[1.02] active:scale-95 transition-all">
                                                            <Code2 className="w-4 h-4" /> Source Code
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile action buttons */}
                                    <div className="lg:hidden flex flex-row items-center justify-center gap-3 p-4 bg-[rgb(var(--bg-card))] border-t border-[rgb(var(--border))] shrink-0">
                                        {selectedProject.liveLink && (
                                            <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                                                <Button className="w-full py-3 text-sm shadow-lg shadow-[rgb(var(--accent))]/20 active:scale-95 transition-all">
                                                    <Globe className="w-4 h-4" /> Live Demo
                                                </Button>
                                            </a>
                                        )}
                                        {selectedProject.githubLink && (
                                            <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                                                <Button variant="outline" className="w-full py-3 text-sm border-2 active:scale-95 transition-all">
                                                    <Code2 className="w-4 h-4" /> Source Code
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {filteredProjects.length === 0 && (
                        <div className="text-center py-12 sm:py-20">
                            <p className="work-mono" style={{ fontWeight: 300, fontSize: '0.85rem', letterSpacing: '0.06em', color: 'rgb(var(--text-secondary))' }}>
                                No projects found in this category
                            </p>
                        </div>
                    )}

                </section>
            </div>
        </>
    );
};

export default WorkPage;