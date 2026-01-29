import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const GlassCard = ({ children, className = '', hover = true, ...props }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -8, scale: 1.01 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
                rounded-2xl p-6 relative overflow-hidden group
                transition-all duration-300

                /* --- LIGHT MODE --- */
                ${!isDark ? `
                    bg-slate-100
                    shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff]
                    hover:shadow-[15px_15px_30px_#cbd5e1,-15px_-15px_30px_#ffffff]
                ` : ''}

                /* --- DARK MODE --- */
                ${isDark ? `
                    bg-[#0f172a]
                    shadow-[8px_8px_16px_#05080f,-8px_-8px_16px_rgba(255,255,255,0.03)]
                    hover:shadow-[12px_12px_24px_#05080f,-12px_-12px_24px_rgba(255,255,255,0.05)]
                    border border-slate-800/50
                ` : ''}

                ${className}
            `}
            {...props}
        >
            {/* Optional: Slight sheen effect on hover */}
            <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                bg-gradient-to-tr from-transparent via-white/5 to-transparent
            `} />

            {children}
        </motion.div>
    );
};

export default GlassCard;