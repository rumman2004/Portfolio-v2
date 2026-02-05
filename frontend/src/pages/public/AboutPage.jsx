import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { aboutAPI, experienceAPI, certificatesAPI, skillsAPI, socialsAPI } from '../../services/api';
import { GlassCard } from '../../components/ui';
import {
    Calendar, MapPin, Award, Mail, Phone, Download,
    Briefcase, Code, User, ExternalLink, GraduationCap,
    Layers, Database, Server, Wrench, Cloud, Terminal,
    ChevronLeft, ChevronRight
} from 'lucide-react';
// IMPORT THE DEDICATED ICONS
import { socialIconMap } from '../../components/icons/SocialIcons';
import Loader from '../../components/ui/Loader';
import { getSkillIcon } from '../../components/icons';

// --- Updated Helper to use socialIconMap ---
const getSocialIcon = (platform) => {
    // Try to find the icon in the map (case-insensitive)
    const IconComponent = socialIconMap[platform.toLowerCase()];
    // Fallback to GitHub or Globe if not found (matches Footer logic)
    return IconComponent || socialIconMap.github;
};

// --- Neumorphic Styles Helper ---
const neuStyles = {
    pill: `
        relative flex items-center justify-center gap-3 px-8 py-4 rounded-full
        bg-[rgb(var(--bg-primary))] 
        shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.2)] 
        dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.02),5px_5px_15px_rgba(0,0,0,0.5)]
        border border-[rgb(var(--text-secondary))]/5
    `,
    square: `
        relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
        bg-[rgb(var(--bg-primary))] 
        shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.2)] 
        dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.02),5px_5px_15px_rgba(0,0,0,0.5)]
        border border-[rgb(var(--text-secondary))]/5
        transition-transform active:scale-95 hover:-translate-y-1
    `
};

// --- Neumorphic Category Component ---
const NeuCategoryGroup = ({ group }) => {
    const getCategoryIcon = (id) => {
        const lowerId = id.toLowerCase();
        if (lowerId.includes('front')) return Layers;
        if (lowerId.includes('back')) return Server;
        if (lowerId.includes('data')) return Database;
        if (lowerId.includes('devops') || lowerId.includes('cloud')) return Cloud;
        if (lowerId.includes('tool')) return Wrench;
        return Terminal;
    };

    const CategoryIcon = getCategoryIcon(group._id);

    return (
        <div className="flex flex-col items-center gap-8 mx-12">
            <div className={neuStyles.pill}>
                <CategoryIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[rgb(var(--text-primary))]">
                    {group._id}
                </span>
            </div>
            <div className="flex flex-row flex-nowrap gap-4 sm:gap-6 justify-center">
                {group.skills.map((skill) => {
                    const SkillIcon = getSkillIcon(skill.iconName || skill.name.toLowerCase());
                    return (
                        <div key={skill._id} className="group relative">
                            <div className={neuStyles.square} title={skill.name}>
                                <div className="text-[rgb(var(--accent))] drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                                    {SkillIcon ? <SkillIcon className="w-8 h-8 sm:w-10 sm:h-10" /> : <Code className="w-8 h-8" />}
                                </div>
                            </div>
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[rgb(var(--text-secondary))] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[rgb(var(--bg-secondary))] px-2 py-1 rounded shadow-sm z-10">
                                {skill.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Neumorphic Stat Component ---
const NeuStat = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center justify-center p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-[rgb(var(--bg-primary))] shadow-[5px_5px_15px_rgba(0,0,0,0.2),-5px_-5px_15px_rgba(255,255,255,0.05)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(255,255,255,0.02)] transition-transform hover:scale-105">
        <div className="p-2 sm:p-2.5 lg:p-3 rounded-full bg-[rgb(var(--bg-secondary))] mb-2 sm:mb-3 text-[rgb(var(--accent))] shadow-inner">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[rgb(var(--text-primary))]">{value}+</h3>
        <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] font-medium uppercase tracking-wider text-center">{label}</p>
    </div>
);

const AboutPage = () => {
    const [about, setAbout] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [skillGroups, setSkillGroups] = useState([]);
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carousel State
    const [certIndex, setCertIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-advance Carousel (5 seconds hold)
    useEffect(() => {
        if (!certificates.length || isHovered) return;
        const timer = setInterval(() => {
            handleNextCert();
        }, 5000);
        return () => clearInterval(timer);
    }, [certIndex, certificates.length, isHovered]);

    const fetchData = async () => {
        try {
            const [aboutRes, expRes, certRes, skillsRes, socialsRes] = await Promise.all([
                aboutAPI.get(),
                experienceAPI.getAll(),
                certificatesAPI.getAll(),
                skillsAPI.getGrouped(),
                socialsAPI.getAll({ visible: true })
            ]);
            setAbout(aboutRes.data.data);
            setExperiences(expRes.data.data);
            setCertificates(certRes.data.data);
            setSkillGroups(skillsRes.data.data);
            setSocials(socialsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextCert = () => {
        setCertIndex((prev) => (prev + 1) % certificates.length);
    };

    const handlePrevCert = () => {
        setCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
    };

    // Touch handlers for swipe gestures
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNextCert();
        } else if (isRightSwipe) {
            handlePrevCert();
        }
    };

    // --- Smoother 3D Logic ---
    const getCardStyle = (index) => {
        const len = certificates.length;
        if (len === 0) return 'hidden';

        let offset = (index - certIndex + len) % len;
        if (offset > len / 2) offset -= len;

        if (offset === 0) return 'center';
        if (offset === -1 || (len === 2 && offset === 1)) return 'left';
        if (offset === 1) return 'right';

        return offset < 0 ? 'hiddenLeft' : 'hiddenRight';
    };

    const cardVariants = {
        center: {
            x: '0%',
            scale: 1,
            opacity: 1,
            zIndex: 30,
            rotateY: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7,
                ease: [0.645, 0.045, 0.355, 1.000]
            }
        },
        left: {
            x: '-85%',
            scale: 0.75,
            opacity: 0.6,
            zIndex: 20,
            rotateY: 25,
            filter: 'blur(1px)',
            transition: {
                duration: 0.7,
                ease: [0.645, 0.045, 0.355, 1.000]
            }
        },
        right: {
            x: '85%',
            scale: 0.75,
            opacity: 0.6,
            zIndex: 20,
            rotateY: -25,
            filter: 'blur(1px)',
            transition: {
                duration: 0.7,
                ease: [0.645, 0.045, 0.355, 1.000]
            }
        },
        hiddenLeft: {
            x: '-120%',
            scale: 0.4,
            opacity: 0,
            zIndex: 10,
            rotateY: 35,
            filter: 'blur(4px)',
            transition: {
                duration: 0.7,
                ease: [0.645, 0.045, 0.355, 1.000]
            }
        },
        hiddenRight: {
            x: '120%',
            scale: 0.4,
            opacity: 0,
            zIndex: 10,
            rotateY: -35,
            filter: 'blur(4px)',
            transition: {
                duration: 0.7,
                ease: [0.645, 0.045, 0.355, 1.000]
            }
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    const marqueeGroups = [...skillGroups, ...skillGroups];

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-[rgb(var(--accent))]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-40 right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    {about && (
                        <div className="flex flex-col lg:flex-row gap-12 items-start">

                            {/* Left: Profile Image & Info */}
                            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-1/3 flex flex-col items-center text-center lg:items-start lg:text-left">
                                {/* Square Image Section */}
                                <div className="relative mb-8 group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[rgb(var(--accent))] to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                                    <div className="relative w-90 h-85 rounded-3xl overflow-hidden border-4 border-[rgb(var(--bg-primary))] shadow-2xl">
                                        <img
                                            src="https://res.cloudinary.com/dtbytfxzs/image/upload/v1769608529/WhatsApp_Image_2026-01-28_at_7.24.46_PM_hdtwol.jpg"
                                            alt={about.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name (One line) */}
                                <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--text-primary))] to-[rgb(var(--text-secondary))] whitespace-nowrap">
                                    {about.name}
                                </h1>

                                {/* Title (Typing Effect & One line) */}
                                <div className="text-xl text-[rgb(var(--accent))] font-medium mb-6 h-8 flex items-center justify-center lg:justify-start">
                                    <TypeAnimation
                                        sequence={[about.title, 2000, '', 500]}
                                        wrapper="span"
                                        speed={50}
                                        repeat={Infinity}
                                        className="whitespace-nowrap"
                                    />
                                </div>

                                {/* Socials & Resume (Below title) */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                    {socials.map(social => {
                                        // 1. Get the icon
                                        const Icon = getSocialIcon(social.platform);

                                        return (
                                            <a
                                                key={social._id}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                // 2. CHANGED: 'text-black' -> 'text-[rgb(var(--text-primary))]'
                                                // This ensures icons are White in Dark Mode and Black in Light Mode.
                                                className="p-3 glass rounded-xl text-[rgb(var(--text-primary))] hover:text-[rgb(var(--accent))] hover:-translate-y-1 transition-all"
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}

                                    {/* Resume Button */}
                                    {about.resume?.url && (
                                        <a
                                            href={about.resume.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-3 rounded-xl bg-[rgb(var(--accent))] text-white font-medium shadow-lg shadow-[rgb(var(--accent))]/25 hover:shadow-[rgb(var(--accent))]/40 hover:-translate-y-1 transition-all flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" /> Resume
                                        </a>
                                    )}
                                </div>
                            </motion.div>

                            {/* Right: Bio, Contact Info & Stats */}
                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-2/3">
                                {/* About Me Bio */}
                                <GlassCard className="p-8 mb-8 border-l-4 border-l-[rgb(var(--accent))]">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><User className="w-6 h-6 text-[rgb(var(--accent))]" /> About Me</h3>
                                    <p className="text-[rgb(var(--text-secondary))] leading-relaxed text-lg whitespace-pre-line">{about.bio}</p>
                                </GlassCard>

                                {/* Contact Info Section - Separate Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                                    {about.email && (
                                        <GlassCard className="p-5 flex flex-col items-center lg:items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
                                            <div className="flex items-center gap-2 text-[rgb(var(--accent))] font-bold">
                                                <Mail className="w-5 h-5" /> Email
                                            </div>
                                            <a href={`mailto:${about.email}`} className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors break-all text-center lg:text-left">
                                                {about.email}
                                            </a>
                                        </GlassCard>
                                    )}
                                    {about.phone && (
                                        <GlassCard className="p-5 flex flex-col items-center lg:items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
                                            <div className="flex items-center gap-2 text-[rgb(var(--accent))] font-bold">
                                                <Phone className="w-5 h-5" /> Phone
                                            </div>
                                            <a href={`tel:${about.phone}`} className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors text-center lg:text-left">
                                                {about.phone}
                                            </a>
                                        </GlassCard>
                                    )}
                                    {about.location && (
                                        <GlassCard className="p-5 flex flex-col items-center lg:items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
                                            <div className="flex items-center gap-2 text-[rgb(var(--accent))] font-bold">
                                                <MapPin className="w-5 h-5" /> Location
                                            </div>
                                            <p className="text-sm text-[rgb(var(--text-secondary))] text-center lg:text-left">
                                                {about.location}
                                            </p>
                                        </GlassCard>
                                    )}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    <NeuStat icon={Briefcase} value={about.stats?.yearsExperience} label="Years Exp." />
                                    <NeuStat icon={Code} value={about.stats?.projectsCompleted} label="Projects" />
                                    <NeuStat icon={Award} value={about.stats?.certificatesEarned} label="Awards" />
                                    <NeuStat icon={User} value={about.stats?.happyClients} label="Clients" />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>

            {/* Skills Section */}
            {skillGroups.length > 0 && (
                <section className="py-32 overflow-hidden">
                    <div className="container mx-auto px-4 mb-16 text-center">
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl font-bold mb-4">
                            Technical <span className="text-[rgb(var(--accent))]">Arsenal</span>
                        </motion.h2>
                    </div>
                    <div className="relative w-full overflow-hidden mask-linear-fade">
                        <motion.div className="flex items-start py-8" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 20 }} style={{ width: "max-content" }}>
                            {marqueeGroups.map((group, index) => (
                                <NeuCategoryGroup key={`${group._id}-${index}`} group={group} />
                            ))}
                        </motion.div>
                    </div>
                    <style>{`
                        .mask-linear-fade { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
                    `}</style>
                </section>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
                <section className="container mx-auto px-4 py-16 max-w-5xl relative">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-16 text-center">
                        My <span className="text-[rgb(var(--accent))]">Journey</span>
                    </motion.h2>
                    <div className="relative">
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[rgb(var(--accent))] via-purple-500 to-transparent md:-translate-x-1/2" />
                        <div className="space-y-12">
                            {experiences.map((exp, index) => (
                                <motion.div key={exp._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-0 w-3 h-3 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_15px_rgb(var(--accent))]" />
                                    <div className="md:w-1/2" />
                                    <div className="md:w-1/2 pl-6 md:pl-0">
                                        <GlassCard className="relative p-6 border-t-4 border-t-[rgb(var(--accent))] hover:-translate-y-1 transition-transform duration-300">
                                            <div className="absolute top-4 right-4 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border))] px-3 py-1 rounded-full text-xs font-bold text-[rgb(var(--accent))] shadow-sm">
                                                {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                                            </div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2.5 rounded-xl bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]">
                                                    {exp.title.toLowerCase().includes('student') || exp.title.toLowerCase().includes('degree') ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight">{exp.title}</h3>
                                                    <p className="text-sm text-[rgb(var(--text-secondary))]">{exp.company}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[rgb(var(--text-secondary))] mb-4 leading-relaxed">{exp.description}</p>
                                            {exp.location && <div className="flex items-center gap-2 text-xs font-medium text-[rgb(var(--text-secondary))]"><MapPin className="w-3.5 h-3.5" /> {exp.location}</div>}
                                        </GlassCard>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section - 3D Loop Carousel (FIXED) */}
            {certificates.length > 0 && (
                <section className="py-24 relative overflow-hidden">
                    <div className="container mx-auto px-4 mb-16 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold mb-4"
                        >
                            Honors & <span className="text-[rgb(var(--accent))]">Certificates</span>
                        </motion.h2>
                    </div>

                    <div
                        className="relative w-full max-w-[1200px] mx-auto h-[400px] sm:h-[500px] lg:h-[550px] flex items-center justify-center"
                        style={{ perspective: '2000px', perspectiveOrigin: 'center' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Navigation Arrows - Enhanced for All Devices */}
                        <button
                            onClick={handlePrevCert}
                            aria-label="Previous certificate"
                            className="absolute left-2 sm:left-6 lg:left-10 z-30 p-2 sm:p-3 rounded-full bg-[rgb(var(--bg-card))]/90 backdrop-blur-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))] hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center group"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={handleNextCert}
                            aria-label="Next certificate"
                            className="absolute right-2 sm:right-6 lg:right-10 z-30 p-2 sm:p-3 rounded-full bg-[rgb(var(--bg-card))]/90 backdrop-blur-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))] hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center group"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
                        </button>

                        {/* Carousel Track */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Render ALL certificates so they can animate properly (no removal from DOM) */}
                            {certificates.map((cert, index) => {
                                const position = getCardStyle(index);

                                return (
                                    <motion.div
                                        key={cert._id}
                                        initial={false}
                                        animate={position}
                                        variants={cardVariants}
                                        className="absolute w-[80vw] max-w-[260px] sm:w-[70vw] sm:max-w-[400px] lg:max-w-[500px]"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <GlassCard className="h-[350px] sm:h-[400px] lg:h-[450px] flex flex-col p-0 overflow-hidden shadow-2xl border border-[rgb(var(--border))] hover:border-[rgb(var(--accent))]/50 transition-all duration-300 transform-gpu">
                                            {/* Image Area */}
                                            <div className="relative h-40 sm:h-48 lg:h-60 bg-[rgb(var(--bg-secondary))]/30 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--accent))]/5 to-transparent" />
                                                <img
                                                    src={cert.image.url}
                                                    alt={cert.title}
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                />
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between bg-[rgb(var(--bg-card))]/80 backdrop-blur-md">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-base sm:text-lg lg:text-xl leading-tight line-clamp-2 text-[rgb(var(--text-primary))]">
                                                            {cert.title}
                                                        </h3>
                                                        <Award className="w-5 h-5 text-[rgb(var(--accent))] flex-shrink-0" />
                                                    </div>
                                                    <p className="text-xs sm:text-sm font-medium text-[rgb(var(--accent))] mb-3 sm:mb-4">
                                                        {cert.issuer}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] line-clamp-2 sm:line-clamp-3">
                                                        {cert.description}
                                                    </p>
                                                </div>

                                                <div className="pt-4 mt-2 flex items-center justify-between border-t border-[rgb(var(--border))]">
                                                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))]">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    {cert.credentialUrl && (
                                                        <a
                                                            href={cert.credentialUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-xs font-bold text-[rgb(var(--text-primary))] hover:text-[rgb(var(--accent))] transition-colors"
                                                        >
                                                            Verify <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Mobile Indicators - Enhanced */}
                        <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                            {certificates.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCertIndex(idx)}
                                    aria-label={`Go to certificate ${idx + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === certIndex
                                        ? 'w-8 bg-[rgb(var(--accent))]'
                                        : 'w-2 bg-[rgb(var(--border))] hover:bg-[rgb(var(--text-secondary))]/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AboutPage;