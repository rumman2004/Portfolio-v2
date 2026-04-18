import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, CheckCircle, Reply, Eye, Filter, Search, MessageSquare, Inbox, Send } from 'lucide-react';
import { Button, Modal, GlassCard, Badge, Input } from '../../components/ui';
import { contactsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ViewContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, unread, read, replied
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        read: 0,
        replied: 0
    });

    useEffect(() => {
        fetchContacts();
        fetchStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [contacts, filter, searchQuery]);

    const fetchContacts = async () => {
        try {
            const response = await contactsAPI.getAll();
            setContacts(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await contactsAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const applyFilters = () => {
        let filtered = [...contacts];

        // Apply status filter
        if (filter === 'unread') {
            filtered = filtered.filter(c => !c.isRead);
        } else if (filter === 'read') {
            filtered = filtered.filter(c => c.isRead && !c.replied);
        } else if (filter === 'replied') {
            filtered = filtered.filter(c => c.replied);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.message.toLowerCase().includes(query) ||
                (c.subject && c.subject.toLowerCase().includes(query))
            );
        }

        setFilteredContacts(filtered);
    };

    const handleViewContact = async (contact) => {
        setSelectedContact(contact);
        setModalOpen(true);

        // Mark as read if not already
        if (!contact.isRead) {
            try {
                await contactsAPI.markAsRead(contact._id);
                setContacts(prev => prev.map(c => 
                    c._id === contact._id ? { ...c, isRead: true } : c
                ));
                fetchStats(); 
            } catch (error) {
                console.error('Failed to mark as read');
            }
        }
    };

    const handleMarkAsReplied = async (id) => {
        try {
            await contactsAPI.markAsReplied(id);
            toast.success('Marked as replied');
            fetchContacts();
            fetchStats();
            setModalOpen(false);
        } catch (error) {
            toast.error('Failed to mark as replied');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await contactsAPI.delete(id);
            toast.success('Message deleted successfully');
            fetchContacts();
            fetchStats();
            setModalOpen(false);
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const getStatusBadge = (contact) => {
        if (contact.replied) return <Badge variant="success">Replied</Badge>;
        if (contact.isRead) return <Badge variant="info">Read</Badge>;
        return <Badge variant="warning">New</Badge>;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Messages</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Inbox and inquiries
                    </p>
                </div>
            </div>

            {/* 3D Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <GlassCard className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-3 bg-[rgb(var(--accent))]/10 rounded-xl text-[rgb(var(--accent))]">
                        <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Unread</p>
                        <p className="text-2xl font-bold">{stats.unread}</p>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Read</p>
                        <p className="text-2xl font-bold">{stats.read}</p>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                        <Reply className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Replied</p>
                        <p className="text-2xl font-bold">{stats.replied}</p>
                    </div>
                </GlassCard>
            </div>

            {/* Unified Filters & Search Bar */}
            <GlassCard className="p-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">
                    {/* Filters Left */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-2 text-[rgb(var(--text-secondary))] border-r border-[rgb(var(--border))] mr-2 pr-4 hidden sm:flex">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">Filter</span>
                        </div>
                        {['all', 'unread', 'read', 'replied'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none text-center ${
                                    filter === f
                                        ? 'bg-[rgb(var(--accent))] text-white shadow-md'
                                        : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))]'
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Search Right */}
                    <div className="w-full md:w-1/3 min-w-[250px]">
                        <Input
                            placeholder="Search sender, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={Search}
                            className="h-10 bg-[rgb(var(--bg-primary))]/50 border-transparent focus:bg-[rgb(var(--bg-primary))]"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Messages List */}
            {filteredContacts.length > 0 ? (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredContacts.map((contact, index) => (
                            <motion.div
                                key={contact._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard 
                                    className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--accent))]/30 ${
                                        !contact.isRead ? 'border-l-4 border-l-[rgb(var(--accent))]' : ''
                                    }`}
                                    onClick={() => handleViewContact(contact)}
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        {/* Avatar / Icon */}
                                        <div className={`p-3.5 rounded-full flex-shrink-0 ${
                                            contact.isRead 
                                                ? 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))]' 
                                                : 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]'
                                        }`}>
                                            <Mail className="w-5 h-5" />
                                        </div>

                                        {/* Content Info */}
                                        <div className="flex-1 min-w-0 grid sm:grid-cols-12 gap-2 sm:gap-6 items-center w-full">
                                            
                                            {/* Name & Email */}
                                            <div className="sm:col-span-3">
                                                <h3 className={`font-semibold truncate ${!contact.isRead ? 'text-[rgb(var(--text-primary))]' : 'text-[rgb(var(--text-secondary))]'}`}>
                                                    {contact.name}
                                                </h3>
                                                <p className="text-xs text-[rgb(var(--text-secondary))] truncate">
                                                    {contact.email}
                                                </p>
                                            </div>

                                            {/* Subject/Message Preview */}
                                            <div className="sm:col-span-6">
                                                {contact.subject && (
                                                    <p className="text-sm font-medium truncate text-[rgb(var(--text-primary))] mb-0.5">
                                                        {contact.subject}
                                                    </p>
                                                )}
                                                <p className="text-sm text-[rgb(var(--text-secondary))] truncate">
                                                    {contact.message}
                                                </p>
                                            </div>

                                            {/* Metadata */}
                                            <div className="sm:col-span-3 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                                <p className="text-xs text-[rgb(var(--text-secondary))] whitespace-nowrap">
                                                    {new Date(contact.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                                </p>
                                                {getStatusBadge(contact)}
                                            </div>
                                        </div>

                                        {/* Quick Actions (Hover) */}
                                        <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 border-l border-[rgb(var(--border))] pl-4">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleViewContact(contact); }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                    <MessageSquare className="w-16 h-16 text-[rgb(var(--text-secondary))] mx-auto mb-4 opacity-50" />
                    <p className="text-[rgb(var(--text-secondary))] text-lg mb-1">
                        No messages found.
                    </p>
                    <p className="text-sm text-[rgb(var(--text-secondary))] opacity-70">
                        {searchQuery ? "Try adjusting your search terms." : "Your inbox is empty for now."}
                    </p>
                </div>
            )}

            {/* Message Detail Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Message Details"
                size="lg"
            >
                {selectedContact && (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-[rgb(var(--border))]">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[rgb(var(--bg-secondary))] flex items-center justify-center text-xl font-bold text-[rgb(var(--accent))]">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">
                                        {selectedContact.name}
                                    </h2>
                                    <p className="text-[rgb(var(--text-secondary))] flex items-center gap-2">
                                        {selectedContact.email}
                                    </p>
                                    <p className="text-xs text-[rgb(var(--text-secondary))] mt-1">
                                        {new Date(selectedContact.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                {getStatusBadge(selectedContact)}
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="bg-[rgb(var(--bg-secondary))]/30 p-5 rounded-xl border border-[rgb(var(--border))]">
                            {selectedContact.subject && (
                                <h3 className="font-bold text-lg mb-3 pb-2 border-b border-[rgb(var(--border))]">
                                    {selectedContact.subject}
                                </h3>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed text-[rgb(var(--text-primary))]">
                                {selectedContact.message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <a
                                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Inquiry'}`}
                                className="flex-1"
                            >
                                <Button className="w-full flex items-center justify-center gap-2">
                                    <Reply className="w-4 h-4" /> Reply via Email
                                </Button>
                            </a>

                            {!selectedContact.replied && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleMarkAsReplied(selectedContact._id)}
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" /> Mark Replied
                                </Button>
                            )}

                            <Button
                                variant="danger"
                                onClick={() => handleDelete(selectedContact._id)}
                                className="sm:w-auto flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewContacts;