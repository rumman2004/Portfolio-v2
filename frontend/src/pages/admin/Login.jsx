import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Mail, Lock, LogIn, Fingerprint } from 'lucide-react';
import { Input, Button } from '../../components/ui';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }  = useAuth();
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';

  const wrapRef    = useRef(null);
  const cardRef    = useRef(null);
  const iconRef    = useRef(null);
  const headRef    = useRef(null);
  const formRef    = useRef(null);
  const footRef    = useRef(null);

  /* ── Entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.fromTo(cardRef.current,
        { y: 60, opacity: 0, skewY: 2 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1 }
      )
      .fromTo(iconRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7 }, '-=0.65'
      )
      .fromTo(headRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 }, '-=0.45'
      )
      .fromTo(formRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 }, '-=0.4'
      )
      .fromTo(footRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.5 }, '-=0.25'
      );

      /* Icon gentle pulse */
      gsap.to(iconRef.current, {
        scale: 1.08,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.1,
      });

    }, wrapRef.current);

    return () => ctx.revert();
  }, []);

  /* ── 3D tilt via GSAP (replaces inline state) ── */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotX = ((y - height / 2) / 22);
      const rotY = -((x - width / 2) / 22);
      gsap.to(card, {
        rotationX: rotX, rotationY: rotY,
        duration: 0.25, ease: 'expo.out',
        transformPerspective: 1000,
      });
    };
    const onLeave = () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0,
        duration: 0.55, ease: 'expo.out',
        transformPerspective: 1000,
      });
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const cleanHost  = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
      const loginUrl   = `${cleanHost}/api/auth/login`;

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Welcome back!');
        login(data.data);
      } else {
        toast.error(data.message || 'Invalid credentials');
        /* Shake card on error */
        gsap.fromTo(cardRef.current,
          { x: -10 },
          { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`
        min-h-screen flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500
        ${isDark ? 'bg-[#020617]' : 'bg-slate-200'}
      `}
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {/* Ambient glows */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-35
        ${isDark ? 'bg-indigo-600' : 'bg-blue-400'}`}
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-35
        ${isDark ? 'bg-purple-600' : 'bg-indigo-300'}`}
      />

      <div className="w-full max-w-md" style={{ perspective: '1000px' }}>
        <div
          ref={cardRef}
          className={`
            relative p-8 md:p-10 rounded-3xl
            ${isDark
              ? 'bg-[#0f172a] shadow-[20px_20px_60px_#05080f,-20px_-20px_60px_rgba(255,255,255,0.03)] border border-slate-800/50'
              : 'bg-slate-100 shadow-[20px_20px_60px_#a0aab8,-20px_-20px_60px_#ffffff]'
            }
          `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Icon well */}
          <div className="flex justify-center mb-8">
            <div
              ref={iconRef}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                ${isDark
                  ? 'bg-[#0f172a] shadow-[inset_6px_6px_12px_#05080f,inset_-6px_-6px_12px_rgba(255,255,255,0.05)]'
                  : 'bg-slate-100 shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff]'
                }
              `}
            >
              <Fingerprint className={`w-10 h-10 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
            </div>
          </div>

          {/* Heading */}
          <div ref={headRef} className="text-center mb-8">
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1,
              color: isDark ? 'rgba(241,245,249,1)' : 'rgba(15,23,42,1)',
              marginBottom: '0.5rem',
            }}>
              Welcome Back
            </h1>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontWeight: 300,
              fontSize: '0.75rem', letterSpacing: '0.04em',
              color: 'rgb(var(--text-secondary))',
            }}>
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <Input label="Email Address" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              placeholder="admin@example.com" icon={Mail}
            />
            <Input label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••" icon={Lock}
            />
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" size="lg"
                loading={loading} icon={LogIn}>
                Sign In
              </Button>
            </div>
          </form>

          {/* Footer tag */}
          <div
            ref={footRef}
            className={`mt-8 pt-6 border-t flex justify-center
              ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}
            `}
            style={{
              fontFamily: "'DM Mono', monospace", fontWeight: 300, fontStyle: 'italic',
              fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}
          >
            Secure Admin Access
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;