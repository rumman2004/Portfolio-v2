import { useEffect, useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink, Calendar, ChevronRight, ChevronLeft, CheckCircle, Shield, Hash } from 'lucide-react';
import { certificatesAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function BentoCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [certIndex, setCertIndex]       = useState(0);
  const [isHovered, setIsHovered]       = useState(false);
  const [touchStart, setTouchStart]     = useState(null);
  const [touchEnd, setTouchEnd]         = useState(null);
  
  const sectionRef                      = useRef(null);
  const headerRef                       = useRef(null);
  const tagRef                          = useRef(null);
  const certAreaRef                     = useRef(null);
  
  const { theme }                       = useTheme();
  const isDark                          = theme === 'dark';

  useEffect(() => {
    certificatesAPI.getAll()
      .then(res => setCertificates(res.data.data))
      .catch(e  => console.error('Failed to fetch certificates', e))
      .finally(() => setLoading(false));
  }, []);

  /* ── Cert auto-advance ── */
  useEffect(() => {
      if (!certificates.length || isHovered) return;
      const t = setInterval(() => setCertIndex(p => (p + 1) % certificates.length), 5000);
      return () => clearInterval(t);
  }, [certIndex, certificates.length, isHovered]);

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (loading || !certificates.length) return;
    const ctx = gsap.context(() => {

      gsap.fromTo(tagRef.current,
        { y: 24, opacity: 0, scale: 0.88 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: tagRef.current, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );

      gsap.fromTo(headerRef.current,
        { y: 60, opacity: 0, skewY: 2.5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.15, ease: 'expo.out', delay: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: 'top 86%', toggleActions: 'play none none reverse' } }
      );

      gsap.fromTo(certAreaRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.2,
          scrollTrigger: { trigger: certAreaRef.current, start: 'top 84%', toggleActions: 'play none none reverse' } }
      );

    }, sectionRef.current);
    return () => ctx.revert();
  }, [loading, certificates]);

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
      center:      { x: '0%',    scale: 1,    opacity: 1,   zIndex: 30, rotateY: 0,   filter: 'blur(0px)' },
      left:        { x: '-85%',  scale: 0.75, opacity: 0.6, zIndex: 20, rotateY: 25,  filter: 'blur(1px)' },
      right:       { x: '85%',   scale: 0.75, opacity: 0.6, zIndex: 20, rotateY: -25, filter: 'blur(1px)' },
      hiddenLeft:  { x: '-120%', scale: 0.4,  opacity: 0,   zIndex: 10, rotateY: 35,  filter: 'blur(4px)' },
      hiddenRight: { x: '120%',  scale: 0.4,  opacity: 0,   zIndex: 10, rotateY: -35, filter: 'blur(4px)' },
  };

  if (loading || certificates.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
        .cert-heading { font-family: 'Syne', sans-serif; font-weight: 700; }
        .cert-mono    { font-family: 'DM Mono', monospace; font-weight: 300; }
        .cert-tag     { font-family: 'DM Mono', monospace; font-weight: 400; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; }
      `}</style>

      <section ref={sectionRef} className="py-24 relative overflow-hidden">

        {/* ── Header ── */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-14 relative z-10">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

            <div ref={tagRef} style={{ marginBottom: '1.5rem', opacity: 0 }}>
              <span className="cert-tag" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.5rem 1.2rem', borderRadius: '9999px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: `rgb(var(--accent))`,
              }}>
                <Award size={13} strokeWidth={1.5} />
                Professional Achievements
              </span>
            </div>

            <h2 ref={headerRef} className="cert-heading" style={{
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              lineHeight: 0.92, letterSpacing: '-0.035em',
              color: `rgb(var(--text-primary))`,
              marginBottom: '1.25rem',
              opacity: 0,
            }}>
              Certified{' '}
              <em style={{ color: `rgb(var(--accent))`, fontStyle: 'italic' }}>Expertise</em>
            </h2>

            <p className="cert-mono" style={{
              fontSize: 'clamp(0.78rem, 1vw, 0.9rem)', lineHeight: 1.85,
              color: `rgb(var(--text-secondary))`, maxWidth: '50ch',
            }}>
              Validated credentials and industry-recognized certifications showcasing continuous learning and professional excellence.
            </p>
          </div>
        </div>

        {/* ── Carousel ── */}
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
                                    {cert.image?.url ? (
                                        <img src={cert.image.url} alt={cert.title || cert.name} className="w-full h-full object-contain drop-shadow-lg" loading="lazy" />
                                    ) : (
                                        <Award className={`w-20 h-20 sm:w-24 sm:h-24 opacity-15 ${isDark ? 'text-white' : 'text-slate-400'}`} />
                                    )}

                                    {/* Floating Badges */}
                                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-xl">
                                        <Calendar className="w-3 h-3" />
                                        <span className="cert-mono text-[10px] sm:text-xs">{formatDate(cert.issueDate || cert.date || cert.createdAt)}</span>
                                    </div>
                                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-400 flex items-center gap-1.5 shadow-xl">
                                        <CheckCircle className="w-3 h-3" />
                                        <span className="cert-mono text-[10px] sm:text-xs font-semibold">Verified</span>
                                    </div>
                                </div>
                                
                                <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between bg-[rgb(var(--bg-card))]/80 backdrop-blur-md">
                                    <div>
                                        <h3 className="cert-heading text-base sm:text-lg lg:text-xl leading-tight line-clamp-1 mb-2 text-[rgb(var(--text-primary))]" style={{ letterSpacing: '-0.02em' }}>
                                            {cert.title || cert.name}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 rounded-lg bg-[rgb(var(--accent))]/10 flex-shrink-0">
                                                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="cert-mono text-[9px] sm:text-[10px] text-[rgb(var(--text-secondary))] uppercase tracking-wide leading-none mb-0.5">Issued by</p>
                                                <p className="cert-heading text-xs sm:text-sm text-[rgb(var(--accent))] truncate font-bold leading-none">{cert.issuer || 'Verified Organization'}</p>
                                            </div>
                                        </div>
                                        
                                        {cert.description && (
                                            <p className="cert-mono line-clamp-2" style={{ fontWeight: 300, fontSize: '0.65rem', sm: '0.72rem', lineHeight: 1.6, color: 'rgb(var(--text-secondary))' }}>{cert.description}</p>
                                        )}
                                    </div>
                                    <div className="pt-3 mt-2 flex items-center justify-between border-t border-[rgb(var(--border))]">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            <span className="cert-mono font-bold text-green-500" style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>
                                                Verified
                                            </span>
                                        </div>
                                        {cert.credentialUrl && (
                                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                                                className="cert-mono flex items-center gap-1 hover:text-[rgb(var(--accent))] transition-colors"
                                                style={{ fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgb(var(--text-primary))' }}
                                            >
                                                View <ExternalLink className="w-2.5 h-2.5" />
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
            {certificates.length > 1 && (
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
            )}
        </div>
      </section>
    </>
  );
}

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};