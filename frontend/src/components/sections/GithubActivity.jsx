import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

/*
 * Fonts: Syne (display/headings) + DM Mono (labels/mono)
 * — same pair used across Hero.jsx and Skills.jsx
 */

const GithubActivity = ({ username = "rumman2004" }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [contributions, setContributions]       = useState([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [loading, setLoading]                   = useState(true);
    const [error, setError]                       = useState(null);
    const [selectedYear, setSelectedYear]         = useState('last');
    const [availableYears, setAvailableYears]     = useState(['last']);
    const [monthLabels, setMonthLabels]           = useState([]);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    /* refs */
    const sectionRef  = useRef(null);
    const tagRef      = useRef(null);
    const rulerRef    = useRef(null);
    const headingRef  = useRef(null);
    const subRef      = useRef(null);
    const cardRef     = useRef(null);

    /* ── Available years ── */
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = ['last'];
        for (let i = 0; i <= 5; i++) years.push((currentYear - i).toString());
        setAvailableYears(years);
    }, []);

    /* ── Fetch contributions ── */
    useEffect(() => {
        const fetchContributions = async () => {
            if (username === "YOUR_GITHUB_USERNAME") { setLoading(false); return; }
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`
                );
                if (!response.ok) throw new Error('Failed to fetch');
                processContributions(await response.json());
            } catch (err) {
                console.error('GitHub API Error:', err);
                setError('Failed to load GitHub data');
                generateFallbackData();
            } finally {
                setLoading(false);
            }
        };
        fetchContributions();
    }, [username, selectedYear]);

    const processContributions = (data) => {
        const weeks = []; let total = 0;
        const months = []; let lastMonth = null;
        if (data.contributions) {
            let currentWeek = [];
            data.contributions.forEach((c, i) => {
                total += c.count || 0;
                currentWeek.push({ date: c.date, count: c.count || 0, level: c.level });
                if (currentWeek.length === 7 || i === data.contributions.length - 1) {
                    weeks.push([...currentWeek]);
                    currentWeek = [];
                }
            });
            weeks.forEach((week, wi) => {
                if (!week.length) return;
                const d = new Date(week[0].date);
                const m = d.getMonth();
                if ((m !== lastMonth && wi > 0) || wi === 0) {
                    months.push({ name: d.toLocaleString('en', { month: 'short' }), weekIndex: wi });
                }
                lastMonth = m;
            });
        }
        setContributions(weeks); setTotalContributions(total); setMonthLabels(months);
    };

    const generateFallbackData = () => {
        const weeks = []; const today = new Date(); let total = 0;
        let currentWeek = []; const months = []; let lastMonth = null;
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today); date.setDate(date.getDate() - i);
            const count = Math.floor(Math.random() * 5); total += count;
            currentWeek.push({ date: date.toISOString().split('T')[0], count, level: count === 0 ? 0 : Math.min(count, 4) });
            if (currentWeek.length === 7) { weeks.push([...currentWeek]); currentWeek = []; }
        }
        if (currentWeek.length) weeks.push(currentWeek);
        weeks.forEach((week, wi) => {
            if (!week.length) return;
            const d = new Date(week[0].date); const m = d.getMonth();
            if ((m !== lastMonth && wi > 0) || wi === 0)
                months.push({ name: d.toLocaleString('en', { month: 'short' }), weekIndex: wi });
            lastMonth = m;
        });
        setContributions(weeks); setTotalContributions(total); setMonthLabels(months);
    };

    const getContributionColor = (level) => {
        if (isDark) {
            return ['#161b22','#0e4429','#006d32','#26a641','#39d353'][level] ?? '#161b22';
        }
        return ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'][level] ?? '#ebedf0';
    };

    const formatDate = (ds) =>
        new Date(ds).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    /* ── GSAP entrance animations (scroll-triggered, mirrors Skills.jsx) ── */
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {

            /* 1 · Section tag: slide from left */
            gsap.fromTo(tagRef.current,
                { x: -36, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
                    scrollTrigger: { trigger: tagRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
                }
            );

            /* 2 · Ruled line: scaleX expand — identical to Skills.jsx divider */
            gsap.fromTo(rulerRef.current,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1, duration: 1.2, ease: 'expo.out', delay: 0.08,
                    scrollTrigger: { trigger: tagRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
                }
            );

            /* 3 · Heading: rise + deskew — identical to Skills heading */
            gsap.fromTo(headingRef.current,
                { y: 64, opacity: 0, skewY: 2.5 },
                {
                    y: 0, opacity: 1, skewY: 0, duration: 1.15, ease: 'expo.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
                }
            );

            /* 4 · Sub-line: fade up */
            gsap.fromTo(subRef.current,
                { y: 28, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.18,
                    scrollTrigger: { trigger: subRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
                }
            );

            /* 5 · Card: rise + subtle scale */
            gsap.fromTo(cardRef.current,
                { y: 48, opacity: 0, scale: 0.98 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'expo.out',
                    scrollTrigger: { trigger: cardRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
                }
            );

        }, sectionRef.current);

        return () => ctx.revert();
    }, [loading]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

                .gh-section  { font-family: 'Syne', sans-serif; }
                .gh-heading  { font-family: 'Syne', sans-serif; font-weight: 800; }
                .gh-mono     { font-family: 'DM Mono', monospace; }

                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                .contribution-grid { min-width: fit-content; }
                @media (max-width: 768px) { .contribution-grid { transform-origin: top left; transform: scale(0.9); } }
                @media (max-width: 640px) { .contribution-grid { transform: scale(0.75); } }

                /* Cell hover ring */
                .cell-wrap:hover { ring: 2px; }
            `}</style>

            <section ref={sectionRef} className="gh-section py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">

                {/* Subtle background grid — same as Hero.jsx & Skills.jsx */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        backgroundImage: isDark
                            ? 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)'
                            : 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />

                <div className="max-w-6xl mx-auto relative">

                    {/* ── Header — mirrors Skills.jsx section header ── */}
                    <div className="mb-16">

                        {/* Tag row: "03 / GitHub Activity" */}
                        <div
                            ref={tagRef}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                opacity: 0, /* GSAP will reveal */
                            }}
                        >
                            <span
                                className="gh-mono"
                                style={{
                                    fontSize: '0.6rem', fontWeight: 300, fontStyle: 'italic',
                                    letterSpacing: '0.12em',
                                    color: `rgb(var(--accent))`,
                                    opacity: 0.8,
                                }}
                            >
                                03 /
                            </span>

                            <span
                                style={{
                                    fontFamily: "'DM Mono', monospace",
                                    fontWeight: 400,
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.24em',
                                    textTransform: 'uppercase',
                                    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)',
                                }}
                            >
                                GitHub Activity
                            </span>

                            {/* Ruled divider — same expanding line from Skills */}
                            <div
                                ref={rulerRef}
                                style={{
                                    flex: 1,
                                    height: '1px',
                                    background: isDark
                                        ? 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
                                        : 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)',
                                }}
                            />

                            {/* GitHub icon accent */}
                            <Github
                                style={{
                                    width: '0.85rem', height: '0.85rem',
                                    color: `rgb(var(--accent))`,
                                    opacity: 0.6,
                                    flexShrink: 0,
                                }}
                            />
                        </div>

                        {/* Main heading — same size/weight as Skills "Technical Arsenal" */}
                        <h2
                            ref={headingRef}
                            className="gh-heading"
                            style={{
                                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                                lineHeight: 0.9,
                                letterSpacing: '-0.035em',
                                color: `rgb(var(--text-primary))`,
                                marginBottom: '1.75rem',
                                opacity: 0, /* GSAP reveal */
                            }}
                        >
                            Open{' '}
                            <em style={{
                                color: `rgb(var(--accent))`,
                                fontStyle: 'italic',
                                fontWeight: 800,
                            }}>
                                Source
                            </em>
                        </h2>

                        {/* Sub-text — same mono style as Skills description */}
                        <p
                            ref={subRef}
                            className="gh-mono"
                            style={{
                                fontWeight: 300,
                                fontSize: 'clamp(0.78rem, 1vw, 0.9rem)',
                                lineHeight: 1.85,
                                letterSpacing: '0.01em',
                                color: `rgb(var(--text-secondary))`,
                                maxWidth: '50ch',
                                opacity: 0, /* GSAP reveal */
                            }}
                        >
                            A live view of my commit history and open-source contributions
                            across repositories.
                        </p>
                    </div>

                    {/* ── Graph Card ── */}
                    <div
                        ref={cardRef}
                        className={`
                            rounded-2xl p-4 sm:p-6 border transition-colors duration-300
                            ${isDark
                                ? 'bg-[#0d1117] border-white/10'
                                : 'bg-[#f6f8fa] border-gray-200 shadow-sm'
                            }
                        `}
                        style={{ opacity: 0 /* GSAP reveal */ }}
                    >
                        {loading ? (
                            <div className="h-40 flex items-center justify-center">
                                <div
                                    style={{
                                        width: '2rem', height: '2rem',
                                        border: `3px solid rgb(var(--accent))`,
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }}
                                />
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p
                                    className="gh-mono"
                                    style={{ color: '#f87171', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}
                                >
                                    ⚠ Failed to load data
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="gh-mono"
                                    style={{
                                        fontSize: '0.65rem', letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'underline',
                                        color: `rgb(var(--text-secondary))`,
                                        cursor: 'pointer',
                                        background: 'none', border: 'none',
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* Card top bar */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                                    <span
                                        className="gh-mono"
                                        style={{
                                            fontWeight: 300,
                                            fontSize: '0.7rem',
                                            letterSpacing: '0.14em',
                                            color: `rgb(var(--text-secondary))`,
                                        }}
                                    >
                                        <span style={{ color: `rgb(var(--text-primary))`, fontWeight: 400 }}>
                                            {totalContributions}
                                        </span>
                                        {' '}contributions in{' '}
                                        {selectedYear === 'last' ? 'the last year' : selectedYear}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        {/* Year selector */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowYearDropdown(!showYearDropdown)}
                                                className="gh-mono"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.68rem',
                                                    fontWeight: 400,
                                                    letterSpacing: '0.08em',
                                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
                                                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                                                    color: `rgb(var(--text-primary))`,
                                                    cursor: 'pointer',
                                                    transition: 'border-color 0.2s ease',
                                                }}
                                            >
                                                {selectedYear === 'last' ? 'Last Year' : selectedYear}
                                                <ChevronDown
                                                    style={{
                                                        width: '0.75rem', height: '0.75rem',
                                                        transition: 'transform 0.2s ease',
                                                        transform: showYearDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    }}
                                                />
                                            </button>

                                            {showYearDropdown && (
                                                <div
                                                    style={{
                                                        position: 'absolute', right: 0, marginTop: '0.5rem',
                                                        padding: '0.25rem 0',
                                                        borderRadius: '0.6rem',
                                                        zIndex: 50,
                                                        minWidth: '8rem',
                                                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                                                        background: isDark ? '#161b22' : '#fff',
                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                                    }}
                                                >
                                                    {availableYears.map((year) => (
                                                        <button
                                                            key={year}
                                                            onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                                                            className="gh-mono"
                                                            style={{
                                                                display: 'block',
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                padding: '0.45rem 1rem',
                                                                fontSize: '0.68rem',
                                                                letterSpacing: '0.08em',
                                                                fontWeight: selectedYear === year ? 400 : 300,
                                                                color: selectedYear === year ? `rgb(var(--accent))` : `rgb(var(--text-secondary))`,
                                                                background: selectedYear === year
                                                                    ? isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
                                                                    : 'transparent',
                                                                cursor: 'pointer',
                                                                border: 'none',
                                                                transition: 'background 0.15s ease',
                                                            }}
                                                        >
                                                            {year === 'last' ? 'Last Year' : year}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <a
                                            href={`https://github.com/${username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gh-mono"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                fontSize: '0.68rem', letterSpacing: '0.08em',
                                                color: `rgb(var(--accent))`,
                                                textDecoration: 'none',
                                                transition: 'opacity 0.2s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            View Profile
                                            <ExternalLink style={{ width: '0.6rem', height: '0.6rem' }} />
                                        </a>
                                    </div>
                                </div>

                                {/* Contribution Graph */}
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="contribution-grid inline-block">
                                        {/* Month labels */}
                                        <div className="relative h-5 mb-1 ml-[30px]">
                                            {monthLabels.map((month, idx) => (
                                                <span
                                                    key={idx}
                                                    className="gh-mono"
                                                    style={{
                                                        position: 'absolute',
                                                        left: `${month.weekIndex * 13}px`,
                                                        fontSize: '0.6rem',
                                                        fontWeight: 300,
                                                        letterSpacing: '0.08em',
                                                        color: `rgb(var(--text-secondary))`,
                                                    }}
                                                >
                                                    {month.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Grid + day labels */}
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {/* Day labels */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingRight: '4px' }}>
                                                {['Mon', '', 'Wed', '', 'Fri', '', ''].map((label, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{ width: '22px', height: '11px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                                                    >
                                                        <span
                                                            className="gh-mono"
                                                            style={{
                                                                fontSize: '0.52rem', fontWeight: 300,
                                                                letterSpacing: '0.06em',
                                                                color: `rgb(var(--text-secondary))`,
                                                            }}
                                                        >
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Cells */}
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                {contributions.map((week, wIdx) => (
                                                    <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                        {week.map((day, dIdx) => (
                                                            <div
                                                                key={dIdx}
                                                                className="group relative cell-wrap"
                                                                style={{
                                                                    width: '10px', height: '10px',
                                                                    borderRadius: '2px',
                                                                    backgroundColor: getContributionColor(day.level),
                                                                    cursor: 'pointer',
                                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                                }}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.transform = 'scale(1.35)';
                                                                    e.currentTarget.style.boxShadow = `0 0 0 1.5px rgb(var(--accent))`;
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.transform = 'scale(1)';
                                                                    e.currentTarget.style.boxShadow = 'none';
                                                                }}
                                                            >
                                                                {/* Tooltip */}
                                                                <div
                                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none"
                                                                >
                                                                    <div
                                                                        className="gh-mono"
                                                                        style={{
                                                                            fontSize: '0.6rem',
                                                                            fontWeight: 300,
                                                                            whiteSpace: 'nowrap',
                                                                            padding: '0.35rem 0.65rem',
                                                                            borderRadius: '0.4rem',
                                                                            background: isDark ? '#1c2128' : '#1a1a2e',
                                                                            color: '#fff',
                                                                            border: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                                                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                                                                            letterSpacing: '0.06em',
                                                                        }}
                                                                    >
                                                                        <div style={{ fontWeight: 400, marginBottom: '1px' }}>
                                                                            {day.count} contribution{day.count !== 1 ? 's' : ''}
                                                                        </div>
                                                                        <div style={{ opacity: 0.55, fontSize: '0.55rem' }}>
                                                                            {formatDate(day.date)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: '1rem',
                                        paddingTop: '0.75rem',
                                        borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)',
                                    }}
                                >
                                    <a
                                        href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gh-mono"
                                        style={{
                                            fontSize: '0.6rem', fontWeight: 300,
                                            letterSpacing: '0.06em',
                                            color: `rgb(var(--text-secondary))`,
                                            transition: 'color 0.2s ease',
                                            textDecoration: 'none',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = `rgb(var(--accent))`}
                                        onMouseLeave={e => e.currentTarget.style.color = `rgb(var(--text-secondary))`}
                                    >
                                        Learn how contributions are counted
                                    </a>

                                    <div
                                        className="gh-mono"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            fontSize: '0.6rem', fontWeight: 300, letterSpacing: '0.1em',
                                            color: `rgb(var(--text-secondary))`,
                                        }}
                                    >
                                        <span>Less</span>
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            {[0,1,2,3,4].map((level) => (
                                                <div
                                                    key={level}
                                                    style={{
                                                        width: '10px', height: '10px',
                                                        borderRadius: '2px',
                                                        backgroundColor: getContributionColor(level),
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span>More</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </>
    );
};

export default GithubActivity;