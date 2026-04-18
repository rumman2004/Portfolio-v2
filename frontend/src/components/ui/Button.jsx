import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const btnRef     = useRef(null);
  const shimRef    = useRef(null);

  /* ── Shimmer loop (primary only) ── */
  useEffect(() => {
    if (variant !== 'primary' || !shimRef.current) return;

    const tween = gsap.fromTo(shimRef.current,
      { x: '-110%' },
      {
        x: '110%',
        duration: 2.8,
        ease: 'none',
        repeat: -1,
        repeatDelay: 1.2,
      }
    );
    return () => tween.kill();
  }, [variant]);

  /* ── Tap / hover via GSAP ── */
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onEnter  = () => gsap.to(btn, { scale: 1.03, y: -2, duration: 0.3, ease: 'expo.out' });
    const onLeave  = () => gsap.to(btn, { scale: 1,    y: 0,  duration: 0.35, ease: 'expo.out' });
    const onDown   = () => gsap.to(btn, { scale: 0.96, y: 1,  duration: 0.15, ease: 'expo.out' });
    const onUp     = () => gsap.to(btn, { scale: 1,    y: 0,  duration: 0.3,  ease: 'expo.out' });

    btn.addEventListener('mouseenter',  onEnter);
    btn.addEventListener('mouseleave',  onLeave);
    btn.addEventListener('mousedown',   onDown);
    btn.addEventListener('mouseup',     onUp);
    btn.addEventListener('touchstart',  onDown, { passive: true });
    btn.addEventListener('touchend',    onUp);

    return () => {
      btn.removeEventListener('mouseenter',  onEnter);
      btn.removeEventListener('mouseleave',  onLeave);
      btn.removeEventListener('mousedown',   onDown);
      btn.removeEventListener('mouseup',     onUp);
      btn.removeEventListener('touchstart',  onDown);
      btn.removeEventListener('touchend',    onUp);
    };
  }, []);

  /* ── Styles ── */
  const base = [
    'relative inline-flex items-center justify-center gap-2 rounded-full',
    'transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
    'tracking-wide select-none',
  ].join(' ');

  const fontStyle = { fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '0.04em' };

  const variants = {
    primary: `
      text-white border-0
      bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6]
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_2px_12px_0_rgba(255,255,255,0.3),inset_0_-2px_8px_0_rgba(0,0,0,0.25),0_4px_20px_-4px_rgba(139,92,246,0.6)]
    `,
    secondary: `
      ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}
      border border-transparent
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_2px_8px_-2px_rgba(0,0,0,0.1)]
      hover:text-[rgb(var(--accent))]
      backdrop-blur-md
    `,
    outline: `
      border-2 border-[rgb(var(--accent))] text-[rgb(var(--accent))] bg-transparent
      hover:bg-[rgb(var(--accent))] hover:text-white
      shadow-[0_0_15px_rgba(var(--accent),0.25)]
    `,
    danger: `
      bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_6px_0_rgba(0,0,0,0.2),0_4px_15px_-2px_rgba(239,68,68,0.5)]
    `,
  };

  const sizes = { sm: 'px-4 py-1.5 text-xs', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' };

  return (
    <button
      ref={btnRef}
      style={fontStyle}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={loading}
      {...props}
    >
      {/* Glass top-shine (primary) */}
      {variant === 'primary' && (
        <>
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[45%] rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)' }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-[28%] rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18), transparent)' }}
          />
          {/* GSAP-driven shimmer */}
          <div
            ref={shimRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)',
              transform: 'translateX(-110%)',
            }}
          />
        </>
      )}

      <span className="relative z-10 flex items-center gap-2">
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : Icon
            ? <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            : null
        }
        {children}
      </span>
    </button>
  );
};

export default Button;