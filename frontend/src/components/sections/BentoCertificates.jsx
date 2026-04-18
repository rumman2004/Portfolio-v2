import { useEffect, useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink, Calendar, CheckCircle, ChevronRight, ChevronLeft, Shield, Hash } from 'lucide-react';
import { certificatesAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

/* ─── Tilt card using GSAP quickTo ──────────────────────────────────────── */
const TiltCard = ({ cert, isDark }) => {
  const cardRef  = useRef(null);
  const qRotateX = useRef(null);
  const qRotateY = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    qRotateX.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.45, ease: 'power2.out' });
    qRotateY.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.45, ease: 'power2.out' });
    gsap.set(cardRef.current, { transformStyle: 'preserve-3d', transformPerspective: 900 });
  }, []);

  const onMouseMove = (e) => {
    const r  = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;   // -0.5 → 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    qRotateY.current?.(nx *  10);
    qRotateX.current?.(ny * -10);
  };
  const onMouseLeave = () => {
    qRotateX.current?.(0);
    qRotateY.current?.(0);
  };

  return (
    <div
      ref={cardRef}
      className="w-full"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ willChange: 'transform' }}
    >
      <GlassCard className={`w-full flex flex-col overflow-hidden border shadow-2xl rounded-2xl ${
        isDark
          ? 'bg-white/[0.07] border-white/15 backdrop-blur-2xl'
          : 'bg-white border-slate-200/80 backdrop-blur-md shadow-slate-200/60'
      }`}>

        {/* ── Image ── */}
        <div className={`relative h-52 sm:h-60 md:h-72 w-full overflow-hidden group ${
          isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-slate-100'
        }`}>
          {cert.image?.url ? (
            <>
              <img
                src={cert.image.url}
                alt={cert.title || cert.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award className={`w-20 h-20 sm:w-24 sm:h-24 opacity-15 ${isDark ? 'text-white' : 'text-slate-400'}`} />
            </div>
          )}

          <div className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none ${
            isDark ? 'bg-gradient-to-t from-[rgb(var(--bg-card))] to-transparent' : 'bg-gradient-to-t from-white to-transparent'
          }`} />

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-xl">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="cert-mono text-xs sm:text-sm">{formatDate(cert.issueDate || cert.date || cert.createdAt)}</span>
          </div>

          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 rounded-xl bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-400 flex items-center gap-1.5 shadow-xl">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="cert-mono text-xs sm:text-sm font-semibold">Verified</span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 p-5 sm:p-6 lg:p-8 flex flex-col gap-4 ${isDark ? '' : 'bg-white'}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className={`cert-heading text-lg sm:text-xl md:text-2xl leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {cert.title || cert.name}
            </h3>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))] hover:text-white border border-[rgb(var(--accent))]/20 transition-all duration-200 hover:scale-110"
                title="View Certificate"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[rgb(var(--accent))]/10 flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--accent))]" />
            </div>
            <div className="min-w-0">
              <p className="cert-mono text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wide">Issued by</p>
              <p className="cert-heading text-sm sm:text-base text-[rgb(var(--accent))] truncate font-bold">{cert.issuer || 'Verified Organization'}</p>
            </div>
          </div>

          {cert.description && (
            <p className={`cert-mono text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 pt-3 border-t text-[rgb(var(--text-secondary))] ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}>
              {cert.description}
            </p>
          )}

          <div className={`grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <MetaBox icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))]" />} label="Issued"   value={formatDate(cert.issueDate || cert.date || cert.createdAt)} isDark={isDark} />
            {cert.expiryDate
              ? <MetaBox icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />}               label="Expires"  value={formatDate(cert.expiryDate)} isDark={isDark} />
              : <MetaBox icon={<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}             label="Valid"    value="Lifetime" isDark={isDark} />
            }
            {cert.credentialId && (
              <MetaBox icon={<Hash className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(var(--accent))]" />} label="Credential ID" value={cert.credentialId} mono full isDark={isDark} />
            )}
          </div>

          <div className={`mt-auto pt-3 sm:pt-4 flex items-center justify-between border-t-2 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="cert-mono text-xs sm:text-sm font-bold text-green-500">Verified</span>
            </div>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                className="cert-mono text-xs text-[rgb(var(--accent))] hover:underline flex items-center gap-1">
                <span className="hidden sm:inline">View Online</span>
                <span className="sm:hidden">View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const MetaBox = ({ icon, label, value, mono, full, isDark }) => (
  <div className={`p-2.5 sm:p-3 rounded-xl border ${full ? 'col-span-2' : ''} ${
    isDark ? 'bg-white/[0.05] border-white/10' : 'bg-slate-50 border-slate-200/80'
  }`}>
    <div className="flex items-center gap-1.5 mb-1">{icon}
      <span className="cert-mono text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wide">{label}</span>
    </div>
    <p className={`cert-mono text-xs sm:text-sm font-bold ${mono ? 'break-all' : 'truncate'} ${isDark ? 'text-white' : 'text-slate-800'}`}>
      {value}
    </p>
  </div>
);

/* ─── Carousel shell ─────────────────────────────────────────────────────── */
export default function BentoCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeIndex, setActiveIndex]   = useState(0);
  const [direction, setDirection]       = useState(0);
  const timerRef                        = useRef(null);
  const sectionRef                      = useRef(null);
  const headerRef                       = useRef(null);
  const tagRef                          = useRef(null);
  const stageRef                        = useRef(null);
  const { theme }                       = useTheme();
  const isDark                          = theme === 'dark';

  useEffect(() => {
    certificatesAPI.getAll()
      .then(res => setCertificates(res.data.data))
      .catch(e  => console.error('Failed to fetch certificates', e))
      .finally(() => setLoading(false));
  }, []);

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

      gsap.fromTo(stageRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.2,
          scrollTrigger: { trigger: stageRef.current, start: 'top 84%', toggleActions: 'play none none reverse' } }
      );

    }, sectionRef.current);
    return () => ctx.revert();
  }, [loading, certificates]);

  /* ── Card slide animation via GSAP ── */
  const slideCard = useCallback((incoming, outgoing, dir) => {
    if (!incoming || !outgoing) return;
    const xIn  = dir > 0 ?  '100%' : '-100%';
    const xOut = dir > 0 ? '-100%' :  '100%';

    gsap.set(incoming, { x: xIn, rotateY: dir > 0 ? 52 : -52, scale: 0.78, opacity: 0, zIndex: 2 });
    gsap.set(outgoing, { zIndex: 1 });

    gsap.to(outgoing, {
      x: xOut, rotateY: dir > 0 ? -52 : 52, scale: 0.78, opacity: 0,
      duration: 0.55, ease: 'power2.in',
    });
    gsap.to(incoming, {
      x: 0, rotateY: 0, scale: 1, opacity: 1,
      duration: 0.72, ease: 'expo.out', delay: 0.05,
    });
  }, []);

  const cardEls  = useRef({});
  const prevIdx  = useRef(activeIndex);

  useEffect(() => {
    const incoming = cardEls.current[activeIndex];
    const outgoing = cardEls.current[prevIdx.current];
    if (prevIdx.current !== activeIndex) {
      slideCard(incoming, outgoing, direction);
    }
    prevIdx.current = activeIndex;
  }, [activeIndex, direction, slideCard]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex(p => (p + 1) % certificates.length);
  }, [certificates.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex(p => (p - 1 + certificates.length) % certificates.length);
  }, [certificates.length]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (certificates.length > 1) timerRef.current = setInterval(goNext, 6500);
  }, [goNext, certificates.length]);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const handlePrev = () => { goPrev(); resetTimer(); };
  const handleNext = () => { goNext(); resetTimer(); };
  const handleDot  = (i) => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); resetTimer(); };

  if (loading || certificates.length === 0) return null;

  const navBtnClass = isDark
    ? 'bg-white/10 hover:bg-white/25 border-white/20 text-white'
    : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800';

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

            <div ref={tagRef} style={{ marginBottom: '1.5rem' }}>
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
        <div ref={stageRef} className="relative w-full px-4 sm:px-6">
          <div style={{ perspective: '1300px', perspectiveOrigin: '50% 50%', position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', minHeight: '20px', transformStyle: 'preserve-3d' }}>

              {/* Render all cards; show/hide via GSAP */}
              {certificates.map((cert, i) => (
                <div
                  key={cert._id || i}
                  ref={el => cardEls.current[i] = el}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    width: '100%', maxWidth: '42rem',
                    opacity: i === activeIndex ? 1 : 0,
                    pointerEvents: i === activeIndex ? 'auto' : 'none',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                >
                  <TiltCard cert={cert} isDark={isDark} />
                </div>
              ))}
            </div>
          </div>

          {/* Nav buttons */}
          <button onClick={handlePrev} aria-label="Previous certificate"
            className={`absolute left-0 sm:left-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${navBtnClass}`}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={handleNext} aria-label="Next certificate"
            className={`absolute right-0 sm:right-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${navBtnClass}`}>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots */}
          {certificates.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {certificates.map((_, i) => (
                <button key={i} onClick={() => handleDot(i)} aria-label={`Go to certificate ${i + 1}`}
                  style={{
                    height: '6px', borderRadius: '9999px',
                    width: i === activeIndex ? '2rem' : '0.5rem',
                    background: i === activeIndex
                      ? `rgb(var(--accent))`
                      : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}