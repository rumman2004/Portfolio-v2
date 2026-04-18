import { useEffect, useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, ExternalLink, Github, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

/* ─── Tilt card via GSAP quickTo ────────────────────────────────────────── */
const ProjectCard = ({ project, isDark }) => {
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
    const nx = (e.clientX - r.left) / r.width  - 0.5;
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
          {project.image?.url ? (
            <>
              <img
                src={project.image.url}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Briefcase className="w-16 h-16 opacity-10" />
            </div>
          )}

          <div className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none ${
            isDark ? 'bg-gradient-to-t from-[rgb(var(--bg-card))] to-transparent' : 'bg-gradient-to-t from-white to-transparent'
          }`} />

          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1.5 shadow-xl proj-mono">
            <Layers className="w-3 h-3" />
            {project.category}
          </div>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 p-5 sm:p-6 lg:p-8 flex flex-col gap-4 ${isDark ? '' : 'bg-white'}`}>
          <h3 className={`proj-heading text-lg sm:text-xl md:text-2xl leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {project.title}
          </h3>

          <p className="proj-mono text-xs sm:text-sm text-[rgb(var(--text-secondary))] leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>

          <div className="mt-auto space-y-4">
            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5">
              {project.technologies?.slice(0, 5).map((tech, i) => (
                <span
                  key={i}
                  className={`proj-mono px-2.5 py-1 rounded-md text-[10px] sm:text-xs border ${
                    isDark
                      ? 'bg-white/[0.06] border-white/10 text-white/75'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                  className={`proj-mono flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/12 border-white/10 text-white/80'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <Github className="w-4 h-4" />
                  Source
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                  className="proj-mono flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/35 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/30 text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function BentoProjects() {
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState(0);
  const timerRef                      = useRef(null);
  const sectionRef                    = useRef(null);
  const tagRef                        = useRef(null);
  const headingRef                    = useRef(null);
  const stageRef                      = useRef(null);
  const cardEls                       = useRef({});
  const prevIdx                       = useRef(0);
  const { theme }                     = useTheme();
  const isDark                        = theme === 'dark';

  useEffect(() => {
    projectsAPI.getAll()
      .then(res => {
        const all      = res.data.data;
        const featured = all.filter(p => p.featured);
        setProjects(featured.length > 0 ? featured : all);
      })
      .catch(e => console.error('Failed to fetch projects', e))
      .finally(() => setLoading(false));
  }, []);

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (loading || !projects.length) return;
    const ctx = gsap.context(() => {

      gsap.fromTo(tagRef.current,
        { y: 24, opacity: 0, scale: 0.88 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: tagRef.current, start: 'top 88%', toggleActions: 'play none none reverse' } }
      );

      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0, skewY: 2.5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.15, ease: 'expo.out', delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 86%', toggleActions: 'play none none reverse' } }
      );

      gsap.fromTo(stageRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.2,
          scrollTrigger: { trigger: stageRef.current, start: 'top 84%', toggleActions: 'play none none reverse' } }
      );

    }, sectionRef.current);
    return () => ctx.revert();
  }, [loading, projects]);

  /* ── Card slide ── */
  const slideCard = useCallback((incoming, outgoing, dir) => {
    if (!incoming || !outgoing) return;
    gsap.set(incoming, { x: dir > 0 ? '100%' : '-100%', rotateY: dir > 0 ? 52 : -52, scale: 0.78, opacity: 0, zIndex: 2 });
    gsap.set(outgoing, { zIndex: 1 });
    gsap.to(outgoing,  { x: dir > 0 ? '-100%' : '100%', rotateY: dir > 0 ? -52 : 52, scale: 0.78, opacity: 0, duration: 0.55, ease: 'power2.in' });
    gsap.to(incoming,  { x: 0, rotateY: 0, scale: 1, opacity: 1, duration: 0.72, ease: 'expo.out', delay: 0.05 });
  }, []);

  useEffect(() => {
    const incoming = cardEls.current[activeIndex];
    const outgoing = cardEls.current[prevIdx.current];
    if (prevIdx.current !== activeIndex) slideCard(incoming, outgoing, direction);
    prevIdx.current = activeIndex;
  }, [activeIndex, direction, slideCard]);

  const goNext = useCallback(() => { setDirection(1);  setActiveIndex(p => (p + 1) % projects.length); }, [projects.length]);
  const goPrev = useCallback(() => { setDirection(-1); setActiveIndex(p => (p - 1 + projects.length) % projects.length); }, [projects.length]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (projects.length > 1) timerRef.current = setInterval(goNext, 6500);
  }, [goNext, projects.length]);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const handlePrev = () => { goPrev(); resetTimer(); };
  const handleNext = () => { goNext(); resetTimer(); };
  const handleDot  = (i) => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); resetTimer(); };

  if (loading || projects.length === 0) return null;

  const navBtnClass = isDark
    ? 'bg-white/10 hover:bg-white/25 border-white/20 text-white'
    : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
        .proj-heading { font-family: 'Syne', sans-serif; font-weight: 700; }
        .proj-mono    { font-family: 'DM Mono', monospace; font-weight: 300; }
        .proj-tag     { font-family: 'DM Mono', monospace; font-weight: 400; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; }
      `}</style>

      <section ref={sectionRef} id="work" className="py-12 md:py-24 relative overflow-hidden">

        {/* ── Header ── */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-14 relative z-10">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

            <div ref={tagRef} style={{ marginBottom: '1.5rem' }}>
              <span className="proj-tag" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.5rem 1.2rem', borderRadius: '9999px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: `rgb(var(--accent))`,
              }}>
                <Briefcase size={13} strokeWidth={1.5} />
                Featured Work
              </span>
            </div>

            <h2 ref={headingRef} className="proj-heading" style={{
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              lineHeight: 0.92, letterSpacing: '-0.035em',
              color: `rgb(var(--text-primary))`,
            }}>
              Completed{' '}
              <em style={{ color: `rgb(var(--accent))`, fontStyle: 'italic' }}>Projects</em>
            </h2>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div ref={stageRef} className="relative w-full px-4 sm:px-6">
          <div style={{ perspective: '1300px', perspectiveOrigin: '50% 50%', position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', minHeight: '20px', transformStyle: 'preserve-3d' }}>
              {projects.map((project, i) => (
                <div
                  key={project._id || i}
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
                  <ProjectCard project={project} isDark={isDark} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={handlePrev} aria-label="Previous project"
            className={`absolute left-0 sm:left-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${navBtnClass}`}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={handleNext} aria-label="Next project"
            className={`absolute right-0 sm:right-2 top-[42%] -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full backdrop-blur-md border shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${navBtnClass}`}>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {projects.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {projects.map((_, i) => (
                <button key={i} onClick={() => handleDot(i)} aria-label={`Go to project ${i + 1}`}
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