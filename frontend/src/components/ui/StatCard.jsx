import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef    = useRef(null);
  const valueRef   = useRef(null);
  const iconWellRef = useRef(null);

  const colorStyles = {
    blue:   isDark ? 'text-blue-400'    : 'text-blue-600',
    purple: isDark ? 'text-purple-400'  : 'text-purple-600',
    green:  isDark ? 'text-emerald-400' : 'text-emerald-600',
    orange: isDark ? 'text-orange-400'  : 'text-orange-600',
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {

      /* Card entrance — same expo.out pattern as Skills groups */
      gsap.fromTo(el,
        { y: 40, opacity: 0, skewY: 1 },
        {
          y: 0, opacity: 1, skewY: 0,
          duration: 0.95,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* Icon well: x slide-in (mirrors group-label in Skills) */
      gsap.fromTo(iconWellRef.current,
        { x: 24, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.75,
          ease: 'expo.out',
          delay: 0.12,
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* Numeric value counter (only when value is a pure number) */
      const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
      const suffix  = String(value).replace(/[0-9.]/g, '');
      if (!isNaN(numeric) && valueRef.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numeric,
          duration: 1.4,
          ease: 'expo.out',
          delay: 0.18,
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
          onUpdate() {
            if (valueRef.current) {
              const rounded = Number.isInteger(numeric)
                ? Math.round(obj.val)
                : obj.val.toFixed(1);
              valueRef.current.textContent = rounded + suffix;
            }
          },
        });
      }

    }, el);

    return () => ctx.revert();
  }, [value]);

  return (
    <div
      ref={cardRef}
      style={{ fontFamily: "'Syne', sans-serif" }}
      className={`
        relative p-6 rounded-2xl transition-all duration-300
        ${isDark
          ? 'bg-[#0f172a] shadow-[10px_10px_20px_#05080f,-10px_-10px_20px_rgba(255,255,255,0.03)] border border-slate-800/50'
          : 'bg-slate-100 shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff] border border-white/50'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-xs font-normal mb-1 uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
            style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.2em' }}
          >
            {title}
          </p>

          <h3
            ref={valueRef}
            className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
            style={{ letterSpacing: '-0.03em', lineHeight: 1 }}
          >
            {value}
          </h3>

          {trend !== undefined && (
            <p
              className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}
              style={{ fontFamily: "'DM Mono', monospace", fontStyle: 'italic', fontWeight: 300 }}
            >
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>

        <div
          ref={iconWellRef}
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0
            ${isDark
              ? 'bg-[#0f172a] shadow-[inset_4px_4px_8px_#05080f,inset_-2px_-2px_4px_rgba(255,255,255,0.05)]'
              : 'bg-slate-100 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]'
            }
          `}
        >
          <Icon className={`w-7 h-7 ${colorStyles[color]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;