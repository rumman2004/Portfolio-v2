import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Github, Star } from 'lucide-react';
import { Button, Modal, Input, Textarea, GlassCard } from '../../components/ui';
import { projectsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        category: 'web',
        technologies: '',
        githubLink: '',
        liveLink: '',
        featured: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                shortDescription: project.shortDescription || '',
                category: project.category,
                technologies: project.technologies?.join(', ') || '',
                githubLink: project.githubLink || '',
                liveLink: project.liveLink || '',
                featured: project.featured,
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                shortDescription: '',
                category: 'web',
                technologies: '',
                githubLink: '',
                liveLink: '',
                featured: false,
            });
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'technologies') {
                    data.append(key, JSON.stringify(formData[key].split(',').map(t => t.trim())));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingProject) {
                await projectsAPI.update(editingProject._id, data);
                toast.success('Project updated successfully');
            } else {
                await projectsAPI.create(data);
                toast.success('Project created successfully');
            }

            setModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectsAPI.delete(id);
            toast.success('Project deleted successfully');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Projects</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Showcase your best work to the world
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-xl shadow-[rgb(var(--accent))]/20">
                    Add New Project
                </Button>
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {projects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard
                                    className={`h-full flex flex-col group relative overflow-hidden ${project.featured ? 'border-2 border-[rgb(var(--accent))]/30' : ''}`}
                                >
                                    {/* Featured Badge */}
                                    {project.featured && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" /> Featured
                                            </span>
                                        </div>
                                    )}

                                    {/* Image Container */}
                                    <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img
                                            src={project.image.url}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-between items-end">
                                            <span className="text-white font-mono text-xs opacity-80 bg-black/30 px-2 py-1 rounded-md backdrop-blur-md">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-[rgb(var(--accent))] transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-[rgb(var(--text-secondary))] text-sm mb-4 line-clamp-2">
                                            {project.shortDescription || project.description}
                                        </p>

                                        {/* Tech Stack Pills */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.technologies?.slice(0, 4).map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 text-xs rounded-md bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] border border-[rgb(var(--border))]"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 4 && (
                                                <span className="px-2 py-1 text-xs rounded-md bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))]">
                                                    +{project.technologies.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Links & Actions */}
                                    <div className="pt-4 border-t border-[rgb(var(--border))] space-y-4">
                                        <div className="flex gap-4 text-sm">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors">
                                                    <Github className="w-4 h-4" /> Code
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors">
                                                    <ExternalLink className="w-4 h-4" /> Live Demo
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={Edit}
                                                onClick={() => handleOpenModal(project)}
                                                className="flex-1"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                icon={Trash2}
                                                onClick={() => handleDelete(project._id)}
                                            />
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                    <p className="text-[rgb(var(--text-secondary))] text-lg mb-4">
                        No projects yet. Add your first project!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Project
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingProject ? 'Edit Project' : 'New Project'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Project Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. E-Commerce Platform"
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                            >
                                <option value="web">Web Development</option>
                                <option value="mobile">Mobile App</option>
                                <option value="fullstack">Full Stack</option>
                                <option value="design">UI/UX Design</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Technologies (comma separated)"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <Textarea
                        label="Short Description (Card View)"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows={2}
                        placeholder="A brief catchy summary..."
                    />

                    <Textarea
                        label="Full Description (Detail View)"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        required
                        placeholder="Detailed explanation of features, challenges, and solutions..."
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="GitHub Repo"
                            name="githubLink"
                            value={formData.githubLink}
                            onChange={handleChange}
                            icon={Github}
                            placeholder="https://github.com/..."
                        />

                        <Input
                            label="Live Demo URL"
                            name="liveLink"
                            value={formData.liveLink}
                            onChange={handleChange}
                            icon={ExternalLink}
                            placeholder="https://myproject.com"
                        />
                    </div>

                    <div className="p-4 rounded-xl bg-[rgb(var(--bg-secondary))]/50 border border-[rgb(var(--border))]">
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Project Thumbnail
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-[rgb(var(--text-secondary))]
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[rgb(var(--accent))]/10 file:text-[rgb(var(--accent))]
                                hover:file:bg-[rgb(var(--accent))]/20"
                            required={!editingProject}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgb(var(--border))]">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 text-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]"
                        />
                        <label htmlFor="featured" className="text-sm font-medium cursor-pointer select-none">
                            Mark as Featured Project (Shows on Home)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={submitting}
                        >
                            {editingProject ? 'Save Changes' : 'Create Project'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageProjects;