import { useTheme } from '../../context/ThemeContext';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 1. Map variants to Text Colors
    const colors = {
        default: isDark ? 'text-slate-300' : 'text-slate-600',
        success: isDark ? 'text-emerald-400' : 'text-emerald-600',
        warning: isDark ? 'text-amber-400' : 'text-amber-600',
        danger: isDark ? 'text-rose-400' : 'text-rose-600',
        info: isDark ? 'text-blue-400' : 'text-blue-600',
    };

    return (
        <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide
            transition-all duration-300
            
            /* --- LIGHT MODE (Soft Extrusion) --- */
            ${!isDark ? `
                bg-slate-100 
                shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff]
            ` : ''}

            /* --- DARK MODE (Deep Extrusion) --- */
            ${isDark ? `
                bg-[#0f172a]
                shadow-[4px_4px_8px_#05080f,-3px_-3px_6px_rgba(255,255,255,0.05)]
                border border-slate-800/50
            ` : ''}

            ${colors[variant] || colors.default}
            ${className}
        `}>
            {/* Optional: Small glowing dot indicator based on variant */}
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${variant === 'default' ? 'bg-slate-400' :
                    variant === 'success' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)]' :
                        variant === 'warning' ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.6)]' :
                            variant === 'danger' ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.6)]' :
                                'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]'
                }`} />

            {children}
        </span>
    );
};

export default Badge;