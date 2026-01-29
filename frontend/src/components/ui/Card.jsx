import { useTheme } from '../../context/ThemeContext';

const Card = ({ children, className = '', title, description }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`
            rounded-2xl p-6 transition-all duration-300
            
            /* --- LIGHT MODE 3D PANEL --- */
            ${!isDark ? `
                bg-slate-100
                shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]
                border border-white/40
            ` : ''}

            /* --- DARK MODE 3D PANEL --- */
            ${isDark ? `
                bg-[#0f172a]
                shadow-[10px_10px_20px_#05080f,-10px_-10px_20px_rgba(255,255,255,0.03)]
                border border-slate-800/30
            ` : ''}

            ${className}
        `}>
            {title && (
                <div className="mb-5 pb-4 border-b border-gray-200/10 dark:border-gray-700/30">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                        {title}
                    </h3>
                    {description && (
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;