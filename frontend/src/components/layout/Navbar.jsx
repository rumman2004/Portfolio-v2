import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { DarkModeToggle } from '../ui';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location   = useLocation();
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';
  const navRef     = useRef(null);
  const indicatorRef = useRef(null);
  const itemsRef   = useRef([]);

  const navItems = [
    { name: 'Home',    path: '/', icon: Home },
    { name: 'About',   path: '/about', icon: User },
    { name: 'Work',    path: '/work', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  /* ── Entrance — mirrors Skills heading: y + skew ── */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.fromTo(nav,
      { y: -80, opacity: 0, skewX: -2 },
      { y: 0, opacity: 1, skewX: 0, duration: 1.0, ease: 'expo.out', delay: 0.1 }
    );

    /* Staggered nav items: x slide-in (mirrors group-label in Skills) */
    gsap.fromTo(itemsRef.current,
      { x: -20, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 0.65,
        ease: 'expo.out',
        stagger: 0.07,
        delay: 0.25,
      }
    );
  }, []);

  /* ── Scroll backdrop ── */
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* ── Smooth active indicator: scaleX from left (mirrors group-divider) ── */
  useEffect(() => {
    const activeIdx = navItems.findIndex(i => i.path === location.pathname);
    const activeEl  = itemsRef.current[activeIdx];
    const indicator = indicatorRef.current;
    if (!activeEl || !indicator) return;

    const { left, width } = activeEl.getBoundingClientRect();
    const navLeft = navRef.current?.getBoundingClientRect().left ?? 0;

    gsap.to(indicator, {
      x: left - navLeft,
      width,
      opacity: 1,
      duration: 0.55,
      ease: 'expo.out',
    });
  }, [location.pathname]);

  return (
    <nav
      ref={navRef}
      style={{ fontFamily: "'Syne', sans-serif" }}
      className={`
        fixed top-4 left-0 right-0 z-50 mx-auto w-[95%] max-w-5xl rounded-2xl
        transition-all duration-300
        ${scrolled
          ? `backdrop-blur-xl border shadow-xl ${isDark ? 'bg-[#0f172a]/80 border-white/10 shadow-black/20' : 'bg-white/80 border-white/40 shadow-slate-200/50'}`
          : `backdrop-blur-sm border border-transparent ${isDark ? 'bg-black/10' : 'bg-white/10'}`
        }
      `}
    >
      <div className="px-3 md:px-6 py-2.5 md:py-3 relative">
        <div className="flex items-center justify-between">

          {/* Active slide indicator (absolutely positioned, GSAP-driven) */}
          <div
            ref={indicatorRef}
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '0.35rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, rgb(var(--accent)), #7c3aed)',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 0,
              boxShadow: '0 4px 16px -4px rgba(139,92,246,0.5)',
            }}
          />

          {/* Nav links */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-start" style={{ position: 'relative', zIndex: 1 }}>
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  ref={el => itemsRef.current[i] = el}
                  className={`
                    relative px-3 py-2 md:px-4 md:py-2 rounded-xl text-sm font-bold
                    flex items-center justify-center gap-2
                    transition-colors duration-200
                    ${isActive
                      ? 'text-white'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }
                  `}
                  style={{ letterSpacing: '-0.01em' }}
                  title={item.name}
                >
                  <item.icon className="w-[1.1rem] h-[1.1rem]" />
                  <span className="hidden md:block">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 pl-2" style={{ zIndex: 1 }}>
            <div className="scale-90 sm:scale-100 origin-right">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;