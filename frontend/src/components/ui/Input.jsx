import { forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full group">
            {/* Label with slight transition */}
            {label && (
                <label className={`
                    block text-sm font-semibold mb-2 ml-1 transition-colors duration-300
                    ${isDark ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-600'}
                `}>
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Icon */}
                {Icon && (
                    <div className={`
                        absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none
                        ${isDark ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}
                    `}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                {/* The Neumorphic Input Field */}
                <input
                    ref={ref}
                    className={`
                        w-full px-5 py-3.5
                        ${Icon ? 'pl-12' : ''}
                        rounded-2xl font-medium outline-none transition-all duration-300
                        
                        /* --- LIGHT MODE STYLES --- */
                        ${!isDark ? `
                            bg-slate-100 text-slate-700 placeholder:text-slate-400
                            border border-transparent
                            /* Deep Inner Shadow for "Pressed" look */
                            shadow-[inset_2px_2px_6px_rgba(163,177,198,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]
                            /* Focus State */
                            focus:bg-white
                            focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5),0_10px_20px_-5px_rgba(59,130,246,0.15)]
                        ` : ''}

                        /* --- DARK MODE STYLES --- */
                        ${isDark ? `
                            bg-[#0f172a] text-slate-200 placeholder:text-slate-600
                            border border-slate-800
                            /* Dark Inner Shadow */
                            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]
                            /* Focus State */
                            focus:border-blue-500/50
                            focus:shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_0_15px_rgba(59,130,246,0.2)]
                        ` : ''}
                        
                        ${error ? '!border-red-500 !shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1.5 ml-1 text-sm text-red-500 font-medium flex items-center gap-1 animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;