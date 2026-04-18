import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const backdropRef = useRef(null);
  const panelRef    = useRef(null);
  const mountedRef  = useRef(false);

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };

  /* ── Lock scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  /* ── GSAP in / out ── */
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel    = panelRef.current;
    if (!backdrop || !panel) return;

    if (isOpen) {
      /* Entrance: backdrop fade + panel spring slide-up */
      gsap.set(panel, { y: '60vh', opacity: 0, skewY: 1.5 });
      gsap.set(backdrop, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(backdrop, { opacity: 1, duration: 0.3, ease: 'expo.out' })
        .to(panel,
          { y: 0, opacity: 1, skewY: 0, duration: 0.75, ease: 'expo.out' },
          '-=0.15'
        );

      /* Animate divider line (mirrors group-divider in Skills) */
      const divider = panel.querySelector('.modal-divider');
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.0, ease: 'expo.out', delay: 0.3 }
        );
      }

    } else if (mountedRef.current) {
      /* Exit */
      const tl = gsap.timeline();
      tl.to(panel,    { y: '40vh', opacity: 0, skewY: -1, duration: 0.45, ease: 'expo.in' })
        .to(backdrop, { opacity: 0, duration: 0.25, ease: 'expo.in' }, '-=0.2');
    }

    mountedRef.current = true;
  }, [isOpen]);

  if (!isOpen && !mountedRef.current) return null;

  const modalContent = (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          backgroundColor: isDark ? 'rgba(2,6,23,0.75)' : 'rgba(226,232,240,0.65)',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          fontFamily: "'Syne', sans-serif",
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          ...(isDark
            ? {
                background: '#0f172a',
                boxShadow: '0 0 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
                border: '1px solid rgba(51,65,85,0.5)',
              }
            : {
                background: '#f1f5f9',
                boxShadow: '20px 20px 60px #a0aab8, -20px -20px 60px #ffffff',
              }
          ),
        }}
        className={sizes[size]}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          position: 'relative',
        }}>
          <div>
            {/* Mono tag — same pattern as Skills "02 /" index */}
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.58rem',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '0.12em',
              color: 'rgb(var(--accent))',
              opacity: 0.7,
              display: 'block',
              marginBottom: '0.25rem',
            }}>
              ◆
            </span>

            <h2 style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: isDark ? 'rgba(241,245,249,1)' : 'rgba(15,23,42,1)',
              margin: 0,
            }}>
              {title}
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              ...(isDark
                ? { background: '#0f172a', boxShadow: 'inset 2px 2px 5px #05080f, inset -1px -1px 3px rgba(255,255,255,0.05)' }
                : { background: '#f1f5f9', boxShadow: 'inset 2px 2px 5px #cbd5e1, inset -2px -2px 5px #ffffff' }
              ),
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: isDark ? '#94a3b8' : '#64748b' }} />
          </button>
        </div>

        {/* Ruled divider */}
        <div
          className="modal-divider"
          style={{
            height: '1px',
            marginLeft: '1.5rem',
            marginRight: '1.5rem',
            background: isDark
              ? 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)'
              : 'linear-gradient(to right, rgba(0,0,0,0.07), transparent)',
          }}
        />

        {/* Content */}
        <div
          className="custom-scrollbar"
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 90px)',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 300,
            fontSize: '0.88rem',
            letterSpacing: '0.01em',
            lineHeight: 1.85,
            color: isDark ? 'rgba(148,163,184,1)' : 'rgba(71,85,105,1)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;