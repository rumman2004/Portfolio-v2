import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const badgeRef = useRef(null);

  const colors = {
    default: isDark ? 'text-slate-300' : 'text-slate-600',
    success:  isDark ? 'text-emerald-400' : 'text-emerald-600',
    warning:  isDark ? 'text-amber-400'   : 'text-amber-600',
    danger:   isDark ? 'text-rose-400'    : 'text-rose-600',
    info:     isDark ? 'text-blue-400'    : 'text-blue-600',
  };

  const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)]',
    warning: 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.6)]',
    danger:  'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.6)]',
    info:    'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]',
  };

  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return;

    gsap.fromTo(el,
      { x: -16, opacity: 0, skewX: 4 },
      {
        x: 0,
        opacity: 1,
        skewX: 0,
        duration: 0.65,
        ease: 'expo.out',
        delay: 0.05,
      }
    );

    /* Subtle pulse on the dot */
    const dot = el.querySelector('.badge-dot');
    if (dot && variant !== 'default') {
      gsap.to(dot, {
        scale: 1.35,
        opacity: 0.7,
        duration: 1.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, [variant]);

  return (
    <span
      ref={badgeRef}
      style={{ fontFamily: "'DM Mono', monospace" }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-widest
        transition-all duration-300 uppercase
        ${!isDark
          ? 'bg-slate-100 shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff]'
          : 'bg-[#0f172a] shadow-[4px_4px_8px_#05080f,-3px_-3px_6px_rgba(255,255,255,0.05)] border border-slate-800/50'
        }
        ${colors[variant] || colors.default}
        ${className}
      `}
    >
      <span className={`badge-dot w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${dotColors[variant] || dotColors.default}`} />
      {children}
    </span>
  );
};

export default Badge;