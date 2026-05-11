import { useEffect, useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, ExternalLink, Github, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { projectsAPI } from '../../services/api';
import { GlassCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function BentoProjects() {
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [projectIndex, setProjectIndex] = useState(0);
  const [isHovered, setIsHovered]       = useState(false);
  const [touchStart, setTouchStart]     = useState(null);
  const [touchEnd, setTouchEnd]         = useState(null);

  const sectionRef                    = useRef(null);
  const tagRef                        = useRef(null);
  const headingRef                    = useRef(null);
  const stageRef                      = useRef(null);

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

  /* ── Auto-advance ── */
  useEffect(() => {
      if (!projects.length || isHovered) return;
      const t = setInterval(() => setProjectIndex(p => (p + 1) % projects.length), 6500);
      return () => clearInterval(t);
  }, [projectIndex, projects.length, isHovered]);

  /* ── Helpers ── */
  const handleNext = useCallback(() => setProjectIndex(p => (p + 1) % projects.length), [projects.length]);
  const handlePrev = useCallback(() => setProjectIndex(p => (p - 1 + projects.length) % projects.length), [projects.length]);

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove  = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd   = () => {
      if (!touchStart || !touchEnd) return;
      const d = touchStart - touchEnd;
      if (d > 50) handleNext(); else if (d < -50) handlePrev();
  };

  const getCardStyle = (index) => {
      const len = projects.length;
      if (!len) return 'hidden';
      let offset = (index - projectIndex + len) % len;
      if (offset > len / 2) offset -= len;
      if (offset === 0) return 'center';
      if (offset === -1 || (len === 2 && offset === 1)) return 'left';
      if (offset === 1) return 'right';
      return offset < 0 ? 'hiddenLeft' : 'hiddenRight';
  };

  const projectPositions = {
      center:      { x: '0%',    scale: 1,    opacity: 1,   zIndex: 30, rotateY: 0,   filter: 'blur(0px)' },
      left:        { x: '-85%',  scale: 0.75, opacity: 0.6, zIndex: 20, rotateY: 25,  filter: 'blur(1px)' },
      right:       { x: '85%',   scale: 0.75, opacity: 0.6, zIndex: 20, rotateY: -25, filter: 'blur(1px)' },
      hiddenLeft:  { x: '-120%', scale: 0.4,  opacity: 0,   zIndex: 10, rotateY: 35,  filter: 'blur(4px)' },
      hiddenRight: { x: '120%',  scale: 0.4,  opacity: 0,   zIndex: 10, rotateY: -35, filter: 'blur(4px)' },
  };

  if (loading || projects.length === 0) return null;

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

            <div ref={tagRef} style={{ marginBottom: '1.5rem', opacity: 0 }}>
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
              opacity: 0,
            }}>
              Completed{' '}
              <em style={{ color: `rgb(var(--accent))`, fontStyle: 'italic' }}>Projects</em>
            </h2>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div
            ref={stageRef}
            style={{ opacity: 0 }}
            className="relative w-full max-w-[1200px] mx-auto h-[500px] sm:h-[580px] lg:h-[650px] flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Nav buttons */}
            {[
                { dir: 'prev', Icon: ChevronLeft, handler: handlePrev, pos: 'left-2 sm:left-6 lg:left-10' },
                { dir: 'next', Icon: ChevronRight, handler: handleNext, pos: 'right-2 sm:right-6 lg:right-10' },
            ].map(({ dir, Icon, handler, pos }) => (
                <button
                    key={dir}
                    onClick={handler}
                    aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} project`}
                    className={`absolute ${pos} z-30 p-2 sm:p-3 rounded-full bg-[rgb(var(--bg-card))]/90 backdrop-blur-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))] hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center group`}
                >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${dir === 'prev' ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                </button>
            ))}

            <div
                className="relative w-full h-full flex items-center justify-center"
                style={{ perspective: '2000px', perspectiveOrigin: 'center' }}
            >
                {projects.map((project, index) => {
                    const position = getCardStyle(index);
                    const v = projectPositions[position] || projectPositions.hiddenRight;
                    return (
                        <div
                            key={project._id || index}
                            className="absolute w-[85vw] max-w-[320px] sm:w-[75vw] sm:max-w-[450px] lg:max-w-[550px]"
                            style={{
                                transform: `translateX(${v.x}) scale(${v.scale}) rotateY(${v.rotateY}deg)`,
                                opacity: v.opacity,
                                zIndex: v.zIndex,
                                filter: v.filter,
                                transition: 'transform 0.7s cubic-bezier(0.645,0.045,0.355,1), opacity 0.7s ease, filter 0.7s ease',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <GlassCard className={`h-[450px] sm:h-[520px] lg:h-[580px] w-full flex flex-col overflow-hidden shadow-2xl border transition-all duration-300 transform-gpu p-0 ${
                                isDark
                                  ? 'bg-white/[0.07] border-white/15 hover:border-[rgb(var(--accent))]/50'
                                  : 'bg-white border-slate-200/80 hover:border-[rgb(var(--accent))]/50 shadow-slate-200/60'
                              }`}>
                                
                                {/* ── Image ── */}
                                <div className={`relative w-full aspect-video overflow-hidden group flex-shrink-0 ${
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

                                    <div className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none opacity-50 ${
                                        isDark ? 'bg-gradient-to-t from-[rgb(var(--bg-card))] to-transparent' : 'bg-gradient-to-t from-white to-transparent'
                                    }`} />

                                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1.5 shadow-xl proj-mono">
                                        <Layers className="w-3 h-3" />
                                        {project.category}
                                    </div>
                                </div>

                                {/* ── Content ── */}
                                <div className={`flex-1 p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 ${isDark ? 'bg-[rgb(var(--bg-card))]/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'}`}>
                                    <h3 className={`proj-heading text-lg sm:text-xl lg:text-2xl leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {project.title}
                                    </h3>

                                    <p className="proj-mono text-xs sm:text-sm text-[rgb(var(--text-secondary))] leading-relaxed line-clamp-2 sm:line-clamp-3">
                                        {project.shortDescription}
                                    </p>

                                    <div className="mt-auto space-y-2.5 sm:space-y-3">
                                        {/* Tech chips */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.technologies?.slice(0, 5).map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className={`proj-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] lg:text-xs border ${
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
                                        <div className={`flex gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                    className={`proj-mono flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl border text-[10px] sm:text-xs lg:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                                                        isDark
                                                            ? 'bg-white/5 hover:bg-white/12 border-white/10 text-white/80'
                                                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                                    }`}>
                                                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    Source
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                                                    className="proj-mono flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl bg-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/35 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/30 text-[10px] sm:text-xs lg:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95">
                                                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    );
                })}
            </div>

            {/* Dots */}
            {projects.length > 1 && (
                <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                    {projects.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setProjectIndex(idx)}
                            aria-label={`Go to project ${idx + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === projectIndex ? 'w-8 bg-[rgb(var(--accent))]' : 'w-2 bg-[rgb(var(--border))] hover:bg-[rgb(var(--text-secondary))]/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
      </section>
    </>
  );
}