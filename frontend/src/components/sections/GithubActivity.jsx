import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const GithubActivity = ({ username = "rumman2004" }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [contributions, setContributions] = useState([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('last');
    const [availableYears, setAvailableYears] = useState(['last']);
    const [monthLabels, setMonthLabels] = useState([]);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    useEffect(() => {
        // Generate available years (current year and past 5 years)
        const currentYear = new Date().getFullYear();
        const years = ['last'];
        for (let i = 0; i <= 5; i++) {
            years.push((currentYear - i).toString());
        }
        setAvailableYears(years);
    }, []);

    useEffect(() => {
        const fetchContributions = async () => {
            if (username === "YOUR_GITHUB_USERNAME") {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch contribution data');
                }

                const data = await response.json();
                processContributions(data);
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
        const weeks = [];
        let total = 0;
        const months = [];
        let lastMonth = null;

        if (data.contributions) {
            let currentWeek = [];
            data.contributions.forEach((contribution, index) => {
                const count = contribution.count || 0;
                total += count;

                currentWeek.push({
                    date: contribution.date,
                    count: count,
                    level: contribution.level
                });

                if (currentWeek.length === 7 || index === data.contributions.length - 1) {
                    weeks.push([...currentWeek]);
                    currentWeek = [];
                }
            });

            // Calculate month labels based on first day of each week
            weeks.forEach((week, weekIndex) => {
                if (week.length > 0) {
                    const firstDay = new Date(week[0].date);
                    const month = firstDay.getMonth();

                    // Only add label if it's a new month or first week
                    if (month !== lastMonth && weekIndex > 0) {
                        months.push({
                            name: firstDay.toLocaleString('en', { month: 'short' }),
                            weekIndex: weekIndex
                        });
                    } else if (weekIndex === 0) {
                        // Always show first month
                        months.push({
                            name: firstDay.toLocaleString('en', { month: 'short' }),
                            weekIndex: 0
                        });
                    }
                    lastMonth = month;
                }
            });
        }

        setContributions(weeks);
        setTotalContributions(total);
        setMonthLabels(months);
    };

    const generateFallbackData = () => {
        const weeks = [];
        const today = new Date();
        let total = 0;
        let currentWeek = [];
        const months = [];
        let lastMonth = null;

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const count = Math.floor(Math.random() * 5);
            total += count;

            currentWeek.push({
                date: date.toISOString().split('T')[0],
                count: count,
                level: count === 0 ? 0 : Math.min(count, 4)
            });

            if (currentWeek.length === 7) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        }
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        // Calculate month labels
        weeks.forEach((week, weekIndex) => {
            if (week.length > 0) {
                const firstDay = new Date(week[0].date);
                const month = firstDay.getMonth();

                if (month !== lastMonth && weekIndex > 0) {
                    months.push({
                        name: firstDay.toLocaleString('en', { month: 'short' }),
                        weekIndex: weekIndex
                    });
                } else if (weekIndex === 0) {
                    months.push({
                        name: firstDay.toLocaleString('en', { month: 'short' }),
                        weekIndex: 0
                    });
                }
                lastMonth = month;
            }
        });

        setContributions(weeks);
        setTotalContributions(total);
        setMonthLabels(months);
    };

    const getContributionColor = (level) => {
        if (isDark) {
            const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
            return colors[level] || colors[0];
        } else {
            const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
            return colors[level] || colors[0];
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDayLabels = () => ['Mon', 'Wed', 'Fri'];

    return (
        <section className="py-12 sm:py-20 px-4 sm:px-6">
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .contribution-grid {
                    min-width: fit-content;
                }
                @media (max-width: 768px) {
                    .contribution-grid {
                        transform-origin: top left;
                        transform: scale(0.9);
                    }
                }
                @media (max-width: 640px) {
                    .contribution-grid {
                        transform: scale(0.75);
                    }
                }
            `}</style>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Github className="w-6 h-6 sm:w-8 sm:h-8 text-[rgb(var(--accent))]" />
                        <h2 className="text-2xl sm:text-3xl font-bold">
                            GitHub <span className="text-[rgb(var(--accent))]">Activity</span>
                        </h2>
                    </div>
                    <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                        <span className="font-bold text-[rgb(var(--text-primary))]">{totalContributions}</span> contributions in the last year
                    </p>
                </motion.div>

                {/* Graph Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`
                        rounded-2xl p-4 sm:p-6 border transition-all duration-300
                        ${isDark ? 'bg-[#0d1117] border-white/10' : 'bg-[#f6f8fa] border-gray-200 shadow-sm'}
                    `}
                >
                    {loading ? (
                        <div className="h-40 flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-[rgb(var(--accent))] border-t-transparent rounded-full"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-2">⚠️ Failed to load data</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-xs underline text-[rgb(var(--text-secondary))]"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* Header with year selector */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs sm:text-sm font-semibold text-[rgb(var(--text-secondary))]">
                                        {totalContributions} contributions in {selectedYear === 'last' ? 'the last year' : selectedYear}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Year Selector */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowYearDropdown(!showYearDropdown)}
                                            className={`
                                                flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                                                border transition-all duration-200
                                                ${isDark
                                                    ? 'bg-[#161b22] border-white/10 hover:border-white/20 text-white'
                                                    : 'bg-white border-gray-300 hover:border-gray-400 text-gray-700'
                                                }
                                            `}
                                        >
                                            {selectedYear === 'last' ? 'Last Year' : selectedYear}
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showYearDropdown && (
                                            <div className={`
                                                absolute right-0 mt-2 py-1 rounded-lg shadow-lg z-50 min-w-[120px]
                                                border
                                                ${isDark
                                                    ? 'bg-[#161b22] border-white/10'
                                                    : 'bg-white border-gray-200'
                                                }
                                            `}>
                                                {availableYears.map((year) => (
                                                    <button
                                                        key={year}
                                                        onClick={() => {
                                                            setSelectedYear(year);
                                                            setShowYearDropdown(false);
                                                        }}
                                                        className={`
                                                            w-full text-left px-4 py-2 text-xs sm:text-sm
                                                            transition-colors duration-150
                                                            ${selectedYear === year
                                                                ? isDark
                                                                    ? 'bg-white/10 text-[rgb(var(--accent))]'
                                                                    : 'bg-gray-100 text-[rgb(var(--accent))]'
                                                                : isDark
                                                                    ? 'hover:bg-white/5 text-white'
                                                                    : 'hover:bg-gray-50 text-gray-700'
                                                            }
                                                        `}
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
                                        className="text-xs sm:text-sm flex items-center gap-1 hover:underline text-[rgb(var(--accent))]"
                                    >
                                        View Profile <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            {/* Contribution Graph */}
                            <div className="overflow-x-auto no-scrollbar">
                                <div className="contribution-grid inline-block">
                                    {/* Month Labels */}
                                    <div className="relative h-5 mb-1 ml-[30px]">
                                        {monthLabels.map((month, idx) => {
                                            const leftPosition = month.weekIndex * 13;
                                            return (
                                                <span
                                                    key={idx}
                                                    className="absolute text-[11px] text-[rgb(var(--text-secondary))]"
                                                    style={{ left: `${leftPosition}px` }}
                                                >
                                                    {month.name}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Graph with day labels */}
                                    <div className="flex gap-[3px]">
                                        {/* Day labels */}
                                        <div className="flex flex-col gap-[3px] pr-1">
                                            {['Mon', '', 'Wed', '', 'Fri', '', ''].map((label, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-[11px] flex items-center justify-end"
                                                    style={{ width: '26px' }}
                                                >
                                                    <span className="text-[9px] text-[rgb(var(--text-secondary))]">
                                                        {label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Contribution squares */}
                                        <div className="flex gap-[3px]">
                                            {contributions.map((week, wIdx) => (
                                                <div key={wIdx} className="flex flex-col gap-[3px]">
                                                    {week.map((day, dIdx) => (
                                                        <div
                                                            key={dIdx}
                                                            className="group relative w-[10px] h-[10px] rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-[rgb(var(--accent))]/50"
                                                            style={{ backgroundColor: getContributionColor(day.level) }}
                                                        >
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                                                                <div className={`text-xs whitespace-nowrap px-2 py-1.5 rounded shadow-xl border ${isDark ? 'bg-[#1c2128] text-white border-white/10' : 'bg-gray-900 text-white border-gray-700'
                                                                    }`}>
                                                                    <div className="font-semibold">
                                                                        {day.count} contribution{day.count !== 1 ? 's' : ''}
                                                                    </div>
                                                                    <div className="text-gray-400 text-[10px]">
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
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgb(var(--text-secondary))]/10">
                                <a
                                    href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] hover:underline"
                                >
                                    Learn how we count contributions
                                </a>
                                <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))]">
                                    <span>Less</span>
                                    <div className="flex gap-[3px]">
                                        {[0, 1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className="w-[10px] h-[10px] rounded-sm"
                                                style={{ backgroundColor: getContributionColor(level) }}
                                            />
                                        ))}
                                    </div>
                                    <span>More</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default GithubActivity;