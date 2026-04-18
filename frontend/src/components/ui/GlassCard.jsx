import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef   = useRef(null);
  const sheenRef  = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {

      /* Entrance: y + opacity (same pattern as Skills sub-text) */
      gsap.fromTo(el,
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      if (!hover) return;

      /* Hover: lift + sheen sweep */
      const onEnter = () => {
        gsap.to(el, { y: -8, scale: 1.01, duration: 0.45, ease: 'expo.out' });
        gsap.to(sheenRef.current, { opacity: 1, x: '100%', duration: 0.55, ease: 'expo.out' });
      };
      const onLeave = () => {
        gsap.to(el, { y: 0, scale: 1, duration: 0.55, ease: 'expo.out' });
        gsap.set(sheenRef.current, { x: '-100%', opacity: 0 });
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };

    }, el);

    return () => ctx.revert();
  }, [hover]);

  return (
    <div
      ref={cardRef}
      style={{ fontFamily: "'Syne', sans-serif" }}
      className={`
        rounded-2xl p-6 relative overflow-hidden group
        transition-shadow duration-300
        ${!isDark
          ? 'bg-slate-100 shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[15px_15px_30px_#cbd5e1,-15px_-15px_30px_#ffffff]'
          : 'bg-[#0f172a] shadow-[8px_8px_16px_#05080f,-8px_-8px_16px_rgba(255,255,255,0.03)] hover:shadow-[12px_12px_24px_#05080f,-12px_-12px_24px_rgba(255,255,255,0.05)] border border-slate-800/50'
        }
        ${className}
      `}
      {...props}
    >
      {/* Sheen sweep — triggered by GSAP on hover */}
      <div
        ref={sheenRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          transform: 'translateX(-100%)',
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.07) 50%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {children}
    </div>
  );
};

export default GlassCard;