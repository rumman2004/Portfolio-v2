import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui';

const NotFound = () => {
  const wrapRef  = useRef(null);
  const numRef   = useRef(null);
  const ringRef  = useRef(null);
  const h1Ref    = useRef(null);
  const paraRef  = useRef(null);
  const btnsRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Entrance: staggered rise + deskew (Skills heading pattern) */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(numRef.current,
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1 }
      )
      .fromTo(h1Ref.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 }, '-=0.65'
      )
      .fromTo(paraRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 }, '-=0.55'
      )
      .fromTo(btnsRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 }, '-=0.45'
      );

      /* Infinite float on the 404 number */
      gsap.to(numRef.current, {
        y: -18,
        duration: 2.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.0,
      });

      /* Slow spin on the decorative ring */
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 22,
        ease: 'none',
        repeat: -1,
      });

    }, wrapRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="min-h-screen flex items-center justify-center px-4"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <div className="text-center">

        {/* 404 */}
        <div
          ref={numRef}
          style={{
            fontSize: 'clamp(6rem, 18vw, 12rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(135deg, rgb(var(--accent)), #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          404
        </div>

        {/* Heading */}
        <h1
          ref={h1Ref}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: 'rgb(var(--text-primary))',
          }}
        >
          Page Not Found
        </h1>

        {/* Sub text */}
        <p
          ref={paraRef}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 300,
            fontSize: 'clamp(0.78rem, 1.5vw, 0.95rem)',
            lineHeight: 1.85,
            letterSpacing: '0.01em',
            color: 'rgb(var(--text-secondary))',
            maxWidth: '42ch',
            margin: '0 auto 2.5rem',
          }}
        >
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Buttons */}
        <div
          ref={btnsRef}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/">
            <Button size="lg" icon={Home}>Go Home</Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Decorative ring */}
        <div className="mt-14 relative flex justify-center" style={{ height: '16rem' }}>
          <div
            ref={ringRef}
            style={{
              width: '16rem',
              height: '16rem',
              borderRadius: '9999px',
              border: '1px solid rgba(var(--accent), 0.15)',
              opacity: 0.12,
              position: 'absolute',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;