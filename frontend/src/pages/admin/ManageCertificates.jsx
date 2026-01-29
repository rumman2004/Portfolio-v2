import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Award, ExternalLink, Calendar } from 'lucide-react';
import { Button, Modal, Input, Textarea, GlassCard } from '../../components/ui';
import { certificatesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await certificatesAPI.getAll();
            setCertificates(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cert = null) => {
        if (cert) {
            setEditingCert(cert);
            setFormData({
                title: cert.title,
                issuer: cert.issuer,
                issueDate: new Date(cert.issueDate).toISOString().split('T')[0],
                expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
                credentialId: cert.credentialId || '',
                credentialUrl: cert.credentialUrl || '',
                description: cert.description || '',
            });
        } else {
            setEditingCert(null);
            setFormData({
                title: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                credentialUrl: '',
                description: '',
            });
        }
        setImageFile(null);
        setModalOpen(true);
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
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingCert) {
                await certificatesAPI.update(editingCert._id, data);
                toast.success('Certificate updated successfully');
            } else {
                await certificatesAPI.create(data);
                toast.success('Certificate created successfully');
            }

            setModalOpen(false);
            fetchCertificates();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;

        try {
            await certificatesAPI.delete(id);
            toast.success('Certificate deleted successfully');
            fetchCertificates();
        } catch (error) {
            toast.error('Failed to delete certificate');
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Certifications</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Validating your expertise and skills
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-lg shadow-[rgb(var(--accent))]/20">
                    Add Certificate
                </Button>
            </div>

            {/* Certificates Grid */}
            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="h-full flex flex-col group hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-48 -mx-6 -mt-6 mb-4 bg-black/5 overflow-hidden flex items-center justify-center p-4">
                                        <img
                                            src={cert.image.url}
                                            alt={cert.title}
                                            className="h-full w-full object-contain rounded-md"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <Award className="w-6 h-6 text-[rgb(var(--accent))] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-lg font-bold leading-tight mb-1">
                                                    {cert.title}
                                                </h3>
                                                <p className="text-sm font-medium text-[rgb(var(--accent))]">
                                                    {cert.issuer}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))] bg-[rgb(var(--bg-secondary))] p-2 rounded-lg w-fit">
                                            <Calendar className="w-3 h-3" />
                                            <span>Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                        </div>

                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--accent))] hover:underline"
                                            >
                                                Verify Credential <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4 mt-4 border-t border-[rgb(var(--border))]">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Edit}
                                            onClick={() => handleOpenModal(cert)}
                                            className="flex-1"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(cert._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                    <p className="text-[rgb(var(--text-secondary))] text-lg mb-4">
                        No certificates yet. Add your first certificate!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Certificate
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingCert ? 'Edit Certificate' : 'New Certificate'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Certificate Name"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        required
                    />

                    <Input
                        label="Issuing Organization"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="e.g. Amazon Web Services"
                        required
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Issue Date"
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Expiry Date (Optional)"
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Credential ID (Optional)"
                            name="credentialId"
                            value={formData.credentialId}
                            onChange={handleChange}
                            placeholder="e.g. ABC-123-XYZ"
                        />

                        <Input
                            label="Credential URL (Optional)"
                            name="credentialUrl"
                            value={formData.credentialUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            icon={ExternalLink}
                        />
                    </div>

                    <Textarea
                        label="Description (Optional)"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Brief details about this certification..."
                    />

                    <div className="p-4 rounded-xl bg-[rgb(var(--bg-secondary))]/50 border border-[rgb(var(--border))]">
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Certificate Image / Logo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full text-sm text-[rgb(var(--text-secondary))] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[rgb(var(--accent))]/10 file:text-[rgb(var(--accent))] hover:file:bg-[rgb(var(--accent))]/20"
                            required={!editingCert}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                        <Button type="submit" className="flex-1" loading={submitting}>
                            {editingCert ? 'Save Changes' : 'Add Certificate'}
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

export default ManageCertificates;