import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Button, Modal, Input, Textarea, GlassCard } from '../../components/ui';
import { experienceAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ManageExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        responsibilities: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await experienceAPI.getAll();
            setExperiences(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (exp = null) => {
        if (exp) {
            setEditingExp(exp);
            setFormData({
                title: exp.title,
                company: exp.company,
                location: exp.location || '',
                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                current: exp.current,
                description: exp.description,
                responsibilities: exp.responsibilities?.join('\n') || '',
            });
        } else {
            setEditingExp(null);
            setFormData({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                responsibilities: '',
            });
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = {
                ...formData,
                responsibilities: formData.responsibilities
                    .split('\n')
                    .filter(r => r.trim())
                    .map(r => r.trim())
            };

            if (editingExp) {
                await experienceAPI.update(editingExp._id, data);
                toast.success('Experience updated successfully');
            } else {
                await experienceAPI.create(data);
                toast.success('Experience created successfully');
            }

            setModalOpen(false);
            fetchExperiences();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        try {
            await experienceAPI.delete(id);
            toast.success('Experience deleted successfully');
            fetchExperiences();
        } catch (error) {
            toast.error('Failed to delete experience');
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Experience</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Track your professional journey
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-lg shadow-[rgb(var(--accent))]/20">
                    Add Experience
                </Button>
            </div>

            {/* Experiences List */}
            {experiences.length > 0 ? (
                <div className="space-y-5">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="group border-l-4 border-l-[rgb(var(--accent))]">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-[rgb(var(--text-primary))]">
                                                {exp.title}
                                            </h3>
                                            <span className="hidden sm:inline text-[rgb(var(--text-secondary))]">•</span>
                                            <span className="text-[rgb(var(--accent))] font-semibold">
                                                {exp.company}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-[rgb(var(--text-secondary))] mb-4">
                                            <div className="flex items-center gap-1.5 bg-[rgb(var(--bg-secondary))] px-3 py-1 rounded-full">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                                    {exp.current ? <span className="text-[rgb(var(--accent))] font-bold ml-1">Present</span> : ` ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
                                                </span>
                                            </div>
                                            {exp.location && (
                                                <div className="flex items-center gap-1.5 bg-[rgb(var(--bg-secondary))] px-3 py-1 rounded-full">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{exp.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[rgb(var(--text-primary))] mb-4 leading-relaxed">
                                            {exp.description}
                                        </p>

                                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                                            <div className="bg-[rgb(var(--bg-secondary))]/30 p-4 rounded-xl">
                                                <ul className="space-y-2">
                                                    {exp.responsibilities.map((resp, i) => (
                                                        <li key={i} className="flex gap-3 text-sm text-[rgb(var(--text-secondary))]">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))] mt-1.5 flex-shrink-0" />
                                                            <span>{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col gap-3 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-[rgb(var(--border))]">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Edit}
                                            onClick={() => handleOpenModal(exp)}
                                            className="flex-1 lg:flex-none justify-center"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => handleDelete(exp._id)}
                                            className="flex-1 lg:flex-none justify-center"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                    <Briefcase className="w-16 h-16 text-[rgb(var(--text-secondary))] mx-auto mb-4 opacity-50" />
                    <p className="text-[rgb(var(--text-secondary))] text-lg mb-4">
                        No experience yet. Add your first role!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Experience
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingExp ? 'Edit Experience' : 'New Experience'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Job Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior Frontend Engineer"
                            required
                        />
                        <Input
                            label="Company Name"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Google"
                            required
                        />
                    </div>

                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. San Francisco, CA (Remote)"
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            disabled={formData.current}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[rgb(var(--bg-secondary))]/50 rounded-lg">
                        <input
                            type="checkbox"
                            name="current"
                            id="current"
                            checked={formData.current}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-300 text-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]"
                        />
                        <label htmlFor="current" className="text-sm font-medium cursor-pointer select-none">
                            I currently work here
                        </label>
                    </div>

                    <Textarea
                        label="Role Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Brief summary of what you did..."
                        required
                    />

                    <Textarea
                        label="Key Responsibilities (One per line)"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        rows={5}
                        placeholder="• Led a team of 5 developers&#10;• Reduced load times by 40%&#10;• Implemented CI/CD pipelines"
                    />

                    <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={submitting}
                        >
                            {editingExp ? 'Save Changes' : 'Add Experience'}
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

export default ManageExperience;