import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillCard from './SkillCard';
import { useTheme } from '../../context/ThemeContext';
import { skillsAPI } from '../../services/api';

gsap.registerPlugin(ScrollTrigger);

/* ─── Per-row infinite GSAP marquee ─────────────────────────────────────── */
function MarqueeRow({ skills, direction = 1, speed = 38, fadeClass = 'fade-dark' }) {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  // Duplicate 6x to guarantee a seamless loop at any viewport width
  const items = Array.from({ length: 6 }).flatMap(() => skills);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const raf = requestAnimationFrame(() => {
      const singleSetW = track.scrollWidth / 6;

      // Seed start position based on direction so both directions feel natural
      gsap.set(track, { x: direction === 1 ? 0 : -singleSetW });

      tweenRef.current = gsap.to(track, {
        x: direction === 1 ? -singleSetW : 0,
        duration: singleSetW / speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => {
            const val = parseFloat(x) % singleSetW;
            return direction === 1
              ? (val > 0 ? val - singleSetW : val)
              : (val < -singleSetW ? val + singleSetW : val);
          }),
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      tweenRef.current?.kill();
    };
  }, [direction, speed]);

  const pause  = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.resume();

  return (
    <div
      className={`marquee-overflow ${fadeClass}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          width: 'max-content',
          padding: '0.5rem 0',
          willChange: 'transform',
        }}
      >
        {items.map((skill, i) => (
          <SkillCard key={`${skill._id}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function Skills() {
  const [skillGroups, setSkillGroups] = useState([]);
  const [loading, setLoading]         = useState(true);
  const sectionRef                    = useRef(null);
  const headingRef                    = useRef(null);
  const subRef                        = useRef(null);
  const groupRefs                     = useRef([]);
  const { theme }                     = useTheme();
  const isDark                        = theme === 'dark';

  /* ── fetch ── */
  useEffect(() => {
    skillsAPI.getGrouped()
      .then(res => setSkillGroups(res.data.data))
      .catch(err => console.error('Failed to load skills', err))
      .finally(() => setLoading(false));
  }, []);

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    if (loading || !skillGroups.length) return;

    const ctx = gsap.context(() => {

      // Heading: rise + deskew
      gsap.fromTo(headingRef.current,
        { y: 64, opacity: 0, skewY: 2.5 },
        {
          y: 0, opacity: 1, skewY: 0,
          duration: 1.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Sub text
      gsap.fromTo(subRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.18,
          scrollTrigger: {
            trigger: subRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Each group: label + ruled line
      groupRefs.current.forEach((el) => {
        if (!el) return;
        const label   = el.querySelector('.group-label');
        const divider = el.querySelector('.group-divider');

        gsap.fromTo(label,
          { x: -32, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.75,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(divider,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'expo.out',
            delay: 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    }, sectionRef.current);

    return () => ctx.revert();
  }, [loading, skillGroups]);

  if (loading) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        .skills-section { font-family: 'Syne', sans-serif; }

        .skills-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
        }

        .skills-mono { font-family: 'DM Mono', monospace; }

        .group-label-text {
          font-family: 'DM Mono', monospace;
          font-weight: 400;
          font-size: 0.63rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        /* Edge fade masks */
        .marquee-overflow { position: relative; }
        .marquee-overflow::before,
        .marquee-overflow::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: clamp(2.5rem, 5vw, 5rem);
          z-index: 10;
          pointer-events: none;
        }
        .fade-dark::before  { left:  0; background: linear-gradient(to right, rgb(var(--bg-primary)), transparent); }
        .fade-dark::after   { right: 0; background: linear-gradient(to left,  rgb(var(--bg-primary)), transparent); }
        .fade-light::before { left:  0; background: linear-gradient(to right, rgb(var(--bg-primary)), transparent); }
        .fade-light::after  { right: 0; background: linear-gradient(to left,  rgb(var(--bg-primary)), transparent); }
      `}</style>

      <section ref={sectionRef} className="skills-section py-24 relative overflow-hidden">

        {/* Subtle background grid */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: isDark
              ? 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
              : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">

          {/* ── Header ── */}
          <div className="mb-20">

            {/* Section tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span
                className="skills-mono"
                style={{
                  fontSize: '0.6rem', fontWeight: 300, fontStyle: 'italic',
                  letterSpacing: '0.12em',
                  color: `rgb(var(--accent))`,
                  opacity: 0.8,
                }}
              >
                02 /
              </span>
              <span
                className="group-label-text"
                style={{ color: `rgb(var(--text-secondary))` }}
              >
                Skills & Technologies
              </span>
            </div>

            <h2
              ref={headingRef}
              className="skills-heading"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.035em',
                color: `rgb(var(--text-primary))`,
                marginBottom: '1.75rem',
              }}
            >
              Technical{' '}
              <em style={{
                color: `rgb(var(--accent))`,
                fontStyle: 'italic',
                fontWeight: 800,
              }}>
                Arsenal
              </em>
            </h2>

            <p
              ref={subRef}
              className="skills-mono"
              style={{
                fontWeight: 300,
                fontSize: 'clamp(0.78rem, 1vw, 0.9rem)',
                lineHeight: 1.85,
                letterSpacing: '0.01em',
                color: `rgb(var(--text-secondary))`,
                maxWidth: '50ch',
              }}
            >
              A dynamic collection of tools and technologies I use to build
              seamless digital experiences.
            </p>
          </div>

          {/* ── Skill rows ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {skillGroups.map((group, index) => {
              const direction = index % 2 === 0 ? 1 : -1;
              const speed     = 30 + (index % 3) * 50; // 30 / 40 / 50 px/s alternating

              return (
                <div
                  key={group._id}
                  ref={el => groupRefs.current[index] = el}
                >
                  {/* Label row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {/* Index number */}
                    <span
                      className="skills-mono"
                      style={{
                        fontSize: '0.58rem',
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                        color: `rgb(var(--accent))`,
                        opacity: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Category name */}
                    <span
                      className="group-label group-label-text"
                      style={{
                        color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
                        flexShrink: 0,
                      }}
                    >
                      {group._id}
                    </span>

                    {/* Ruled divider */}
                    <div
                      className="group-divider"
                      style={{
                        flex: 1,
                        height: '1px',
                        background: isDark
                          ? 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
                          : 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)',
                      }}
                    />

                    {/* Direction arrow */}
                    <span
                      className="skills-mono"
                      style={{
                        fontSize: '0.55rem',
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                        opacity: 0.18,
                        color: `rgb(var(--text-primary))`,
                        flexShrink: 0,
                      }}
                    >
                      {direction === 1 ? '→' : '←'}
                    </span>
                  </div>

                  {/* Marquee */}
                  <MarqueeRow
                    skills={group.skills}
                    direction={direction}
                    speed={speed}
                    fadeClass={isDark ? 'fade-dark' : 'fade-light'}
                  />
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}