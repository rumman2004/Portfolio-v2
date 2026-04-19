import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FolderOpen, Award, Briefcase, Wrench, Mail,
  MessageSquare, ArrowRight, Clock, Calendar, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, GlassCard, Button, Badge } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import { useTheme } from '../../context/ThemeContext';
import {
  projectsAPI, skillsAPI, experienceAPI,
  certificatesAPI, contactsAPI
} from '../../services/api';

gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState({
    projects: 0, skills: 0, experiences: 0, certificates: 0,
    contacts: { total: 0, unread: 0, replied: 0 }
  });
  const [loading, setLoading]           = useState(true);
  const [recentContacts, setRecentContacts] = useState([]);

  /* refs */
  const wrapRef      = useRef(null);
  const headerRef    = useRef(null);
  const statsRef     = useRef(null);
  const messagesRef  = useRef(null);
  const healthRef    = useRef(null);
  const barRef       = useRef(null);
  const contactRefs  = useRef([]);
  const statCardRefs = useRef([]);

  /* ── fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const [pR, sR, eR, cR, csR, conR] = await Promise.all([
          projectsAPI.getAll(), skillsAPI.getAll(), experienceAPI.getAll(),
          certificatesAPI.getAll(), contactsAPI.getStats(), contactsAPI.getAll()
        ]);
        setStats({
          projects: pR.data.count, skills: sR.data.count,
          experiences: eR.data.count, certificates: cR.data.count,
          contacts: csR.data.data
        });
        setRecentContacts(conR.data.data.slice(0, 4));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── GSAP after data loads ── */
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {

      /* Header: rise + deskew (Skills heading pattern) */
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0, skewY: 1.5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.0, ease: 'expo.out' }
      );

      /* Stat cards: staggered x-slide (group-label pattern) */
      gsap.fromTo(statCardRefs.current,
        { x: -28, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, ease: 'expo.out', stagger: 0.09, delay: 0.15 }
      );

      /* Section headings: divider scaleX */
      wrapRef.current?.querySelectorAll('.dash-divider').forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.1, ease: 'expo.out', delay: 0.3,
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } }
        );
      });

      /* Contact rows: staggered y slide */
      contactRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { x: -24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: 0.35 + i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' } }
        );
      });

      /* Portfolio health card */
      gsap.fromTo(healthRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', delay: 0.25,
          scrollTrigger: { trigger: healthRef.current, start: 'top 88%', toggleActions: 'play none none reverse' } }
        );

    }, wrapRef.current);

    return () => ctx.revert();
  }, [loading]);

  /* ── progress bar animation ── */
  useEffect(() => {
    if (loading || !barRef.current) return;
    const pct = stats.contacts.total > 0
      ? (stats.contacts.replied / stats.contacts.total) * 100
      : 100;
    gsap.fromTo(barRef.current,
      { width: '0%' },
      { width: `${pct}%`, duration: 1.4, ease: 'expo.out', delay: 0.5,
        scrollTrigger: { trigger: barRef.current, start: 'top 90%', toggleActions: 'play none none reverse' } }
    );
  }, [loading, stats]);

  if (loading) return <Loader fullScreen size="lg" />;

  const responsePct = stats.contacts.total > 0
    ? Math.round((stats.contacts.replied / stats.contacts.total) * 100)
    : 100;

  const statCards = [
    { title: 'Total Projects',  value: stats.projects,            icon: FolderOpen, color: 'blue'   },
    { title: 'Total Skills',    value: stats.skills,              icon: Wrench,     color: 'purple' },
    { title: 'Experience',      value: stats.experiences,         icon: Briefcase,  color: 'green'  },
    { title: 'Certificates',    value: stats.certificates,        icon: Award,      color: 'orange' },
    { title: 'Messages',        value: stats.contacts.total,      icon: Mail,       color: 'blue'   },
  ];

  return (
    <div ref={wrapRef} className="space-y-8 pb-10" style={{ fontFamily: "'Syne', sans-serif" }}>

      {/* ── Header ── */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', fontWeight: 300,
            fontStyle: 'italic', letterSpacing: '0.12em',
            color: 'rgb(var(--accent))', opacity: 0.7, marginBottom: '0.4rem',
          }}>
            01 /
          </p>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 0.95,
            color: 'rgb(var(--text-primary))',
          }}>
            Dashboard
          </h1>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.8rem',
            letterSpacing: '0.02em', color: 'rgb(var(--text-secondary))', marginTop: '0.5rem',
          }}>
            Overview of your portfolio activity and content.
          </p>
        </div>

        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm
          ${isDark
            ? 'bg-slate-800 text-slate-300 border border-slate-700'
            : 'bg-white text-slate-600 shadow-sm border border-slate-200'
          }
        `} style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, i) => (
          <div key={stat.title} ref={el => statCardRefs.current[i] = el}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
          </div>
        ))}
      </div>

      {/* ── Split Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Messages */}
        <div className="lg:col-span-2 space-y-6">
          <div ref={messagesRef} className="flex items-center justify-between">
            <div>
              <h2 style={{
                fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em',
                color: 'rgb(var(--text-primary))',
              }}>
                Recent Messages
              </h2>
              <div className="dash-divider" style={{
                height: '1px', marginTop: '0.4rem',
                background: isDark
                  ? 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
                  : 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)',
              }} />
            </div>
            <Link to="/admin/contacts">
              <Button variant="secondary" size="sm" icon={ArrowRight}>View All</Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact, i) => (
                <div key={contact._id || i} ref={el => contactRefs.current[i] = el}>
                  <GlassCard className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center shrink-0
                        ${isDark
                          ? 'bg-slate-800 text-indigo-400 shadow-[inset_2px_2px_4px_#0f172a]'
                          : 'bg-slate-100 text-indigo-600 shadow-[inset_2px_2px_4px_#cbd5e1]'
                        }
                      `}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                          {contact.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 style={{ fontWeight: 700, color: 'rgb(var(--text-primary))' }} className="truncate">
                            {contact.name}
                          </h3>
                          {!contact.isRead && <Badge variant="info">New</Badge>}
                        </div>
                        <p style={{
                          fontFamily: "'DM Mono', monospace", fontWeight: 300,
                          fontSize: '0.78rem', letterSpacing: '0.01em',
                          color: 'rgb(var(--text-secondary))',
                        }} className="line-clamp-1">
                          {contact.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div style={{
                        fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.68rem',
                        letterSpacing: '0.06em', color: 'rgb(var(--text-secondary))',
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                      }}>
                        <Clock className="w-3 h-3" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Reply
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              ))
            ) : (
              <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.8rem' }}>
                  No messages yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Health */}
        <div ref={healthRef} className="space-y-6">
          <div>
            <h2 style={{
              fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em',
              color: 'rgb(var(--text-primary))',
            }}>
              Portfolio Health
            </h2>
            <div className="dash-divider" style={{
              height: '1px', marginTop: '0.4rem',
              background: isDark
                ? 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
                : 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)',
            }} />
          </div>

          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between">
              <span style={{
                fontFamily: "'DM Mono', monospace", fontWeight: 300,
                fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgb(var(--text-secondary))',
              }}>
                System Status
              </span>
              <Badge variant="success" className="animate-pulse">Operational</Badge>
            </div>

            {/* Response rate bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.75rem', color: 'rgb(var(--text-primary))' }}>
                  Response Rate
                </span>
                <span style={{ fontWeight: 800, color: 'rgb(var(--accent))' }}>
                  {responsePct}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div
                  ref={barRef}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(to right, rgb(var(--accent)), #7c3aed)',
                    borderRadius: '9999px',
                    width: '0%',
                  }}
                />
              </div>
            </div>

            <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' }} />

            {/* Checklist */}
            <div className="space-y-3">
              <p style={{
                fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', fontWeight: 300,
                letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgb(var(--text-secondary))',
              }}>
                Quick Checks
              </p>
              {[
                { label: 'Database Connected', status: true },
                { label: 'Cloudinary Sync',    status: true },
                { label: 'Admin Access',        status: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${item.status ? 'text-emerald-500' : 'text-slate-500'}`} />
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontWeight: 300,
                    fontSize: '0.78rem', color: 'rgb(var(--text-primary))',
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <Link to="/admin/projects" className="block">
            <Button className="w-full" variant="primary" icon={FolderOpen}>
              Manage Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;