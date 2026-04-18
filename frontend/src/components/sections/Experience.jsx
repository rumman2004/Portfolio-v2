import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase } from 'lucide-react';
import { experienceAPI } from '../../services/api';
import { NeuCard } from '../ui';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading]         = useState(true);
  const sectionRef                    = useRef(null);
  const lineRef                       = useRef(null);
  const headingRef                    = useRef(null);
  const tagRef                        = useRef(null);
  const cardRefs                      = useRef([]);
  const dotRefs                       = useRef([]);
  const { theme }                     = useTheme();
  const isDark                        = theme === 'dark';

  useEffect(() => {
    experienceAPI.getAll()
      .then(res => setExperiences(res.data.data))
      .catch(err => console.error('Failed to fetch experience', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !experiences.length) return;

    const ctx = gsap.context(() => {

      /* ── Tag badge ── */
      gsap.fromTo(tagRef.current,
        { y: 20, opacity: 0, scale: 0.88 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: tagRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
        }
      );

      /* ── Heading ── */
      gsap.fromTo(headingRef.current,
        { y: 56, opacity: 0, skewY: 2 },
        {
          y: 0, opacity: 1, skewY: 0,
          duration: 1.1, ease: 'expo.out', delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 86%', toggleActions: 'play none none reverse' },
        }
      );

      /* ── Timeline line draw ── */
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1.2,
            },
          }
        );
      }

      /* ── Cards + dots staggered on scroll ── */
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const isEven = i % 2 === 0;

        gsap.fromTo(card,
          { x: isEven ? -60 : 60, opacity: 0, scale: 0.96 },
          {
            x: 0, opacity: 1, scale: 1,
            duration: 0.9, ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.5, ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    }, sectionRef.current);

    return () => ctx.revert();
  }, [loading, experiences]);

  if (loading || experiences.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
        .exp-section { font-family: 'Syne', sans-serif; }
        .exp-heading { font-family: 'Syne', sans-serif; font-weight: 800; }
        .exp-mono    { font-family: 'DM Mono', monospace; font-weight: 300; }
        .exp-tag     { font-family: 'DM Mono', monospace; font-weight: 400; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; }

        .exp-dot-pulse::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgb(var(--accent));
          opacity: 0;
          animation: exp-ping 2.2s ease-out infinite;
        }
        @keyframes exp-ping {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <section ref={sectionRef} className="exp-section py-24 relative overflow-hidden">

        {/* Grid background */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.035) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">

          {/* ── Header ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>

            {/* Tag */}
            <div ref={tagRef} style={{ marginBottom: '1.5rem' }}>
              <span
                className="exp-tag"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '9999px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  color: `rgb(var(--accent))`,
                }}
              >
                <Briefcase size={13} strokeWidth={1.5} />
                Professional Journey
              </span>
            </div>

            {/* Heading */}
            <h2
              ref={headingRef}
              className="exp-heading"
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                color: `rgb(var(--text-primary))`,
              }}
            >
              My{' '}
              <em style={{ color: `rgb(var(--accent))`, fontStyle: 'italic' }}>
                Experience
              </em>
            </h2>
          </div>

          {/* ── Timeline ── */}
          <div style={{ position: 'relative', maxWidth: '72rem', margin: '0 auto' }}>

            {/* Animated centre line (desktop only) */}
            <div
              ref={lineRef}
              className="hidden md:block"
              style={{
                position: 'absolute',
                left: '50%',
                top: 0, bottom: 0,
                width: '1px',
                transform: 'translateX(-50%)',
                background: `linear-gradient(to bottom, rgb(var(--accent)), rgba(var(--accent),0.15) 80%, transparent)`,
                boxShadow: `0 0 10px rgba(var(--accent),0.25)`,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={exp._id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                    className="md:flex-row"
                  >
                    {/* Card side */}
                    <div
                      ref={el => cardRefs.current[index] = el}
                      style={{ width: '100%' }}
                      className={`md:w-[45%] ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12 md:order-1'}`}
                    >
                      <NeuCard exp={exp} isDark={isDark} index={index} />
                    </div>

                    {/* Centre dot — desktop */}
                    <div
                      ref={el => dotRefs.current[index] = el}
                      className="hidden md:flex exp-dot-pulse"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '2rem',
                        transform: 'translateX(-50%)',
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '50%',
                        background: `rgb(var(--accent))`,
                        border: `3px solid rgb(var(--bg-primary))`,
                        boxShadow: `0 0 18px rgba(var(--accent),0.45)`,
                        zIndex: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{
                        width: '0.55rem', height: '0.55rem',
                        borderRadius: '50%',
                        background: 'white',
                      }} />
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block" style={{ width: '45%' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}