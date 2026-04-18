import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { GlassCard, Input, Textarea, Button } from '../../components/ui';
import ClockWeatherCard from '../../components/ui/ClockWeatherCard';
import { contactsAPI, aboutAPI, socialsAPI } from '../../services/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

/*
 * Fonts: Syne 800 (headings) + DM Mono 300/400 (labels, meta)
 * — same pair across Hero, Skills, GithubActivity, AboutPage
 */

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', phone: '' });
    const [loading, setLoading]   = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [about, setAbout]       = useState(null);
    const [socials, setSocials]   = useState([]);

    /* refs */
    const sectionRef  = useRef(null);
    const tagRef      = useRef(null);
    const rulerRef    = useRef(null);
    const headingRef  = useRef(null);
    const subRef      = useRef(null);
    const leftColRef  = useRef(null);
    const rightColRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const [aboutRes, socialsRes] = await Promise.all([
                    aboutAPI.get(),
                    socialsAPI.getAll({ visible: true }),
                ]);
                setAbout(aboutRes.data.data);
                setSocials(socialsRes.data.data);
            } catch (e) { console.error(e); }
        })();
    }, []);

    /* ── GSAP entrance ── */
    useEffect(() => {
        const ctx = gsap.context(() => {

            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            /* 1 · Tag row: slide from left */
            tl.fromTo(tagRef.current,
                { x: -36, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.9 }, 0.15
            );

            /* 2 · Ruler: scaleX expand — same as Skills divider */
            tl.fromTo(rulerRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 1.2 }, 0.28
            );

            /* 3 · Heading: rise + deskew */
            tl.fromTo(headingRef.current,
                { y: 64, opacity: 0, skewY: 2.5 },
                { y: 0, opacity: 1, skewY: 0, duration: 1.15 }, 0.35
            );

            /* 4 · Sub text: fade up */
            tl.fromTo(subRef.current,
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, delay: 0.18 }, 0.5
            );

            /* 5 · Left col: slide from left */
            tl.fromTo(leftColRef.current,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.0 }, 0.55
            );

            /* 6 · Right col: slide from right */
            tl.fromTo(rightColRef.current,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.0 }, 0.55
            );

        }, sectionRef.current);

        return () => ctx.revert();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await contactsAPI.create(formData);
            toast.success(response.data.message || 'Message sent successfully!');
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '', phone: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
                .contact-heading { font-family: 'Syne', sans-serif; font-weight: 800; }
                .contact-mono    { font-family: 'DM Mono', monospace; }
                .bg-grid-subtle  {
                    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 64px 64px;
                }
                /* Social pill hover */
                .social-pill {
                    transition: transform 0.25s cubic-bezier(0.23,1,0.32,1), background 0.2s ease;
                }
                .social-pill:hover {
                    transform: translateY(-3px) scale(1.04);
                }
                /* Form input focus accent */
                .contact-form input:focus,
                .contact-form textarea:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgb(var(--accent) / 0.35);
                }
            `}</style>

            <div className="min-h-screen bg-grid-subtle" ref={sectionRef}>
                <section className="container mx-auto px-4 py-12 sm:py-20">
                    <div className="max-w-6xl mx-auto">

                        {/* ── Header ── */}
                        <div className="mb-12 sm:mb-16">

                            {/* Tag row — "05 / Contact" */}
                            <div
                                ref={tagRef}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0 }}
                            >
                                <span className="contact-mono" style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgb(var(--accent))', opacity: 0.8 }}>
                                    05 /
                                </span>
                                <span className="contact-mono" style={{ fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>
                                    Get In Touch
                                </span>
                                <div
                                    ref={rulerRef}
                                    style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }}
                                />
                                <Mail style={{ width: '0.8rem', height: '0.8rem', color: 'rgb(var(--accent))', opacity: 0.5, flexShrink: 0 }} />
                            </div>

                            {/* Heading — same size/weight/skew style as Skills */}
                            <h1
                                ref={headingRef}
                                className="contact-heading"
                                style={{ fontSize: 'clamp(3rem, 7.5vw, 6.5rem)', lineHeight: 0.9, letterSpacing: '-0.035em', color: 'rgb(var(--text-primary))', marginBottom: '1.5rem', opacity: 0 }}
                            >
                                Get In{' '}
                                <em style={{ color: 'rgb(var(--accent))', fontStyle: 'italic', fontWeight: 800 }}>Touch</em>
                            </h1>

                            {/* Sub — same DM Mono style as Skills description */}
                            <p
                                ref={subRef}
                                className="contact-mono"
                                style={{ fontWeight: 300, fontSize: 'clamp(0.78rem, 1vw, 0.9rem)', lineHeight: 1.85, letterSpacing: '0.01em', color: 'rgb(var(--text-secondary))', maxWidth: '50ch', opacity: 0 }}
                            >
                                Have a question or want to work together? Feel free to reach out — I generally respond within 24 hours.
                            </p>
                        </div>

                        {/* ── Two-column layout ── */}
                        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

                            {/* LEFT: Contact Info + Clock + Socials */}
                            <div ref={leftColRef} style={{ opacity: 0 }} className="space-y-5 sm:space-y-6">

                                {/* Contact info card */}
                                <GlassCard>
                                    <h2
                                        className="contact-heading mb-6"
                                        style={{ fontSize: '1.4rem', letterSpacing: '-0.025em' }}
                                    >
                                        Contact Information
                                    </h2>

                                    <div className="space-y-5 sm:space-y-6">
                                        {about?.email && (
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0 text-[rgb(var(--accent))]">
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="contact-mono mb-1" style={{ fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>Email</p>
                                                    <a href={`mailto:${about.email}`} className="contact-mono text-sm font-medium break-all hover:text-[rgb(var(--accent))] transition-colors" style={{ fontWeight: 300 }}>
                                                        {about.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {about?.phone && (
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0 text-[rgb(var(--accent))]">
                                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="contact-mono mb-1" style={{ fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>Phone</p>
                                                    <a href={`tel:${about.phone}`} className="contact-mono text-sm font-medium hover:text-[rgb(var(--accent))] transition-colors" style={{ fontWeight: 300 }}>
                                                        {about.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {about?.location && (
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0 text-[rgb(var(--accent))]">
                                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="contact-mono mb-1" style={{ fontWeight: 400, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))' }}>Location</p>
                                                    <p className="contact-mono text-sm font-medium" style={{ fontWeight: 300 }}>{about.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>

                                {/* Clock/weather */}
                                {about?.location && (
                                    <div className="w-full">
                                        <ClockWeatherCard locationString={about.location} />
                                    </div>
                                )}

                                {/* Socials */}
                                {socials.length > 0 && (
                                    <GlassCard>
                                        <h3
                                            className="contact-heading mb-4"
                                            style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}
                                        >
                                            Follow Me
                                        </h3>
                                        <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                            {socials.map((social) => (
                                                <a
                                                    key={social._id}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="social-pill px-3.5 py-2 sm:px-4 sm:py-2.5 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-colors"
                                                >
                                                    <span
                                                        className="contact-mono capitalize"
                                                        style={{ fontWeight: 400, fontSize: '0.7rem', letterSpacing: '0.1em' }}
                                                    >
                                                        {social.platform}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </GlassCard>
                                )}
                            </div>

                            {/* RIGHT: Form */}
                            <div ref={rightColRef} style={{ opacity: 0 }}>
                                <GlassCard className="h-full contact-form">
                                    <h2
                                        className="contact-heading mb-6"
                                        style={{ fontSize: '1.4rem', letterSpacing: '-0.025em' }}
                                    >
                                        Send Message
                                    </h2>

                                    {submitted ? (
                                        <div className="text-center py-12 flex flex-col items-center justify-center h-[400px]">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                                                style={{ animation: 'successPop 0.5s cubic-bezier(0.23,1,0.32,1) forwards' }}
                                            >
                                                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                                            </div>
                                            <h3 className="contact-heading mb-2" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Message Sent!</h3>
                                            <p className="contact-mono max-w-xs mx-auto px-4" style={{ fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.85, color: 'rgb(var(--text-secondary))' }}>
                                                Thank you for reaching out. I generally respond within 24 hours.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                            <Input label="Name"             name="name"    value={formData.name}    onChange={handleChange} placeholder="Your Name"         required />
                                            <Input label="Email" type="email" name="email" value={formData.email}   onChange={handleChange} placeholder="your@email.com"    required />
                                            <Input label="Phone (Optional)" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" />
                                            <Input label="Subject"          name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Inquiry" />
                                            <Textarea label="Message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." rows={6} required />
                                            <Button type="submit" className="w-full mt-2" size="lg" loading={loading} icon={Send}>
                                                {loading ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </form>
                                    )}
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                @keyframes successPop {
                    0%   { transform: scale(0.7); opacity: 0; }
                    100% { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default ContactPage;