import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { GlassCard, Input, Textarea, Button } from '../../components/ui';
import { contactsAPI, aboutAPI, socialsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', phone: '' });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [about, setAbout]       = useState(null);
  const [socials, setSocials]   = useState([]);

  const pageRef     = useRef(null);
  const headingRef  = useRef(null);
  const subRef      = useRef(null);
  const infoRef     = useRef(null);
  const formRef     = useRef(null);
  const successRef  = useRef(null);

  /* ── Fetch ── */
  useEffect(() => {
    Promise.all([aboutAPI.get(), socialsAPI.getAll({ visible: true })])
      .then(([aboutRes, socialsRes]) => {
        setAbout(aboutRes.data.data);
        setSocials(socialsRes.data.data);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Heading + sub — immediate on mount */
      gsap.fromTo(headingRef.current,
        { y: 50, opacity: 0, skewY: 2 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.0, ease: 'expo.out', delay: 0.05 }
      );
      gsap.fromTo(subRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', delay: 0.2 }
      );

      /* Info panel — slide from left */
      gsap.fromTo(infoRef.current,
        { x: -48, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.95, ease: 'expo.out', delay: 0.3 }
      );

      /* Form panel — slide from right */
      gsap.fromTo(formRef.current,
        { x: 48, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.95, ease: 'expo.out', delay: 0.3 }
      );

    }, pageRef.current);
    return () => ctx.revert();
  }, []);

  /* ── Success state animation ── */
  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.fromTo(successRef.current,
        { scale: 0.82, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(1.6)' }
      );
    }
  }, [submitted]);

  /* ── Handlers ── */
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
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Social hover ── */
  const onSocialEnter = (e) => gsap.to(e.currentTarget, { y: -3, scale: 1.05, duration: 0.25, ease: 'power2.out' });
  const onSocialLeave = (e) => gsap.to(e.currentTarget, { y: 0,  scale: 1,    duration: 0.25, ease: 'power2.out' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
        .contact-heading { font-family: 'Syne', sans-serif; font-weight: 800; }
        .contact-sub     { font-family: 'Syne', sans-serif; font-weight: 400; }
        .contact-mono    { font-family: 'DM Mono', monospace; font-weight: 300; }
        .contact-label   { font-family: 'DM Mono', monospace; font-weight: 400; font-size: 0.63rem; letter-spacing: 0.24em; text-transform: uppercase; }
      `}</style>

      <div ref={pageRef} className="min-h-screen">
        <section className="container mx-auto px-4 py-8 sm:py-20">
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

            {/* ── Header ── */}
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
              <h1
                ref={headingRef}
                className="contact-heading"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.035em',
                  color: 'rgb(var(--text-primary))',
                  marginBottom: '1rem',
                }}
              >
                Get In{' '}
                <em style={{ color: 'rgb(var(--accent))', fontStyle: 'italic' }}>Touch</em>
              </h1>
              <p
                ref={subRef}
                className="contact-mono"
                style={{
                  fontSize: 'clamp(0.78rem, 1vw, 0.92rem)',
                  lineHeight: 1.85,
                  color: 'rgb(var(--text-secondary))',
                  maxWidth: '44ch',
                  margin: '0 auto',
                }}
              >
                Have a question or want to work together? Feel free to reach out!
              </p>
            </div>

            {/* ── Two-col grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>

              {/* ── Info side ── */}
              <div ref={infoRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <GlassCard className="p-5 sm:p-8">
                  <h2 className="contact-sub" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'rgb(var(--text-primary))' }}>
                    Contact Information
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {about?.email && (
                      <ContactRow icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />} label="Email">
                        <a href={`mailto:${about.email}`} className="contact-mono"
                          style={{ fontSize: '0.85rem', color: 'rgb(var(--text-secondary))', wordBreak: 'break-all' }}
                          onMouseEnter={e => e.target.style.color = 'rgb(var(--accent))'}
                          onMouseLeave={e => e.target.style.color = 'rgb(var(--text-secondary))'}>
                          {about.email}
                        </a>
                      </ContactRow>
                    )}
                    {about?.phone && (
                      <ContactRow icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />} label="Phone">
                        <a href={`tel:${about.phone}`} className="contact-mono"
                          style={{ fontSize: '0.85rem', color: 'rgb(var(--text-secondary))' }}
                          onMouseEnter={e => e.target.style.color = 'rgb(var(--accent))'}
                          onMouseLeave={e => e.target.style.color = 'rgb(var(--text-secondary))'}>
                          {about.phone}
                        </a>
                      </ContactRow>
                    )}
                    {about?.location && (
                      <ContactRow icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />} label="Location">
                        <p className="contact-mono" style={{ fontSize: '0.85rem', color: 'rgb(var(--text-secondary))' }}>
                          {about.location}
                        </p>
                      </ContactRow>
                    )}
                  </div>
                </GlassCard>

                {socials.length > 0 && (
                  <GlassCard className="p-5 sm:p-8">
                    <h3 className="contact-label" style={{ color: 'rgb(var(--text-secondary))', marginBottom: '1rem' }}>
                      Follow Me
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {socials.map((social) => (
                        <a
                          key={social._id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-label glass"
                          onMouseEnter={onSocialEnter}
                          onMouseLeave={onSocialLeave}
                          style={{
                            padding: '0.4rem 0.9rem',
                            borderRadius: '0.5rem',
                            color: 'rgb(var(--text-primary))',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'background 0.25s ease',
                          }}
                        >
                          {social.platform}
                        </a>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* ── Form side ── */}
              <div ref={formRef}>
                <GlassCard className="p-5 sm:p-8">
                  <h2 className="contact-sub" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'rgb(var(--text-primary))' }}>
                    Send Message
                  </h2>

                  {submitted ? (
                    <div ref={successRef} style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                      <div style={{
                        width: '4.5rem', height: '4.5rem',
                        background: 'rgba(34,197,94,0.15)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                      }}>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="contact-heading" style={{ fontSize: '1.5rem', marginBottom: '0.6rem', color: 'rgb(var(--text-primary))' }}>
                        Message Sent!
                      </h3>
                      <p className="contact-mono" style={{ fontSize: '0.82rem', color: 'rgb(var(--text-secondary))', lineHeight: 1.75, marginBottom: '0.5rem' }}>
                        Thank you for reaching out! I'll get back to you soon.
                      </p>
                      <p className="contact-mono" style={{ fontSize: '0.72rem', color: 'rgb(var(--text-secondary))' }}>
                        📧 Check your email for confirmation.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                      <Input    label="Name"             name="name"    value={formData.name}    onChange={handleChange} placeholder="Your Name"        required className="text-sm" />
                      <Input    label="Email" type="email" name="email" value={formData.email}   onChange={handleChange} placeholder="your@email.com"   required className="text-sm" />
                      <Input    label="Phone (Optional)" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" className="text-sm" />
                      <Input    label="Subject"          name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Inquiry"            className="text-sm" />
                      <Textarea label="Message"          name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5} required className="text-sm" />

                      <Button type="submit" className="w-full mt-1" size="lg" loading={loading} icon={Send}>
                        {loading ? 'Sending…' : 'Send Message'}
                      </Button>

                      <p className="contact-mono" style={{ fontSize: '0.65rem', textAlign: 'center', color: 'rgb(var(--text-secondary))', marginTop: '0.5rem' }}>
                        📧 You'll receive a confirmation email once your message is sent
                      </p>
                    </form>
                  )}
                </GlassCard>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ─── Reusable contact info row ──────────────────────────────────────────── */
function ContactRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
      <div style={{
        padding: '0.55rem',
        borderRadius: '0.5rem',
        background: 'rgba(var(--accent), 0.08)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'DM Mono, monospace', fontWeight: 400,
          fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgb(var(--text-secondary))', marginBottom: '0.25rem',
        }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}