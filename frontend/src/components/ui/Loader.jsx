import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Loader = ({ size = 'md', fullScreen = false }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const sizes = {
        sm: 'w-6 h-6 p-1',
        md: 'w-12 h-12 p-3',
        lg: 'w-16 h-16 p-4',
        xl: 'w-24 h-24 p-6',
    };

    const loader = (
        <div className={`
            rounded-full flex items-center justify-center
            /* The "Pressed" 3D Look */
            ${!isDark ? 'bg-slate-100 shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]' : ''}
            ${isDark ? 'bg-[#0f172a] shadow-[inset_4px_4px_8px_#05080f,inset_-2px_-2px_6px_rgba(255,255,255,0.05)]' : ''}
            
            ${sizes[size]}
        `}>
            <Loader2 className="w-full h-full animate-spin text-blue-500 opacity-80" />
        </div>
    );

    if (fullScreen) {
        return (
            <div className={`
                fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm
                ${isDark ? 'bg-[#0f172a]/80' : 'bg-slate-100/80'}
            `}>
                {loader}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            {loader}
        </div>
    );
};

export default Loader;