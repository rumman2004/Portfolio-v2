import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DarkModeToggle } from '../ui';

const Navbar = () => {
  const [scrolled, setScrolled]             = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [entered, setEntered]               = useState(false);

  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navRef       = useRef(null);
  const containerRef = useRef(null);
  const itemsRef     = useRef([]);

  const navItems = [
    { name: 'Home',    path: '/',        icon: Home      },
    { name: 'About',   path: '/about',   icon: User      },
    { name: 'Work',    path: '/work',    icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Mail      },
  ];

  /* ── Scroll backdrop ── */
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* ── Entrance animation — uses opacity only to avoid conflicting with translateX(-50%) centering ── */
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* ── Indicator position ── */
  useEffect(() => {
    const update = () => {
      const idx  = navItems.findIndex(i => i.path === location.pathname);
      const el   = itemsRef.current[idx];
      const cont = containerRef.current;
      if (!el || !cont) return;

      const er = el.getBoundingClientRect();
      const cr = cont.getBoundingClientRect();

      setIndicatorStyle({
        left:   er.left - cr.left,
        top:    er.top  - cr.top,
        width:  er.width,
        height: er.height,
      });

      if (!indicatorReady) {
        requestAnimationFrame(() => setTimeout(() => setIndicatorReady(true), 20));
      }
    };

    update();
    const t = setTimeout(update, 150);
    window.addEventListener('resize', update);
    return () => { clearTimeout(t); window.removeEventListener('resize', update); };
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

        .nav-root {
          font-family: 'Syne', sans-serif;
          position: fixed;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          max-width: 960px;
          z-index: 9999;
          /* Entrance: fade + slide down */
          opacity: 0;
          margin-top: -20px;
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), margin-top 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-root.entered {
          opacity: 1;
          margin-top: 0;
        }

        .nav-pill {
          border-radius: 20px;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition:
            background 0.4s ease,
            border-color 0.4s ease,
            box-shadow 0.4s ease,
            backdrop-filter 0.4s ease;
        }

        .nav-pill.resting-dark {
          background: rgba(2, 6, 23, 0.3);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .nav-pill.resting-light {
          background: rgba(255,255,255,0.25);
          border: 1px solid rgba(0,0,0,0.06);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .nav-pill.scrolled-dark {
          background: rgba(7, 15, 35, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }
        .nav-pill.scrolled-light {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }

        /* Links container */
        .nav-links {
          position: relative;
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          min-width: 0; /* Allow shrinking */
        }

        /* Sliding background pill */
        .nav-indicator {
          position: absolute;
          pointer-events: none;
          border-radius: 14px;
          z-index: 0;
          transition: none;
        }
        .nav-indicator.ready {
          transition:
            left   0.42s cubic-bezier(0.34, 1.56, 0.64, 1),
            top    0.42s cubic-bezier(0.34, 1.56, 0.64, 1),
            width  0.42s cubic-bezier(0.34, 1.56, 0.64, 1),
            height 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .nav-indicator.dark {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .nav-indicator.light {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
        }

        /* Individual nav links */
        .nav-link {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s ease;
          border: none;
          background: none;
          cursor: pointer;
        }
        .nav-link .nav-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .nav-link:hover .nav-icon {
          transform: scale(1.18);
        }
        .nav-link .nav-label {
          display: none;
        }

        /* Active / inactive colours */
        .nav-link.active.dark  { color: #ffffff; }
        .nav-link.active.light { color: #0f172a; }
        .nav-link.inactive.dark  { color: rgba(148,163,184,0.85); }
        .nav-link.inactive.light { color: rgba(71,85,105,0.8); }
        .nav-link.inactive.dark:hover  { color: rgba(226,232,240,1); }
        .nav-link.inactive.light:hover { color: rgba(15,23,42,1); }

        /* Dot indicator under active item */
        .nav-dot {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          transition: opacity 0.25s ease, background 0.25s ease;
        }
        .nav-dot.dark  { background: rgba(255,255,255,0.6); }
        .nav-dot.light { background: rgba(15,23,42,0.5); }

        /* Right-side actions (Dark Mode Toggle) — always visible */
        .nav-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 8px;
          margin-left: 4px;
          flex-shrink: 0;
          border-left: 1px solid rgba(150, 150, 150, 0.15);
        }

        /* ─── Responsive ─── */

        /* Small Phones (≤ 380px) */
        @media (max-width: 380px) {
          .nav-root { width: 96%; top: 8px; }
          .nav-pill { padding: 4px; }
          .nav-link { padding: 7px 9px; font-size: 12px; }
          .nav-link .nav-icon { width: 14px; height: 14px; }
          .nav-actions { padding-left: 4px; margin-left: 2px; }
        }

        /* Tablets and above (≥ 640px) — show labels */
        @media (min-width: 640px) {
          .nav-links { gap: 4px; }
          .nav-link { padding: 8px 16px; gap: 8px; font-size: 13.5px; }
          .nav-link .nav-label { display: inline; }
          .nav-dot { bottom: -2px; }
          .nav-actions { padding-left: 14px; margin-left: 8px; }
        }

        /* Desktops (≥ 768px) */
        @media (min-width: 768px) {
          .nav-pill { padding: 7px 10px; border-radius: 22px; }
          .nav-link { font-size: 14px; padding: 9px 18px; }
        }

        /* Stagger entrance for nav items */
        @keyframes navItemIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .nav-link {
          animation: navItemIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        .nav-link:nth-child(2) { animation-delay: 0.06s; }
        .nav-link:nth-child(3) { animation-delay: 0.12s; }
        .nav-link:nth-child(4) { animation-delay: 0.18s; }
        .nav-link:nth-child(5) { animation-delay: 0.24s; }
      `}</style>

      <nav
        ref={navRef}
        className={`nav-root ${entered ? 'entered' : ''}`}
        aria-label="Main navigation"
      >
        <div className={`nav-pill ${
          scrolled
            ? (isDark ? 'scrolled-dark' : 'scrolled-light')
            : (isDark ? 'resting-dark'  : 'resting-light')
        }`}>

          {/* ── Links ── */}
          <div ref={containerRef} className="nav-links">
            {/* Sliding indicator */}
            <div
              aria-hidden="true"
              className={`nav-indicator ${indicatorReady ? 'ready' : ''} ${isDark ? 'dark' : 'light'}`}
              style={indicatorStyle}
            />

            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  ref={el => { itemsRef.current[i] = el; }}
                  className={`nav-link ${isActive ? 'active' : 'inactive'} ${isDark ? 'dark' : 'light'}`}
                  title={item.name}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="nav-icon" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="nav-label">{item.name}</span>

                  {/* Active dot */}
                  {isActive && (
                    <span
                      className={`nav-dot ${isDark ? 'dark' : 'light'}`}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Dark Mode Toggle — always visible ── */}
          <div className="nav-actions">
            <DarkModeToggle />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;