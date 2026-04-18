import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Trash2, CheckCircle, Reply, Eye, Filter, Search, MessageSquare, Inbox, Send } from 'lucide-react';
import { Button, Modal, GlassCard, Badge, Input } from '../../components/ui';
import { contactsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import { useHeaderEntrance, useStaggerGrid } from '../../utils/gsapHelpers';

gsap.registerPlugin(ScrollTrigger);

const ViewContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, replied: 0 });

    const wrapRef = useRef(null);
    const statsRef = useRef(null);
    const { headerRef } = useHeaderEntrance();
    const { containerRef } = useStaggerGrid(filteredContacts, { stagger: 0.06, y: 16 });

    useEffect(() => { fetchContacts(); fetchStats(); }, []);
    useEffect(() => { applyFilters(); }, [contacts, filter, searchQuery]);

    /* Stats cards entrance */
    useEffect(() => {
        if (!stats.total && !statsRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(statsRef.current?.querySelectorAll(':scope > *') || [],
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, ease: 'expo.out', stagger: 0.08, delay: 0.2 }
            );
        }, statsRef.current);
        return () => ctx.revert();
    }, [stats]);

    const fetchContacts = async () => {
        try { const r = await contactsAPI.getAll(); setContacts(r.data.data); }
        catch { toast.error('Failed to fetch messages'); }
        finally { setLoading(false); }
    };

    const fetchStats = async () => {
        try { const r = await contactsAPI.getStats(); setStats(r.data.data); }
        catch { console.error('Failed to fetch stats'); }
    };

    const applyFilters = () => {
        let f = [...contacts];
        if (filter === 'unread') f = f.filter(c => !c.isRead);
        if (filter === 'read') f = f.filter(c => c.isRead && !c.replied);
        if (filter === 'replied') f = f.filter(c => c.replied);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            f = f.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) ||
                c.message.toLowerCase().includes(q) || (c.subject && c.subject.toLowerCase().includes(q)));
        }
        setFilteredContacts(f);
    };

    const handleViewContact = async (contact) => {
        setSelectedContact(contact); setModalOpen(true);
        if (!contact.isRead) {
            try {
                await contactsAPI.markAsRead(contact._id);
                setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
                fetchStats();
            } catch { /* silent */ }
        }
    };

    const handleMarkAsReplied = async (id) => {
        try { await contactsAPI.markAsReplied(id); toast.success('Marked as replied'); fetchContacts(); fetchStats(); setModalOpen(false); }
        catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try { await contactsAPI.delete(id); toast.success('Deleted'); fetchContacts(); fetchStats(); setModalOpen(false); }
        catch { toast.error('Failed to delete'); }
    };

    const getStatusBadge = (c) => {
        if (c.replied) return <Badge variant="success">Replied</Badge>;
        if (c.isRead) return <Badge variant="info">Read</Badge>;
        return <Badge variant="warning">New</Badge>;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    const statItems = [
        { label: 'Total', value: stats.total, icon: Inbox, cls: 'text-[rgb(var(--accent))]', bg: 'bg-[rgb(var(--accent))]/10' },
        { label: 'Unread', value: stats.unread, icon: Mail, cls: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Read', value: stats.read, icon: CheckCircle, cls: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Replied', value: stats.replied, icon: Reply, cls: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    return (
        <div ref={wrapRef} className="space-y-8 pb-8" style={{ fontFamily: "'Syne',sans-serif" }}>

            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="page-heading" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'rgb(var(--text-primary))', marginBottom: '0.25rem' }}>Messages</h1>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.78rem', color: 'rgb(var(--text-secondary))' }}>Inbox and inquiries</p>
                    <div className="page-divider" style={{ height: '1px', marginTop: '0.75rem', background: 'linear-gradient(to right,rgba(var(--accent),0.4),transparent)' }} />
                </div>
            </div>

            {/* Stat cards */}
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statItems.map(({ label, value, icon: Icon, cls, bg }) => (
                    <GlassCard key={label} className="flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className={`p-3 ${bg} rounded-xl ${cls}`}><Icon className="w-6 h-6" /></div>
                        <div>
                            <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>
                                {label}
                            </p>
                            <p style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Filters */}
            <GlassCard className="p-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-2 text-[rgb(var(--text-secondary))] border-r border-[rgb(var(--border))] mr-2 pr-4 hidden sm:flex">
                            <Filter className="w-4 h-4" />
                            <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.72rem' }}>Filter</span>
                        </div>
                        {['all', 'unread', 'read', 'replied'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.08em' }}
                                className={`px-4 py-1.5 rounded-lg transition-all flex-1 sm:flex-none text-center ${filter === f ? 'bg-[rgb(var(--accent))] text-white shadow-md' : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-secondary))]'}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 min-w-[250px]">
                        <Input placeholder="Search sender, email…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={Search}
                            className="h-10 bg-[rgb(var(--bg-primary))]/50 border-transparent focus:bg-[rgb(var(--bg-primary))]" />
                    </div>
                </div>
            </GlassCard>

            {/* Message list */}
            {filteredContacts.length > 0 ? (
                <div ref={containerRef} className="space-y-4">
                    {filteredContacts.map((contact) => (
                        <GlassCard key={contact._id}
                            className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--accent))]/30 ${!contact.isRead ? 'border-l-4 border-l-[rgb(var(--accent))]' : ''}`}
                            onClick={() => handleViewContact(contact)}>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className={`p-3.5 rounded-full flex-shrink-0 ${contact.isRead ? 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))]' : 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]'}`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0 grid sm:grid-cols-12 gap-2 sm:gap-6 items-center w-full">
                                    <div className="sm:col-span-3">
                                        <h3 style={{ fontWeight: contact.isRead ? 400 : 700, color: 'rgb(var(--text-primary))' }} className="truncate">{contact.name}</h3>
                                        <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.68rem', color: 'rgb(var(--text-secondary))' }} className="truncate">{contact.email}</p>
                                    </div>
                                    <div className="sm:col-span-6">
                                        {contact.subject && <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'rgb(var(--text-primary))' }} className="truncate mb-0.5">{contact.subject}</p>}
                                        <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.75rem', color: 'rgb(var(--text-secondary))' }} className="truncate">{contact.message}</p>
                                    </div>
                                    <div className="sm:col-span-3 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                        <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.05em', color: 'rgb(var(--text-secondary))' }}>
                                            {new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                        {getStatusBadge(contact)}
                                    </div>
                                </div>
                                <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 border-l border-[rgb(var(--border))] pl-4">
                                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewContact(contact); }}><Eye className="w-4 h-4" /></Button>
                                    <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[rgb(var(--bg-secondary))]/30 rounded-3xl border-2 border-dashed border-[rgb(var(--border))]">
                    <MessageSquare className="w-16 h-16 text-[rgb(var(--text-secondary))] mx-auto mb-4 opacity-50" />
                    <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.88rem', color: 'rgb(var(--text-secondary))' }} className="mb-1">No messages found.</p>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.72rem', color: 'rgb(var(--text-secondary))', opacity: 0.7 }}>
                        {searchQuery ? 'Try adjusting your search terms.' : 'Your inbox is empty for now.'}
                    </p>
                </div>
            )}

            {/* Detail modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Message Details" size="lg">
                {selectedContact && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-[rgb(var(--border))]">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[rgb(var(--bg-secondary))] flex items-center justify-center" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'rgb(var(--accent))' }}>
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'rgb(var(--text-primary))' }} className="text-xl">{selectedContact.name}</h2>
                                    <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.78rem', color: 'rgb(var(--text-secondary))' }}>{selectedContact.email}</p>
                                    <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.65rem', color: 'rgb(var(--text-secondary))', marginTop: '0.25rem' }}>
                                        {new Date(selectedContact.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">{getStatusBadge(selectedContact)}</div>
                        </div>

                        <div className="bg-[rgb(var(--bg-secondary))]/30 p-5 rounded-xl border border-[rgb(var(--border))]">
                            {selectedContact.subject && (
                                <h3 style={{ fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(var(--border),1)' }} className="text-lg">{selectedContact.subject}</h3>
                            )}
                            <p style={{ fontFamily: "'DM Mono',monospace", fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.85, color: 'rgb(var(--text-primary))' }} className="whitespace-pre-wrap">{selectedContact.message}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Inquiry'}`} className="flex-1">
                                <Button className="w-full flex items-center justify-center gap-2"><Reply className="w-4 h-4" /> Reply via Email</Button>
                            </a>
                            {!selectedContact.replied && (
                                <Button variant="outline" onClick={() => handleMarkAsReplied(selectedContact._id)} className="flex-1 flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Mark Replied
                                </Button>
                            )}
                            <Button variant="danger" onClick={() => handleDelete(selectedContact._id)} className="sm:w-auto flex items-center justify-center gap-2">
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