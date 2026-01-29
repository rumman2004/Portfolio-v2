import { useTheme } from '../../context/ThemeContext';

const TableContainer = ({ children, title }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`
            rounded-3xl p-1 overflow-hidden
            /* The Outer 3D Frame */
            ${isDark
                ? 'bg-[#0f172a] shadow-[10px_10px_20px_#05080f,-10px_-10px_20px_rgba(255,255,255,0.03)] border border-slate-800'
                : 'bg-slate-100 shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] border border-white'
            }
        `}>
            {title && (
                <div className={`px-6 py-4 font-bold text-lg border-b ${isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
                    {title}
                </div>
            )}

            {/* The Inner "Screen" area */}
            <div className={`
                w-full overflow-x-auto rounded-2xl
                ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50/50'}
            `}>
                {children}
            </div>
        </div>
    );
};

export default TableContainer;