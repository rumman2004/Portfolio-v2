import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { projectsAPI } from '../../services/api';
import { GlassCard, Badge, Button } from '../../components/ui';
import { Github, Filter, X, Maximize2, Monitor, AlertCircle, Code2, Globe, Info } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const WorkPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);

    // State to toggle between Preview and Details on Mobile
    const [activeTab, setActiveTab] = useState('preview');

    useEffect(() => {
        fetchData();
    }, []);

    // Reset tab to 'preview' whenever a new project is opened
    useEffect(() => {
        if (selectedProject) {
            setActiveTab('preview');
        }
    }, [selectedProject]);

    const fetchData = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'web', 'mobile', 'fullstack', 'other'];

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">My Work</h1>
                    <p className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto px-4">
                        Explore my projects with interactive live previews.
                    </p>
                </motion.div>

                {/* Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center items-center gap-3 mb-8 sm:mb-12"
                >
                    <Filter className="w-5 h-5 text-[rgb(var(--text-secondary))]" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 sm:px-6 py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${filter === cat
                                ? 'bg-[rgb(var(--accent))] text-white'
                                : 'glass hover:bg-[rgb(var(--accent))]/20'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            layoutId={`project-card-${project._id}`}
                            onClick={() => setSelectedProject(project)}
                            className="cursor-pointer"
                        >
                            <GlassCard className="h-full flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
                                {/* Project Image */}
                                <div className="relative overflow-hidden rounded-lg mb-4 h-48 sm:h-56">
                                    <img
                                        src={project.image.url}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-medium flex items-center gap-2">
                                            <Maximize2 className="w-4 h-4" /> View Details
                                        </span>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg sm:text-xl font-semibold line-clamp-1">{project.title}</h3>
                                        {project.featured && (
                                            <Badge variant="warning">Featured</Badge>
                                        )}
                                    </div>

                                    <p className="text-[rgb(var(--text-secondary))] text-sm mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {project.technologies?.slice(0, 3).map((tech, i) => (
                                            <Badge key={i} variant="info" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.technologies?.length > 3 && (
                                            <span className="text-xs text-[rgb(var(--text-secondary))] self-center">
                                                +{project.technologies.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Project Detail Modal */}
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

                            {/* Modal Container */}
                            <motion.div
                                layoutId={`project-card-${selectedProject._id}`}
                                className="relative w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-[rgb(var(--bg-card))] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                            >
                                {/* Mobile/Tablet Tab Bar */}
                                <div className="lg:hidden flex items-center justify-center gap-4 p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg-secondary))]/50 backdrop-blur-sm shrink-0">
                                    <button
                                        onClick={() => setActiveTab('preview')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${activeTab === 'preview'
                                            ? 'bg-[rgb(var(--accent))] text-white shadow-lg'
                                            : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))]'
                                            }`}
                                    >
                                        <Monitor className="w-4 h-4" /> Preview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${activeTab === 'details'
                                            ? 'bg-[rgb(var(--accent))] text-white shadow-lg'
                                            : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))]'
                                            }`}
                                    >
                                        <Info className="w-4 h-4" /> Details
                                    </button>

                                    {/* Mobile Close Button */}
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="ml-auto p-2 rounded-full hover:bg-[rgb(var(--bg-secondary))] transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* CONTENT AREA */}
                                <div className="flex-1 overflow-hidden lg:grid lg:grid-cols-4 lg:gap-4 lg:p-4">

                                    {/* 1. WINDOW / PREVIEW AREA */}
                                    <div className={`
                                        lg:col-span-3 flex-col bg-white lg:rounded-xl overflow-hidden border border-[rgb(var(--border))]
                                        ${activeTab === 'preview' ? 'flex h-full' : 'hidden lg:flex'}
                                    `}>
                                        {/* Browser Toolbar */}
                                        <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                            </div>
                                            <div className="flex-1 mx-4 bg-white h-7 rounded shadow-sm flex items-center px-3 text-xs text-gray-500 truncate">
                                                <Monitor className="w-3 h-3 mr-2" />
                                                {selectedProject.liveLink || 'Local Preview'}
                                            </div>
                                        </div>

                                        {/* Iframe/Image */}
                                        <div className="flex-1 relative bg-gray-50">
                                            {selectedProject.liveLink ? (
                                                <iframe
                                                    src={selectedProject.liveLink}
                                                    title="Preview"
                                                    className="w-full h-full border-0"
                                                    sandbox="allow-scripts allow-same-origin allow-forms"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <img
                                                    src={selectedProject.image.url}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                            {/* Interaction overlay for safety */}
                                            <div className="absolute inset-0 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* 2. SIDEBAR (Desktop) - Details + Buttons */}
                                    <div className={`
                                        lg:col-span-1 flex-col bg-[rgb(var(--bg-card))] lg:rounded-xl lg:border lg:border-[rgb(var(--border))] lg:shadow-sm overflow-hidden
                                        ${activeTab === 'details' ? 'flex h-full' : 'hidden lg:flex'}
                                    `}>
                                        {/* Desktop Close Button */}
                                        <div className="hidden lg:flex justify-end p-4 pb-2 shrink-0">
                                            <button
                                                onClick={() => setSelectedProject(null)}
                                                className="p-2 rounded-full hover:bg-[rgb(var(--bg-secondary))] transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Details Content - Scrollable */}
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0 space-y-6">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    <Badge variant="accent">{selectedProject.category}</Badge>
                                                    {selectedProject.featured && <Badge variant="warning">Featured</Badge>}
                                                </div>
                                                <h2 className="text-2xl font-bold leading-tight mb-3">{selectedProject.title}</h2>
                                                <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">
                                                    {selectedProject.description}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--text-secondary))] mb-3">Tech Stack</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.technologies?.map((tech, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))]">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons - Fixed at bottom for Desktop */}
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

                                {/* Mobile/Tablet Action Buttons - Fixed at Bottom */}
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
                        <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg">
                            No projects found in this category
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default WorkPage;