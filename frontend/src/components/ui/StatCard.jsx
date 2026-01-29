import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const colorStyles = {
        blue: isDark ? 'text-blue-400' : 'text-blue-600',
        purple: isDark ? 'text-purple-400' : 'text-purple-600',
        green: isDark ? 'text-emerald-400' : 'text-emerald-600',
        orange: isDark ? 'text-orange-400' : 'text-orange-600',
    };

    return (
        <div className={`
            relative p-6 rounded-2xl transition-all duration-300
            /* Main 3D Card Body */
            ${isDark
                ? 'bg-[#0f172a] shadow-[10px_10px_20px_#05080f,-10px_-10px_20px_rgba(255,255,255,0.03)] border border-slate-800/50'
                : 'bg-slate-100 shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff] border border-white/50'
            }
        `}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {title}
                    </p>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                        {value}
                    </h3>

                    {trend && (
                        <p className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trend > 0 ? '+' : ''}{trend}% from last month
                        </p>
                    )}
                </div>

                {/* The 3D Icon Well */}
                <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center
                    /* Pressed In Look */
                    ${isDark
                        ? 'bg-[#0f172a] shadow-[inset_4px_4px_8px_#05080f,inset_-2px_-2px_4px_rgba(255,255,255,0.05)]'
                        : 'bg-slate-100 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]'
                    }
                `}>
                    <Icon className={`w-7 h-7 ${colorStyles[color]}`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;