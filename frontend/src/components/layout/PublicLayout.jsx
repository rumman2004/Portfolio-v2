import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useFetch } from '../../hooks/useFetch';

/* ─────────────────────────────────────────
   Ambient orb that follows the pointer
───────────────────────────────────────── */
const AmbientOrb = ({ isDark }) => {
  const orbRef = useRef(null);
  const pos    = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf    = useRef(null);

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointermove', move, { passive: true });

    const tick = () => {
      if (orbRef.current) {
        orbRef.current.style.transform =
          `translate(${pos.current.x - 300}px, ${pos.current.y - 300}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 600, height: 600,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'opacity 0.6s ease',
        opacity: isDark ? 0.035 : 0.025,
        background: isDark
          ? 'radial-gradient(circle, rgba(99,102,241,1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
};

/* ─────────────────────────────────────────
   Static noise grain overlay
───────────────────────────────────────── */
const GrainOverlay = () => (
  <svg
    aria-hidden="true"
    style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: 2,
      opacity: 0.028,
      mixBlendMode: 'overlay',
    }}
  >
    <filter id="grain-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain-filter)" />
  </svg>
);

/* ─────────────────────────────────────────
   Main layout
───────────────────────────────────────── */
const PublicLayout = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: aboutData }           = useFetch('/about');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded]            = useState({});

  /* ── Secret admin shortcut ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') navigate('/admin/login');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  /* ── Background image slider ── */
  useEffect(() => {
    if (!aboutData?.heroImages || aboutData.heroImages.length <= 1) return;
    const id = setInterval(() => {
      setCurrentImageIndex(p =>
        p === aboutData.heroImages.length - 1 ? 0 : p + 1
      );
    }, 6000);
    return () => clearInterval(id);
  }, [aboutData]);

  /* ── Preload images ── */
  useEffect(() => {
    if (!aboutData?.heroImages) return;
    aboutData.heroImages.forEach(({ url }) => {
      const img = new Image();
      img.src   = url;
      img.onload = () => setImagesLoaded(p => ({ ...p, [url]: true }));
    });
  }, [aboutData]);

  const hasImages   = !!aboutData?.heroImages?.length;
  const currentImg  = hasImages ? aboutData.heroImages[currentImageIndex]?.url : null;
  const isImgReady  = currentImg && imagesLoaded[currentImg];

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --transition-theme: background 0.5s ease, color 0.5s ease;
          --content-top-sm: 72px;
          --content-top-md: 88px;
          --content-top-lg: 100px;
        }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          font-family: 'Syne', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }

        /* Page-enter transition triggered by framer on route changes */
        .page-enter  { opacity: 0; transform: translateY(10px); }
        .page-active { opacity: 1; transform: translateY(0);    transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1); }

        /* Content top-padding responsive */
        .content-pad { padding-top: var(--content-top-sm); }
        @media (min-width: 640px)  { .content-pad { padding-top: var(--content-top-md); } }
        @media (min-width: 1024px) { .content-pad { padding-top: var(--content-top-lg); } }

        /* Focus visible ring */
        :focus-visible {
          outline: 2px solid rgba(99,102,241,0.7);
          outline-offset: 2px;
          border-radius: 6px;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background: rgba(148,163,184,0.3);
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.55); }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
          transition: 'background 0.5s ease, color 0.5s ease',
          background: isDark ? '#020617' : '#f1f5f9',
          color:      isDark ? '#f8fafc'  : '#0f172a',
        }}
      >
        {/* ════════════════════════════════
            LAYER 0 — Background imagery
        ════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <AnimatePresence mode="wait">
            {hasImages && isImgReady ? (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1,  scale: 1     }}
                exit={{    opacity: 0                }}
                transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${currentImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            ) : (
              /* Fallback gradient */
              <motion.div
                key="fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: isDark
                    ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,41,59,1) 0%, rgba(2,6,23,1) 100%)'
                    : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226,232,240,1) 0%, rgba(241,245,249,1) 100%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Vignette tinted overlay */}
          <div
            style={{
              position: 'absolute', inset: 0,
              zIndex: 1,
              transition: 'background 0.5s ease',
              background: isDark
                ? `
                    linear-gradient(to bottom,
                      rgba(2,6,23,0.55) 0%,
                      rgba(2,6,23,0.30) 40%,
                      rgba(2,6,23,0.55) 100%
                    )
                  `
                : `
                    linear-gradient(to bottom,
                      rgba(241,245,249,0.65) 0%,
                      rgba(241,245,249,0.25) 40%,
                      rgba(241,245,249,0.70) 100%
                    )
                  `,
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />
        </div>

        {/* ════════════════════════════════
            LAYER 1 — Ambient orb + grain
        ════════════════════════════════ */}
        <AmbientOrb isDark={isDark} />
        <GrainOverlay />

        {/* ════════════════════════════════
            LAYER 2 — Page content
        ════════════════════════════════ */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%',
          }}
        >
          <Navbar />

          <main
            id="main-content"
            style={{ flex: 1, width: '100%' }}
          >
            <div className="content-pad" style={{ width: '100%' }}>
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>

        {/* ════════════════════════════════
            Toast notifications
        ════════════════════════════════ */}
        <Toaster
          position="top-right"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "'Syne', sans-serif",
              fontSize: '13.5px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              background: isDark
                ? 'rgba(7, 15, 35, 0.92)'
                : 'rgba(255, 255, 255, 0.95)',
              color: isDark ? '#f1f5f9' : '#0f172a',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(0,0,0,0.07)',
              boxShadow: isDark
                ? '0 4px 6px rgba(0,0,0,0.3), 0 12px 40px rgba(0,0,0,0.4)'
                : '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.1)',
              borderRadius: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: isDark ? '#071023' : '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f43f5e',
                secondary: isDark ? '#071023' : '#fff',
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default PublicLayout;