import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            onClick={toggleTheme}
            className={`
                relative w-20 h-10 rounded-full cursor-pointer transition-all duration-500
                /* The "Track" - Pressed In 3D Look */
                ${isDark
                    ? 'bg-[#0f172a] shadow-[inset_3px_3px_6px_#05080f,inset_-2px_-2px_4px_rgba(255,255,255,0.05)]'
                    : 'bg-slate-200 shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]'
                }
            `}
        >
            {/* The "Thumb" - Extruded 3D Sphere */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`
                    absolute top-1 bottom-1 w-8 h-8 rounded-full flex items-center justify-center
                    ${isDark ? 'left-11' : 'left-1'}
                    
                    /* 3D Sphere Styling */
                    ${isDark
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[2px_2px_5px_#05080f,-1px_-1px_3px_rgba(255,255,255,0.2)]'
                        : 'bg-white shadow-[2px_2px_5px_#94a3b8]'
                    }
                `}
            >
                {/* Icon inside the sphere */}
                {isDark ? (
                    <Moon className="w-4 h-4 text-white fill-white" />
                ) : (
                    <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                )}
            </motion.div>
        </div>
    );
};

export default DarkModeToggle;