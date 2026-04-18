import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '../ui';
import { useFetch } from '../../hooks/useFetch';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../ui/Loader';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─────────────────────────────────────────────
   Fonts: Syne (display) + DM Mono (accent mono)
   — same pair used in Skills.jsx for coherence
───────────────────────────────────────────── */

const FULL_TITLE = 'Full Stack Developer | UI/UX & Frontend Developer';
const TYPE_SPEED         = 60;
const DELETE_SPEED       = 30;
const PAUSE_AFTER_TYPE   = 2200;
const PAUSE_AFTER_DELETE = 500;

/* ── Ticker line (horizontal marquee of the typed title) ─────────────────── */
function TickerLine({ isDark }) {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const LABEL    = `Full Stack Developer  ·  UI/UX Designer  ·  Frontend Engineer  ·  `;
  const items    = Array.from({ length: 8 }).map((_, i) => (
    <span
      key={i}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontWeight: 300,
        fontSize: '0.6rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)',
        flexShrink: 0,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        paddingRight: '2rem',
      }}
    >
      {LABEL}
    </span>
  ));

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const raf = requestAnimationFrame(() => {
      const singleW = track.scrollWidth / 8;
      gsap.set(track, { x: 0 });
      tweenRef.current = gsap.to(track, {
        x: -singleW,
        duration: singleW / 28,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => {
            const v = parseFloat(x) % singleW;
            return v > 0 ? v - singleW : v;
          }),
        },
      });
    });
    return () => { cancelAnimationFrame(raf); tweenRef.current?.kill(); };
  }, []);

  return (
    <div style={{ overflow: 'hidden', width: '100%', marginBottom: '3.5rem', paddingBlock: '0.5rem' }}>
      <div ref={trackRef} style={{ display: 'flex', width: 'max-content' }}>
        {items}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
const Hero = () => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const { data: aboutData, loading } = useFetch('/about');
  const [typedTitle, setTypedTitle]  = useState('');

  /* refs */
  const sectionRef  = useRef(null);
  const tagRef      = useRef(null);
  const nameRef     = useRef(null);
  const titleRef    = useRef(null);
  const bioRef      = useRef(null);
  const btnsRef     = useRef(null);
  const statsRef    = useRef(null);
  const scrollRef   = useRef(null);
  const rulerRef    = useRef(null);

  /* ── Typewriter ── */
  useEffect(() => {
    let timeout;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      if (!isDeleting) {
        charIndex += 1;
        setTypedTitle(FULL_TITLE.substring(0, charIndex));
        if (charIndex === FULL_TITLE.length) {
          isDeleting = true;
          timeout = setTimeout(tick, PAUSE_AFTER_TYPE);
        } else {
          timeout = setTimeout(tick, TYPE_SPEED);
        }
      } else {
        charIndex -= 1;
        setTypedTitle(FULL_TITLE.substring(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          timeout = setTimeout(tick, PAUSE_AFTER_DELETE);
        } else {
          timeout = setTimeout(tick, DELETE_SPEED);
        }
      }
    };

    timeout = setTimeout(tick, 800); // delay until GSAP entrance settles
    return () => clearTimeout(timeout);
  }, []);

  /* ── GSAP Entrance ── */
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {

      /* Master timeline — staggered reveal on mount */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      /* 1 · Status badge: slide in from left */
      tl.fromTo(tagRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.1
      );

      /* 2 · Ruled line under badge: scale from left */
      tl.fromTo(rulerRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.2 },
        0.25
      );

      /* 3 · Name: rise + deskew (mirrors Skills heading) */
      tl.fromTo(nameRef.current,
        { y: 80, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2 },
        0.35
      );

      /* 4 · Typing title container: fade up */
      tl.fromTo(titleRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 },
        0.65
      );

      /* 5 · Bio: fade up with slight delay */
      tl.fromTo(bioRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 },
        0.80
      );

      /* 6 · Buttons: staggered pop-up */
      tl.fromTo(
        btnsRef.current?.querySelectorAll('.hero-btn') ?? [],
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12 },
        0.95
      );

      /* 7 · Stats bar: rise */
      tl.fromTo(statsRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.1
      );

      /* 8 · Scroll indicator: fade in */
      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7 },
        1.4
      );

      /* Continuous scroll indicator bounce */
      gsap.to(scrollRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: 'sine.inOut',
        delay: 2,
      });

    }, sectionRef.current);

    return () => ctx.revert();
  }, [loading]);

  const scrollToWork = useCallback(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        .hero-section   { font-family: 'Syne', sans-serif; }
        .hero-heading   { font-family: 'Syne', sans-serif; font-weight: 800; }
        .hero-mono      { font-family: 'DM Mono', monospace; }

        /* ── Liquid Glass Button ── */
        .liquid-glass-btn {
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .liquid-glass-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
          pointer-events: none;
          z-index: 1;
        }
        .liquid-glass-btn:hover::before { transform: translateX(100%); }
        .liquid-glass-btn::after {
          content: '';
          position: absolute;
          width: 120%; height: 120%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          transition: transform 0.5s ease, opacity 0.5s ease;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        }
        .liquid-glass-btn:hover::after { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        .liquid-glass-btn:hover        { transform: translateY(-2px); }
        .liquid-glass-btn:active       { transform: translateY(0px) scale(0.97); }

        .liquid-glass-dark {
          background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.90);
          box-shadow: 0 4px 24px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
        .liquid-glass-dark:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%);
          border-color: rgba(255,255,255,0.30);
        }
        .liquid-glass-light {
          background: linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%);
          border: 1px solid rgba(255,255,255,0.75);
          color: #334155;
          box-shadow: 0 4px 24px rgba(100,116,139,0.15), 0 1px 0 rgba(255,255,255,0.8) inset;
        }
        .liquid-glass-light:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.50) 100%);
          border-color: rgba(255,255,255,0.90);
        }

        /* Download icon bob */
        .dl-icon {
          animation: iconBob 1.6s ease-in-out infinite;
        }
        @keyframes iconBob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(3px); }
        }

        /* Pulse dot */
        .pulse-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* Cursor blink */
        .cursor-blink {
          animation: cursorBlink 0.9s step-end infinite;
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* Mouse scroll indicator */
        .scroll-dot {
          animation: scrollDot 2s ease-in-out infinite;
        }
        @keyframes scrollDot {
          0%   { transform: translateY(0);  opacity: 1;   }
          80%  { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0);  opacity: 0;   }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="hero-section relative flex flex-col items-center justify-center py-12 md:py-20"
      >

        {/* Subtle background grid — mirrors Skills.jsx */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: isDark
              ? 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)'
              : 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">

            {/* ── Section tag row — same style as Skills "02 / Skills & Technologies" ── */}
            <div
              ref={tagRef}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                opacity: 0, /* GSAP will reveal */
              }}
            >
              <span
                className="hero-mono"
                style={{
                  fontSize: '0.6rem', fontWeight: 300, fontStyle: 'italic',
                  letterSpacing: '0.12em',
                  color: `rgb(var(--accent))`,
                  opacity: 0.8,
                }}
              >
                01 /
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 400,
                  fontSize: '0.6rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)',
                }}
              >
                Introduction
              </span>

              {/* Ruled line — same expanding line from Skills */}
              <div
                ref={rulerRef}
                style={{
                  width: '5rem',
                  height: '1px',
                  background: isDark
                    ? 'linear-gradient(to right, rgba(255,255,255,0.12), transparent)'
                    : 'linear-gradient(to right, rgba(0,0,0,0.10), transparent)',
                  transformOrigin: 'left center',
                  /* GSAP scaleX reveal */
                }}
              />

              {/* Status dot */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 400,
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isDark ? 'rgba(52,211,153,0.85)' : 'rgba(5,150,105,0.85)',
                }}
              >
                <span
                  className="pulse-dot"
                  style={{
                    display: 'inline-block',
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: isDark ? 'rgb(52,211,153)' : 'rgb(5,150,105)',
                  }}
                />
                Available
              </span>
            </div>

            {/* ── Ticker marquee (pre-name) ── */}
            <TickerLine isDark={isDark} />

            {/* ── Name heading — same size/weight/skew style as Skills heading ── */}
            <h1
              ref={nameRef}
              className="hero-heading"
              style={{
                fontSize: 'clamp(3rem, 10vw, 8rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                color: `rgb(var(--text-primary))`,
                marginBottom: '2rem',
                opacity: 0, /* GSAP reveal */
              }}
            >
              Rumman{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 800,
                  color: 'transparent',
                  WebkitTextStroke: isDark ? '2px rgba(255,255,255,0.9)' : '2px rgba(15,23,42,0.85)',
                  backgroundClip: 'unset',
                }}
              >
                Ahmed
              </em>
            </h1>

            {/* ── Typing title ── */}
            <div
              ref={titleRef}
              style={{
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.75rem',
                opacity: 0, /* GSAP reveal */
              }}
            >
              <h2
                className="hero-heading"
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 1.4rem)',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  color: `rgb(var(--text-secondary))`,
                  paddingInline: '1rem',
                }}
              >
                {typedTitle}
                <span
                  className="cursor-blink"
                  style={{ color: `rgb(var(--accent))`, fontWeight: 700 }}
                >
                  |
                </span>
              </h2>
            </div>

            {/* ── Bio ── */}
            <p
              ref={bioRef}
              className="hero-mono"
              style={{
                maxWidth: '52ch',
                margin: '0 auto 2.5rem',
                fontWeight: 300,
                fontSize: 'clamp(0.78rem, 1vw, 0.92rem)',
                lineHeight: 1.85,
                letterSpacing: '0.01em',
                color: `rgb(var(--text-secondary))`,
                paddingInline: '1rem',
                opacity: 0, /* GSAP reveal */
              }}
            >
              I design and develop high-quality digital solutions that balance
              performance, usability, and aesthetics. From responsive frontends
              to robust backend systems, I focus on delivering experiences that
              feel seamless and purposeful.
            </p>

            {/* ── Buttons ── */}
            <div
              ref={btnsRef}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 w-full px-8 sm:px-0"
            >
              <div className="hero-btn w-full sm:w-auto">
                <Button
                  size="lg"
                  icon={ArrowRight}
                  onClick={scrollToWork}
                  className="w-full sm:w-auto shadow-xl shadow-[rgb(var(--accent))]/20"
                >
                  View My Works
                </Button>
              </div>

              {aboutData?.resume?.url && (
                <div className="hero-btn w-full sm:w-auto">
                  <a
                    href={aboutData.resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button
                      className={`
                        liquid-glass-btn
                        ${isDark ? 'liquid-glass-dark' : 'liquid-glass-light'}
                        w-full sm:w-auto
                        flex items-center justify-center gap-2
                        px-6 py-4 sm:px-7 sm:py-3
                        text-xs sm:text-sm
                        rounded-xl font-medium
                        cursor-pointer
                      `}
                    >
                      <span className="dl-icon relative z-10 flex items-center">
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                      <span className="relative z-10">Download CV</span>
                    </button>
                  </a>
                </div>
              )}
            </div>

            {/* ── Stats Bar ── */}
            <div
              ref={statsRef}
              className={`
                inline-flex flex-wrap items-center justify-center
                gap-6 sm:gap-0 p-6 rounded-3xl backdrop-blur-xl border shadow-2xl mx-4
                ${isDark
                  ? 'bg-white/5 border-white/10 shadow-black/30'
                  : 'bg-white/40 border-white/60 shadow-slate-200/60'
                }
              `}
              style={{ opacity: 0 /* GSAP reveal */ }}
            >
              {[
                { value: aboutData?.stats?.yearsExperience,   label: 'Years Exp.' },
                { value: aboutData?.stats?.projectsCompleted, label: 'Projects'   },
                { value: aboutData?.stats?.happyClients,      label: 'Clients'    },
              ].map((stat, i) => (
                <div key={stat.label} className="contents">
                  {i > 0 && (
                    <div className={`
                      hidden sm:block h-12 w-px mx-8 flex-shrink-0
                      ${isDark ? 'bg-white/10' : 'bg-slate-300'}
                    `} />
                  )}
                  <div className="text-center min-w-[70px]">
                    <div
                      className="hero-heading"
                      style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: `rgb(var(--text-primary))`,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {stat.value || 0}+
                    </div>
                    <div
                      className="hero-mono"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 400,
                        fontSize: '0.6rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.38)',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Scroll Indicator ── */}
        <div
          ref={scrollRef}
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0, /* GSAP reveal */
          }}
        >
          <div
            style={{
              width: '22px',
              height: '36px',
              border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'}`,
              borderRadius: '999px',
              display: 'flex',
              justifyContent: 'center',
              padding: '5px 0',
            }}
          >
            <div
              className="scroll-dot"
              style={{
                width: '4px',
                height: '6px',
                borderRadius: '999px',
                background: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)',
              }}
            />
          </div>
        </div>

      </section>
    </>
  );
};

export default Hero;