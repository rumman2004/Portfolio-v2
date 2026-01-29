import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit, Trash2, Layers, Code, Database, Terminal,
    Cpu, Wrench, Cloud, Server, X, ChevronUp, ChevronDown
} from 'lucide-react';
import { Button, Input, Badge, GlassCard } from '../../components/ui';
import { skillsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import { skillIconMap, getSkillIcon } from '../../components/icons';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'frontend',
        proficiency: 50,
        iconName: '',
    });
    const [iconFile, setIconFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [useBuiltInIcon, setUseBuiltInIcon] = useState(true);

    const categoryOptions = [
        { value: 'frontend', label: 'Frontend', icon: Layers },
        { value: 'backend', label: 'Backend', icon: Server },
        { value: 'database', label: 'Database', icon: Database },
        { value: 'languages', label: 'Languages', icon: Code },
        { value: 'tools', label: 'Tools', icon: Wrench },
        { value: 'devops', label: 'DevOps', icon: Cloud },
    ];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await skillsAPI.getGrouped();
            setSkills(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (skill = null) => {
        if (skill) {
            setEditingSkill(skill);
            setFormData({
                name: skill.name,
                category: skill.category,
                proficiency: skill.proficiency,
                iconName: skill.iconName || '',
            });
        } else {
            setEditingSkill(null);
            setFormData({
                name: '',
                category: 'frontend',
                proficiency: 50,
                iconName: '',
            });
        }
        setIconFile(null);
        setUseBuiltInIcon(true);
        setFormOpen(true);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingSkill(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            if (!useBuiltInIcon && iconFile) {
                data.append('image', iconFile);
            }

            if (editingSkill) {
                await skillsAPI.update(editingSkill._id, data);
                toast.success('Skill updated successfully');
            } else {
                await skillsAPI.create(data);
                toast.success('Skill created successfully');
            }

            setFormOpen(false);
            setEditingSkill(null);
            fetchSkills();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;

        try {
            await skillsAPI.delete(id);
            toast.success('Skill deleted successfully');
            fetchSkills();
        } catch (error) {
            toast.error('Failed to delete skill');
        }
    };

    const getIconComponent = (skill) => {
        const iconKey = skill.iconName || skill.name.toLowerCase().replace(/\s+/g, '');
        const IconComponent = getSkillIcon(iconKey);

        if (IconComponent) {
            return <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-[rgb(var(--accent))]" />;
        }

        if (skill.icon?.url) {
            return (
                <img
                    src={skill.icon.url}
                    alt={skill.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md"
                />
            );
        }
        return <Code className="w-8 h-8 sm:w-10 sm:h-10 text-[rgb(var(--text-secondary))]" />;
    };

    const getPreviewIcon = () => {
        if (useBuiltInIcon && formData.iconName) {
            const IconComponent = getSkillIcon(formData.iconName);
            if (IconComponent) return <IconComponent className="w-12 h-12 text-[rgb(var(--accent))]" />;
        } else if (iconFile) {
            return <img src={URL.createObjectURL(iconFile)} alt="Preview" className="w-12 h-12 object-contain" />;
        }
        return (
            <div className="flex flex-col items-center justify-center gap-1">
                <Code className="w-8 h-8 text-[rgb(var(--text-secondary))]/50" />
                <span className="text-[10px] text-[rgb(var(--text-secondary))]/70">Preview</span>
            </div>
        );
    };

    const getCategoryLabel = (catValue) => {
        const cat = categoryOptions.find(c => c.value === catValue);
        return cat ? cat.label : catValue.replace(/_/g, ' & ');
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <>
            <style>{`
                /* Custom range slider styling */
                input[type="range"].slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgb(var(--accent));
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                }
                
                input[type="range"].slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                input[type="range"].slider-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgb(var(--accent));
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                }
                
                input[type="range"].slider-thumb::-moz-range-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgb(var(--bg-secondary));
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgb(var(--accent));
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--accent), 0.8);
                }
            `}</style>

            <div className="space-y-6 sm:space-y-8 pb-8 px-4 sm:px-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Manage Skills</h1>
                        <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                            Curate your technical expertise
                        </p>
                    </div>
                    <Button
                        icon={formOpen ? ChevronUp : Plus}
                        onClick={() => formOpen ? handleCloseForm() : handleOpenForm()}
                        className="w-full sm:w-auto shadow-lg shadow-[rgb(var(--accent))]/20"
                    >
                        {formOpen ? 'Close Form' : 'Add Skill'}
                    </Button>
                </div>

                {/* Add/Edit Form - Collapsible at Top */}
                <AnimatePresence>
                    {formOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <GlassCard className="p-4 sm:p-6 lg:p-8 border-2 border-[rgb(var(--accent))]/30">
                                {/* Form Header */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgb(var(--border))]">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--text-primary))] mb-1">
                                            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">
                                            {editingSkill ? 'Update your skill details below' : 'Fill in the details to add a new skill'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleCloseForm}
                                        className="p-2 hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-colors"
                                        aria-label="Close form"
                                    >
                                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>

                                {/* Form Content */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Row 1: Name and Category */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Name Input */}
                                        <div>
                                            <Input
                                                label="Skill Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. React, Python, Docker"
                                                required
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label htmlFor="category-select" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                                                Category
                                            </label>
                                            <select
                                                id="category-select"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 glass rounded-xl text-sm text-[rgb(var(--text-primary))] outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all"
                                            >
                                                {categoryOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row 2: Proficiency */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label htmlFor="proficiency-range" className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                                                Proficiency Level
                                            </label>
                                            <span className="text-2xl font-bold text-[rgb(var(--accent))] min-w-[70px] text-right">
                                                {formData.proficiency}%
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                id="proficiency-range"
                                                type="range"
                                                name="proficiency"
                                                min="0"
                                                max="100"
                                                value={formData.proficiency}
                                                onChange={handleChange}
                                                className="w-full h-3 bg-[rgb(var(--bg-secondary))] rounded-full appearance-none cursor-pointer slider-thumb"
                                                aria-label="Proficiency level"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(var(--accent)) 0%, rgb(var(--accent)) ${formData.proficiency}%, rgb(var(--bg-secondary)) ${formData.proficiency}%, rgb(var(--bg-secondary)) 100%)`
                                                }}
                                            />
                                            {/* Progress Markers */}
                                            <div className="flex justify-between px-1">
                                                <span className="text-xs text-[rgb(var(--text-secondary))]">Beginner</span>
                                                <span className="text-xs text-[rgb(var(--text-secondary))]">Intermediate</span>
                                                <span className="text-xs text-[rgb(var(--text-secondary))]">Expert</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Icon Section */}
                                    <div className="space-y-4 p-4 sm:p-5 rounded-xl bg-[rgb(var(--bg-secondary))]/30 border border-[rgb(var(--border))]">
                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">Skill Icon</span>
                                            <div className="flex gap-2 p-1 bg-[rgb(var(--bg-secondary))]/50 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => setUseBuiltInIcon(true)}
                                                    className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${useBuiltInIcon
                                                            ? 'bg-[rgb(var(--accent))] text-white shadow-md'
                                                            : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
                                                        }`}
                                                >
                                                    Library
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUseBuiltInIcon(false)}
                                                    className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${!useBuiltInIcon
                                                            ? 'bg-[rgb(var(--accent))] text-white shadow-md'
                                                            : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
                                                        }`}
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4 items-center">
                                            {/* Icon Input */}
                                            <div>
                                                {useBuiltInIcon ? (
                                                    <select
                                                        id="icon-select"
                                                        name="iconName"
                                                        value={formData.iconName}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 glass rounded-xl text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all"
                                                        aria-label="Select skill icon"
                                                    >
                                                        <option value="">-- Select Icon --</option>
                                                        <optgroup label="Popular">
                                                            {['react', 'javascript', 'html', 'css', 'python', 'java', 'git', 'docker'].map(i => (
                                                                <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
                                                            ))}
                                                        </optgroup>
                                                        <optgroup label="All Icons">
                                                            {Object.keys(skillIconMap).filter(key =>
                                                                !['react', 'javascript', 'html', 'css', 'python', 'java', 'git', 'docker'].includes(key)
                                                            ).sort().map(key => (
                                                                <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                                                            ))}
                                                        </optgroup>
                                                    </select>
                                                ) : (
                                                    <input
                                                        id="icon-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setIconFile(e.target.files[0])}
                                                        className="w-full px-4 py-3 glass rounded-xl text-sm text-[rgb(var(--text-secondary))] 
                                                            file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 
                                                            file:bg-[rgb(var(--accent))]/10 file:text-[rgb(var(--accent))] 
                                                            file:cursor-pointer file:font-medium file:transition-all file:hover:bg-[rgb(var(--accent))]/20
                                                            cursor-pointer focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all"
                                                        aria-label="Upload skill icon"
                                                    />
                                                )}
                                            </div>

                                            {/* Icon Preview */}
                                            <div className="flex justify-center lg:justify-end">
                                                <div className="w-24 h-24 bg-gradient-to-br from-[rgb(var(--bg-secondary))] to-[rgb(var(--bg-card))] rounded-2xl border-2 border-[rgb(var(--border))] flex items-center justify-center shadow-lg p-3">
                                                    {getPreviewIcon()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Helper Text */}
                                        <p className="text-xs text-[rgb(var(--text-secondary))] flex items-center gap-2">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))]"></span>
                                            {useBuiltInIcon ? 'Select an icon from our library' : 'Upload PNG, JPG, or SVG (max 2MB)'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[rgb(var(--border))]">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCloseForm}
                                            className="w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="w-full sm:flex-1"
                                            loading={submitting}
                                        >
                                            {editingSkill ? '✓ Save Changes' : '+ Add Skill'}
                                        </Button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Skills Content */}
                {skills.length > 0 ? (
                    <div className="space-y-8">
                        {skills.map((group) => (
                            <div key={group._id} className="space-y-4">
                                {/* Section Header */}
                                <div className="flex items-center gap-3 px-2 sticky top-0 z-10 bg-[rgb(var(--bg-primary))]/80 backdrop-blur-md py-2 rounded-lg">
                                    <div className="p-2 rounded-lg bg-[rgb(var(--accent))]/10">
                                        {(() => {
                                            const CatIcon = categoryOptions.find(c => c.value === group._id)?.icon || Code;
                                            return <CatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />;
                                        })()}
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold capitalize text-[rgb(var(--text-primary))]">
                                        {getCategoryLabel(group._id)}
                                    </h2>
                                    <Badge variant="default" className="ml-auto">
                                        {group.skills.length}
                                    </Badge>
                                </div>

                                {/* 3D Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {group.skills.map((skill, index) => (
                                            <motion.div
                                                layout
                                                key={skill._id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                            >
                                                <GlassCard className="group relative overflow-hidden h-full hover:-translate-y-1 transition-all duration-300">
                                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                                        <div className="p-2.5 sm:p-3 bg-[rgb(var(--bg-secondary))]/50 rounded-xl backdrop-blur-md border border-[rgb(var(--border))]">
                                                            {getIconComponent(skill)}
                                                        </div>

                                                        <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleOpenForm(skill)}
                                                                className="p-1.5 bg-[rgb(var(--bg-secondary))]/50 sm:bg-transparent hover:bg-[rgb(var(--accent))]/10 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] rounded-lg transition-colors"
                                                                aria-label="Edit skill"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(skill._id)}
                                                                className="p-1.5 bg-[rgb(var(--bg-secondary))]/50 sm:bg-transparent hover:bg-red-500/10 text-[rgb(var(--text-secondary))] hover:text-red-500 rounded-lg transition-colors"
                                                                aria-label="Delete skill"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="relative z-10">
                                                        <h3 className="font-bold text-base sm:text-lg mb-1">{skill.name}</h3>
                                                        <div className="space-y-1.5">
                                                            <div className="flex justify-between text-xs text-[rgb(var(--text-secondary))]">
                                                                <span>Proficiency</span>
                                                                <span>{skill.proficiency}%</span>
                                                            </div>
                                                            <div className="h-1.5 sm:h-2 w-full bg-[rgb(var(--bg-secondary))] rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    whileInView={{ width: `${skill.proficiency}%` }}
                                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                                    className="h-full bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 rounded-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </GlassCard>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                        <Code className="w-12 h-12 sm:w-16 sm:h-16 text-[rgb(var(--text-secondary))] mx-auto mb-4 opacity-50" />
                        <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg mb-4">
                            No skills found.
                        </p>
                        <Button icon={Plus} onClick={() => handleOpenForm()}>
                            Add First Skill
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageSkills;