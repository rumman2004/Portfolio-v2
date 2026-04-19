import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`
                relative cursor-pointer transition-all duration-500 border-0 outline-none
                /* Responsive sizing: smaller on mobile, normal on desktop */
                w-14 h-7 sm:w-[4.5rem] sm:h-9
                rounded-full
                /* The "Track" - Pressed In 3D Look */
                ${isDark
                    ? 'bg-[#0f172a] shadow-[inset_2px_2px_4px_#05080f,inset_-1px_-1px_3px_rgba(255,255,255,0.05)]'
                    : 'bg-slate-200 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]'
                }
            `}
        >
            {/* The "Thumb" - Extruded 3D Sphere */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`
                    absolute top-[3px] sm:top-1
                    w-[22px] h-[22px] sm:w-7 sm:h-7
                    rounded-full flex items-center justify-center
                    ${isDark ? 'left-[28px] sm:left-[36px]' : 'left-[3px] sm:left-1'}
                    
                    /* 3D Sphere Styling */
                    ${isDark
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[1px_1px_3px_#05080f,-1px_-1px_2px_rgba(255,255,255,0.15)]'
                        : 'bg-white shadow-[1px_1px_3px_#94a3b8]'
                    }
                `}
            >
                {/* Icon inside the sphere */}
                {isDark ? (
                    <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
                ) : (
                    <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
                )}
            </motion.div>
        </button>
    );
};

export default DarkModeToggle;