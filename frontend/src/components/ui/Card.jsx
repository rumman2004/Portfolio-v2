import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const Card = ({ children, className = '', title, description }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef   = useRef(null);
  const titleRef  = useRef(null);
  const divRef    = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {

      /* Card body: rise + slight skew (mirrors Skills heading entrance) */
      gsap.fromTo(el,
        { y: 48, opacity: 0, skewY: 1.5 },
        {
          y: 0, opacity: 1, skewY: 0,
          duration: 1.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* Title divider: scaleX expand (mirrors group-divider in Skills) */
      if (divRef.current) {
        gsap.fromTo(divRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.0,
            ease: 'expo.out',
            delay: 0.12,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{ fontFamily: "'Syne', sans-serif" }}
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${!isDark
          ? 'bg-slate-100 shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] border border-white/40'
          : 'bg-[#0f172a] shadow-[10px_10px_20px_#05080f,-10px_-10px_20px_rgba(255,255,255,0.03)] border border-slate-800/30'
        }
        ${className}
      `}
    >
      {title && (
        <div className="mb-5 pb-4" style={{ position: 'relative' }}>
          <h3
            ref={titleRef}
            className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
            style={{ letterSpacing: '-0.025em' }}
          >
            {title}
          </h3>

          {description && (
            <p
              className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, letterSpacing: '0.04em' }}
            >
              {description}
            </p>
          )}

          {/* Ruled divider — same as group-divider in Skills */}
          <div
            ref={divRef}
            style={{
              marginTop: '1rem',
              height: '1px',
              background: isDark
                ? 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
                : 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)',
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;