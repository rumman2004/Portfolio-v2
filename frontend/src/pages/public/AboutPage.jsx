import { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TypeAnimation } from 'react-type-animation';
import { aboutAPI, experienceAPI, certificatesAPI, skillsAPI, socialsAPI } from '../../services/api';
import { GlassCard } from '../../components/ui';
import {
    Calendar, MapPin, Award, Mail, Phone,
    Briefcase, Code, User, ExternalLink, GraduationCap,
    Layers, Database, Server, Wrench, Cloud, Terminal,
    ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { socialIconMap } from '../../components/icons/SocialIcons';
import Loader from '../../components/ui/Loader';
import { getSkillIcon } from '../../components/icons';

gsap.registerPlugin(ScrollTrigger);

/*
 * Fonts: Syne 800 (headings/names) + DM Mono 300/400 (labels, meta, mono)
 * — same pair across Hero, Skills, GithubActivity
 */

const getSocialIcon = (platform) => {
    const IconComponent = socialIconMap[platform.toLowerCase()];
    return IconComponent || socialIconMap.github;
};

/* ── Neu stat card ───────────────────────────────────────────────────────── */
const NeuStat = ({ icon: Icon, value, label, index }) => {
    const ref = useRef(null);
    useEffect(() => {
        gsap.fromTo(ref.current,
            { y: 28, opacity: 0, scale: 0.94 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 0.75, ease: 'expo.out',
                delay: index * 0.1,
                scrollTrigger: { trigger: ref.current, start: 'top 88%', toggleActions: 'play none none reverse' },
            }
        );
    }, [index]);

    return (
        <div
            ref={ref}
            style={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-[rgb(var(--bg-primary))] shadow-[5px_5px_15px_rgba(0,0,0,0.2),-5px_-5px_15px_rgba(255,255,255,0.05)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.5),-5px_-5px_15px_rgba(255,255,255,0.02)] transition-transform hover:scale-105"
        >
            <div className="p-2 sm:p-2.5 lg:p-3 rounded-full bg-[rgb(var(--bg-secondary))] mb-2 sm:mb-3 text-[rgb(var(--accent))] shadow-inner">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
            <h3
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: '-0.03em' }}
                className="text-2xl sm:text-3xl lg:text-4xl text-[rgb(var(--text-primary))]"
            >
                {value}+
            </h3>
            <p
                style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.58rem', letterSpacing: '0.2em' }}
                className="text-[rgb(var(--text-secondary))] uppercase tracking-wider text-center mt-1"
            >
                {label}
            </p>
        </div>
    );
};

/* ── Neu skill category marquee group ────────────────────────────────────── */
const NeuCategoryGroup = ({ group }) => {
    const getCategoryIcon = (id) => {
        const l = id.toLowerCase();
        if (l.includes('front')) return Layers;
        if (l.includes('back'))  return Server;
        if (l.includes('data'))  return Database;
        if (l.includes('devops') || l.includes('cloud')) return Cloud;
        if (l.includes('tool'))  return Wrench;
        return Terminal;
    };
    const CategoryIcon = getCategoryIcon(group._id);

    return (
        <div className="flex flex-col items-center gap-8 mx-12">
            {/* Pill label */}
            <div
                className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-full
                    bg-[rgb(var(--bg-primary))]
                    shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.2)]
                    dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.02),5px_5px_15px_rgba(0,0,0,0.5)]
                    border border-[rgb(var(--text-secondary))]/5"
            >
                <CategoryIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                <span
                    style={{ fontFamily: "'DM Mono', monospace", fontWeight: 400, fontSize: '0.65rem', letterSpacing: '0.22em' }}
                    className="uppercase text-[rgb(var(--text-primary))]"
                >
                    {group._id}
                </span>
            </div>

            {/* Skill icons */}
            <div className="flex flex-row flex-nowrap gap-4 sm:gap-6 justify-center">
                {group.skills.map((skill) => {
                    const SkillIcon = getSkillIcon(skill.iconName || skill.name.toLowerCase());
                    return (
                        <div key={skill._id} className="group relative">
                            <div
                                className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
                                    bg-[rgb(var(--bg-primary))]
                                    shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.2)]
                                    dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.02),5px_5px_15px_rgba(0,0,0,0.5)]
                                    border border-[rgb(var(--text-secondary))]/5
                                    transition-transform active:scale-95 hover:-translate-y-1"
                                title={skill.name}
                            >
                                <div className="text-[rgb(var(--accent))] drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                                    {SkillIcon ? <SkillIcon className="w-8 h-8 sm:w-10 sm:h-10" /> : <Code className="w-8 h-8" />}
                                </div>
                            </div>
                            <span
                                style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.55rem', letterSpacing: '0.1em' }}
                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 uppercase text-[rgb(var(--text-secondary))] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[rgb(var(--bg-secondary))] px-2 py-1 rounded shadow-sm z-10"
                            >
                                {skill.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ── Main page ───────────────────────────────────────────────────────────── */
const AboutPage = () => {
    const [about, setAbout]               = useState(null);
    const [experiences, setExperiences]   = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [skillGroups, setSkillGroups]   = useState([]);
    const [socials, setSocials]           = useState([]);
    const [loading, setLoading]           = useState(true);
    const [certIndex, setCertIndex]       = useState(0);
    const [isHovered, setIsHovered]       = useState(false);
    const [touchStart, setTouchStart]     = useState(null);
    const [touchEnd, setTouchEnd]         = useState(null);

    /* section refs */
    const heroTagRef    = useRef(null);
    const heroRulerRef  = useRef(null);
    const heroNameRef   = useRef(null);
    const heroRightRef  = useRef(null);
    const heroImgRef    = useRef(null);

    const skillsTagRef   = useRef(null);
    const skillsRulerRef = useRef(null);
    const skillsHeadRef  = useRef(null);

    const expTagRef    = useRef(null);
    const expRulerRef  = useRef(null);
    const expHeadRef   = useRef(null);
    const expLineRef   = useRef(null);
    const expItemsRef  = useRef([]);

    const certTagRef   = useRef(null);
    const certRulerRef = useRef(null);
    const certHeadRef  = useRef(null);
    const certAreaRef  = useRef(null);

    /* ── Fetch ── */
    useEffect(() => {
        (async () => {
            try {
                const [aboutRes, expRes, certRes, skillsRes, socialsRes] = await Promise.all([
                    aboutAPI.get(),
                    experienceAPI.getAll(),
                    certificatesAPI.getAll(),
                    skillsAPI.getGrouped(),
                    socialsAPI.getAll({ visible: true }),
                ]);
                setAbout(aboutRes.data.data);
                setExperiences(expRes.data.data);
                setCertificates(certRes.data.data);
                setSkillGroups(skillsRes.data.data);
                setSocials(socialsRes.data.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    /* ── Cert auto-advance ── */
    useEffect(() => {
        if (!certificates.length || isHovered) return;
        const t = setInterval(() => setCertIndex(p => (p + 1) % certificates.length), 5000);
        return () => clearInterval(t);
    }, [certIndex, certificates.length, isHovered]);

    /* ── GSAP entrance animations ── */
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {

            /* helper: tag + ruler reveal */
            const tagReveal = (tagEl, rulerEl) => {
                if (!tagEl) return;
                gsap.fromTo(tagEl,
                    { x: -36, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
                      scrollTrigger: { trigger: tagEl, start: 'top 88%', toggleActions: 'play none none reverse' } }
                );
                if (rulerEl) gsap.fromTo(rulerEl,
                    { scaleX: 0, transformOrigin: 'left center' },
                    { scaleX: 1, duration: 1.2, ease: 'expo.out', delay: 0.08,
                      scrollTrigger: { trigger: tagEl, start: 'top 88%', toggleActions: 'play none none reverse' } }
                );
            };

            /* helper: heading rise + deskew */
            const headReveal = (el, triggerEl) => {
                if (!el) return;
                gsap.fromTo(el,
                    { y: 64, opacity: 0, skewY: 2.5 },
                    { y: 0, opacity: 1, skewY: 0, duration: 1.15, ease: 'expo.out',
                      scrollTrigger: { trigger: triggerEl || el, start: 'top 85%', toggleActions: 'play none none reverse' } }
                );
            };

            /* ─ Hero section ─ */
            const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
            heroTl
                .fromTo(heroImgRef.current,  { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1 }, 0.15)
                .fromTo(heroTagRef.current,  { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 }, 0.2)
                .fromTo(heroRulerRef.current,{ scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.1 }, 0.32)
                .fromTo(heroNameRef.current, { y: 48, opacity: 0, skewY: 2 }, { y: 0, opacity: 1, skewY: 0, duration: 1.1 }, 0.4)
                .fromTo(heroRightRef.current,{ x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1.0 }, 0.3);

            /* ─ Skills section ─ */
            tagReveal(skillsTagRef.current, skillsRulerRef.current);
            headReveal(skillsHeadRef.current);

            /* ─ Experience section ─ */
            tagReveal(expTagRef.current, expRulerRef.current);
            headReveal(expHeadRef.current);

            if (expLineRef.current) {
                gsap.fromTo(expLineRef.current,
                    { scaleY: 0, transformOrigin: 'top center' },
                    { scaleY: 1, duration: 1.4, ease: 'expo.out',
                      scrollTrigger: { trigger: expLineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }
                );
            }

            expItemsRef.current.forEach((el, i) => {
                if (!el) return;
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', delay: i * 0.08,
                      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' } }
                );
            });

            /* ─ Certificates section ─ */
            tagReveal(certTagRef.current, certRulerRef.current);
            headReveal(certHeadRef.current);
            if (certAreaRef.current) {
                gsap.fromTo(certAreaRef.current,
                    { y: 40, opacity: 0, scale: 0.97 },
                    { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out',
                      scrollTrigger: { trigger: certAreaRef.current, start: 'top 82%', toggleActions: 'play none none reverse' } }
                );
            }

        });

        return () => ctx.revert();
    }, [loading]);

    /* ── Certificate helpers ── */
    const handleNextCert = useCallback(() => setCertIndex(p => (p + 1) % certificates.length), [certificates.length]);
    const handlePrevCert = useCallback(() => setCertIndex(p => (p - 1 + certificates.length) % certificates.length), [certificates.length]);

    const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove  = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
    const onTouchEnd   = () => {
        if (!touchStart || !touchEnd) return;
        const d = touchStart - touchEnd;
        if (d > 50) handleNextCert(); else if (d < -50) handlePrevCert();
    };

    const getCardStyle = (index) => {
        const len = certificates.length;
        if (!len) return 'hidden';
        let offset = (index - certIndex + len) % len;
        if (offset > len / 2) offset -= len;
        if (offset === 0) return 'center';
        if (offset === -1 || (len === 2 && offset === 1)) return 'left';
        if (offset === 1) return 'right';
        return offset < 0 ? 'hiddenLeft' : 'hiddenRight';
    };

    const certPositions = {
        center:      { x: '0%',    scale: 1,    opacity: 1,   zIndex: 30, rotateY: 0,   filter: 'blur(0px)',  transition: { duration: 0.7, ease: [0.645,0.045,0.355,1] } },
        left:        { x: '-85%',  scale: 0.75, opacity: 0.6, zIndex: 20, rotateY: 25,  filter: 'blur(1px)',  transition: { duration: 0.7, ease: [0.645,0.045,0.355,1] } },
        right:       { x: '85%',   scale: 0.75, opacity: 0.6, zIndex: 20, rotateY: -25, filter: 'blur(1px)',  transition: { duration: 0.7, ease: [0.645,0.045,0.355,1] } },
        hiddenLeft:  { x: '-120%', scale: 0.4,  opacity: 0,   zIndex: 10, rotateY: 35,  filter: 'blur(4px)',  transition: { duration: 0.7, ease: [0.645,0.045,0.355,1] } },
        hiddenRight: { x: '120%',  scale: 0.4,  opacity: 0,   zIndex: 10, rotateY: -35, filter: 'blur(4px)',  transition: { duration: 0.7, ease: [0.645,0.045,0.355,1] } },
    };

    if (loading) return <Loader fullScreen size="xl" />;

    const marqueeGroups = [...skillGroups, ...skillGroups];

    /* ── Shared section-header render helper ── */
    const SectionTag = ({ number, label, tagRef, rulerRef, icon: TagIcon }) => (
        <div
            ref={tagRef}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0 }}
        >
            <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontStyle: 'italic', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgb(var(--accent))', opacity: 0.8 }}>
                {number} /
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>
                {label}
            </span>
            <div
                ref={rulerRef}
                style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }}
            />
            {TagIcon && <TagIcon style={{ width: '0.8rem', height: '0.8rem', color: 'rgb(var(--accent))', opacity: 0.5, flexShrink: 0 }} />}
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
                .about-heading { font-family: 'Syne', sans-serif; font-weight: 800; }
                .about-mono    { font-family: 'DM Mono', monospace; }
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                .bg-grid-subtle {
                    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 64px 64px;
                }
            `}</style>

            <div className="min-h-screen pb-20">

                {/* ═══════════════════════════════════════════════════════
                    HERO SECTION
                ═══════════════════════════════════════════════════════ */}
                <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-grid-subtle">

                    {/* Glow blobs */}
                    <div className="absolute top-20 left-[10%] w-72 h-72 bg-[rgb(var(--accent))]/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-40 right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container mx-auto max-w-6xl relative z-10">
                        {about && (
                            <div className="flex flex-col lg:flex-row gap-12 items-start">

                                {/* LEFT: Profile */}
                                <div
                                    ref={heroImgRef}
                                    style={{ opacity: 0 }}
                                    className="w-full lg:w-1/3 flex flex-col items-center text-center lg:items-start lg:text-left"
                                >
                                    <div className="relative mb-8 group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[rgb(var(--accent))] to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                                        <div className="relative w-90 h-85 rounded-3xl overflow-hidden border-4 border-[rgb(var(--bg-primary))] shadow-2xl">
                                            {about.profileImage?.url ? (
                                                <img src={about.profileImage.url} alt={about.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[rgb(var(--bg-secondary))]">
                                                    <User className="w-24 h-24 text-[rgb(var(--text-secondary))]/30" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tag row */}
                                    <div ref={heroTagRef} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', opacity: 0 }}>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontStyle: 'italic', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgb(var(--accent))', opacity: 0.8 }}>
                                            01 /
                                        </span>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>
                                            Profile
                                        </span>
                                        <div ref={heroRulerRef} style={{ width: '3rem', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)' }} />
                                    </div>

                                    {/* Name */}
                                    <h1
                                        ref={heroNameRef}
                                        className="about-heading"
                                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.92, letterSpacing: '-0.035em', color: 'rgb(var(--text-primary))', marginBottom: '1rem', opacity: 0 }}
                                    >
                                        {about.name}
                                    </h1>

                                    {/* TypeAnimation title */}
                                    <div
                                        className="about-mono"
                                        style={{ fontWeight: 300, fontSize: '0.85rem', letterSpacing: '0.04em', color: 'rgb(var(--accent))', marginBottom: '1.5rem', minHeight: '1.6rem' }}
                                    >
                                        <TypeAnimation
                                            sequence={[about.title, 2000, '', 500]}
                                            wrapper="span"
                                            speed={50}
                                            repeat={Infinity}
                                        />
                                    </div>

                                    {/* Socials */}
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                        {socials.map(social => {
                                            const Icon = getSocialIcon(social.platform);
                                            return (
                                                <a key={social._id} href={social.url} target="_blank" rel="noopener noreferrer"
                                                    title={social.platform}
                                                    className="p-3 glass rounded-xl text-[rgb(var(--text-primary))] hover:text-[rgb(var(--accent))] hover:-translate-y-1 transition-all"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </a>
                                            );
                                        })}
                                        {about.resume?.url && (
                                            <a href={about.resume.url} target="_blank" rel="noopener noreferrer" title="View Resume"
                                                className="p-3 glass rounded-xl text-[rgb(var(--text-primary))] hover:text-[rgb(var(--accent))] hover:-translate-y-1 transition-all"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT: Bio + Contact + Stats */}
                                <div
                                    ref={heroRightRef}
                                    style={{ opacity: 0 }}
                                    className="w-full lg:w-2/3"
                                >
                                    <GlassCard className="p-8 mb-8 border-l-4 border-l-[rgb(var(--accent))]">
                                        <h3
                                            className="about-heading text-2xl mb-4 flex items-center gap-2"
                                            style={{ letterSpacing: '-0.02em' }}
                                        >
                                            <User className="w-6 h-6 text-[rgb(var(--accent))]" /> About Me
                                        </h3>
                                        <p
                                            className="about-mono leading-relaxed whitespace-pre-line"
                                            style={{ fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.9, color: 'rgb(var(--text-secondary))' }}
                                        >
                                            {about.bio}
                                        </p>
                                    </GlassCard>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                                        {about.email && (
                                            <GlassCard className="p-5 flex flex-col items-center lg:items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
                                                <div className="flex items-center gap-2 text-[rgb(var(--accent))] font-bold">
                                                    <Mail className="w-5 h-5" />
                                                    <span className="about-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>Email</span>
                                                </div>
                                                <a href={`mailto:${about.email}`} className="about-mono text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors break-all text-center lg:text-left" style={{ fontWeight: 300 }}>
                                                    {about.email}
                                                </a>
                                            </GlassCard>
                                        )}
                                        {about.phone && (
                                            <GlassCard className="p-5 flex flex-col items-center lg:items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
                                                <div className="flex items-center gap-2 text-[rgb(var(--accent))] font-bold">
                                                    <Phone className="w-5 h-5" />
                                                    <span className="about-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>Phone</span>
                                                </div>
                                                <a href={`tel:${about.phone}`} className="about-mono text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors text-center lg:text-left" style={{ fontWeight: 300 }}>
                                                    {about.phone}
                                                </a>
                                            </GlassCard>
                                        )}
                                        {about.location && (
                                            <GlassCard className="p-5 flex flex-col items-center lg:items-start gap-3 hover:-translate-y-1 transition-transform duration-300">
                                                <div className="flex items-center gap-2 text-[rgb(var(--accent))] font-bold">
                                                    <MapPin className="w-5 h-5" />
                                                    <span className="about-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>Location</span>
                                                </div>
                                                <p className="about-mono text-sm text-[rgb(var(--text-secondary))] text-center lg:text-left" style={{ fontWeight: 300 }}>
                                                    {about.location}
                                                </p>
                                            </GlassCard>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <NeuStat icon={Briefcase} value={about.stats?.yearsExperience}   label="Years Exp." index={0} />
                                        <NeuStat icon={Code}      value={about.stats?.projectsCompleted} label="Projects"   index={1} />
                                        <NeuStat icon={Award}     value={about.stats?.certificatesEarned} label="Awards"   index={2} />
                                        <NeuStat icon={User}      value={about.stats?.happyClients}       label="Clients"  index={3} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    SKILLS SECTION
                ═══════════════════════════════════════════════════════ */}
                {skillGroups.length > 0 && (
                    <section className="py-24 overflow-hidden relative bg-grid-subtle">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
                            <SectionTag number="02" label="Skills & Technologies" tagRef={skillsTagRef} rulerRef={skillsRulerRef} icon={Code} />
                            <h2
                                ref={skillsHeadRef}
                                className="about-heading"
                                style={{ fontSize: 'clamp(3rem, 7.5vw, 6.5rem)', lineHeight: 0.9, letterSpacing: '-0.035em', color: 'rgb(var(--text-primary))', opacity: 0 }}
                            >
                                Technical{' '}
                                <em style={{ color: 'rgb(var(--accent))', fontStyle: 'italic', fontWeight: 800 }}>Arsenal</em>
                            </h2>
                        </div>

                        <div className="relative w-full overflow-hidden mask-linear-fade">
                            {/* CSS marquee via animation — no Framer needed */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    paddingBlock: '2rem',
                                    width: 'max-content',
                                    animation: 'skillsMarquee 24s linear infinite',
                                }}
                            >
                                {marqueeGroups.map((group, i) => (
                                    <NeuCategoryGroup key={`${group._id}-${i}`} group={group} />
                                ))}
                            </div>
                        </div>

                        <style>{`
                            @keyframes skillsMarquee {
                                0%   { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                        `}</style>
                    </section>
                )}

                {/* ═══════════════════════════════════════════════════════
                    EXPERIENCE SECTION
                ═══════════════════════════════════════════════════════ */}
                {experiences.length > 0 && (
                    <section className="container mx-auto px-4 py-20 max-w-5xl relative">

                        <SectionTag number="03" label="Career Journey" tagRef={expTagRef} rulerRef={expRulerRef} icon={Briefcase} />

                        <h2
                            ref={expHeadRef}
                            className="about-heading mb-16"
                            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, letterSpacing: '-0.035em', color: 'rgb(var(--text-primary))', opacity: 0 }}
                        >
                            My{' '}
                            <em style={{ color: 'rgb(var(--accent))', fontStyle: 'italic', fontWeight: 800 }}>Journey</em>
                        </h2>

                        <div className="relative">
                            {/* Timeline line */}
                            <div
                                ref={expLineRef}
                                className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[rgb(var(--accent))] via-purple-500 to-transparent md:-translate-x-1/2"
                                style={{ transformOrigin: 'top center' }}
                            />

                            <div className="space-y-12">
                                {experiences.map((exp, index) => (
                                    <div
                                        key={exp._id}
                                        ref={el => expItemsRef.current[index] = el}
                                        style={{ opacity: 0 }}
                                        className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-0 w-3 h-3 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_15px_rgb(var(--accent))]" />
                                        <div className="md:w-1/2" />
                                        <div className="md:w-1/2 pl-6 md:pl-0">
                                            <GlassCard className="relative p-6 border-t-4 border-t-[rgb(var(--accent))] hover:-translate-y-1 transition-transform duration-300">
                                                <div className="absolute top-4 right-4 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border))] px-3 py-1 rounded-full shadow-sm">
                                                    <span className="about-mono" style={{ fontSize: '0.58rem', fontWeight: 400, letterSpacing: '0.1em', color: 'rgb(var(--accent))' }}>
                                                        {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2.5 rounded-xl bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]">
                                                        {exp.title.toLowerCase().includes('student') || exp.title.toLowerCase().includes('degree')
                                                            ? <GraduationCap className="w-5 h-5" />
                                                            : <Briefcase className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="about-heading leading-tight" style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{exp.title}</h3>
                                                        <p className="about-mono" style={{ fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.06em', color: 'rgb(var(--text-secondary))' }}>{exp.company}</p>
                                                    </div>
                                                </div>
                                                <p className="about-mono mb-4 leading-relaxed" style={{ fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.8, color: 'rgb(var(--text-secondary))' }}>
                                                    {exp.description}
                                                </p>
                                                {exp.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5" style={{ color: 'rgb(var(--accent))' }} />
                                                        <span className="about-mono" style={{ fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgb(var(--text-secondary))' }}>{exp.location}</span>
                                                    </div>
                                                )}
                                            </GlassCard>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══════════════════════════════════════════════════════
                    CERTIFICATES SECTION
                ═══════════════════════════════════════════════════════ */}
                {certificates.length > 0 && (
                    <section className="py-24 relative overflow-hidden">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
                            <SectionTag number="04" label="Honors & Certificates" tagRef={certTagRef} rulerRef={certRulerRef} icon={Award} />
                            <h2
                                ref={certHeadRef}
                                className="about-heading"
                                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, letterSpacing: '-0.035em', color: 'rgb(var(--text-primary))', opacity: 0 }}
                            >
                                Honors &{' '}
                                <em style={{ color: 'rgb(var(--accent))', fontStyle: 'italic', fontWeight: 800 }}>Certificates</em>
                            </h2>
                        </div>

                        <div
                            ref={certAreaRef}
                            style={{ opacity: 0 }}
                            className="relative w-full max-w-[1200px] mx-auto h-[400px] sm:h-[500px] lg:h-[550px] flex items-center justify-center"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {/* Nav buttons */}
                            {[
                                { dir: 'prev', Icon: ChevronLeft, handler: handlePrevCert, pos: 'left-2 sm:left-6 lg:left-10' },
                                { dir: 'next', Icon: ChevronRight, handler: handleNextCert, pos: 'right-2 sm:right-6 lg:right-10' },
                            ].map(({ dir, Icon, handler, pos }) => (
                                <button
                                    key={dir}
                                    onClick={handler}
                                    aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} certificate`}
                                    className={`absolute ${pos} z-30 p-2 sm:p-3 rounded-full bg-[rgb(var(--bg-card))]/90 backdrop-blur-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))] hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center group`}
                                >
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${dir === 'prev' ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                                </button>
                            ))}

                            {/* Cards — still use AnimatePresence/motion for the 3D carousel effect */}
                            <div
                                className="relative w-full h-full flex items-center justify-center"
                                style={{ perspective: '2000px', perspectiveOrigin: 'center' }}
                            >
                                {certificates.map((cert, index) => {
                                    const position = getCardStyle(index);
                                    const v = certPositions[position] || certPositions.hiddenRight;
                                    return (
                                        <div
                                            key={cert._id}
                                            className="absolute w-[80vw] max-w-[260px] sm:w-[70vw] sm:max-w-[400px] lg:max-w-[500px]"
                                            style={{
                                                transform: `translateX(${v.x}) scale(${v.scale}) rotateY(${v.rotateY}deg)`,
                                                opacity: v.opacity,
                                                zIndex: v.zIndex,
                                                filter: v.filter,
                                                transition: 'transform 0.7s cubic-bezier(0.645,0.045,0.355,1), opacity 0.7s ease, filter 0.7s ease',
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            <GlassCard className="h-[350px] sm:h-[400px] lg:h-[450px] flex flex-col p-0 overflow-hidden shadow-2xl border border-[rgb(var(--border))] hover:border-[rgb(var(--accent))]/50 transition-all duration-300 transform-gpu">
                                                <div className="relative h-40 sm:h-48 lg:h-60 bg-[rgb(var(--bg-secondary))]/30 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--accent))]/5 to-transparent" />
                                                    <img src={cert.image.url} alt={cert.title} className="w-full h-full object-contain drop-shadow-lg" />
                                                </div>
                                                <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between bg-[rgb(var(--bg-card))]/80 backdrop-blur-md">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="about-heading text-base sm:text-lg lg:text-xl leading-tight line-clamp-2 text-[rgb(var(--text-primary))]" style={{ letterSpacing: '-0.02em' }}>
                                                                {cert.title}
                                                            </h3>
                                                            <Award className="w-5 h-5 text-[rgb(var(--accent))] flex-shrink-0" />
                                                        </div>
                                                        <p className="about-mono mb-3 sm:mb-4" style={{ fontWeight: 400, fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgb(var(--accent))' }}>{cert.issuer}</p>
                                                        <p className="about-mono line-clamp-2 sm:line-clamp-3" style={{ fontWeight: 300, fontSize: '0.72rem', lineHeight: 1.75, color: 'rgb(var(--text-secondary))' }}>{cert.description}</p>
                                                    </div>
                                                    <div className="pt-4 mt-2 flex items-center justify-between border-t border-[rgb(var(--border))]">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3 h-3 text-[rgb(var(--text-secondary))]" />
                                                            <span className="about-mono" style={{ fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.08em', color: 'rgb(var(--text-secondary))' }}>
                                                                {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        {cert.credentialUrl && (
                                                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                                                                className="about-mono flex items-center gap-1.5 hover:text-[rgb(var(--accent))] transition-colors"
                                                                style={{ fontWeight: 400, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgb(var(--text-primary))' }}
                                                            >
                                                                Verify <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Dots */}
                            <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                                {certificates.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCertIndex(idx)}
                                        aria-label={`Go to certificate ${idx + 1}`}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === certIndex ? 'w-8 bg-[rgb(var(--accent))]' : 'w-2 bg-[rgb(var(--border))] hover:bg-[rgb(var(--text-secondary))]/50'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default AboutPage;