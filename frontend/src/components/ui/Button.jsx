import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    className = '',
    glowColor,
    ...props
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Base Structure
    const baseStyles = "relative inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden tracking-wide";

    // Variants with Liquid Glass 3D Effect
    const variants = {
        // PRIMARY: Liquid Glass 3D Effect (Like Reference Image)
        primary: `
            text-white border-0
            /* Purple Gradient Background */
            bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6]
            
            /* Multi-layer Shadow Stack for 3D Glass Effect */
            shadow-[
                /* Inner Top Highlight - Glass Reflection */
                inset_0_1px_0_0_rgba(255,255,255,0.5),
                inset_0_2px_12px_0_rgba(255,255,255,0.3),
                /* Inner Bottom Shadow - Depth */
                inset_0_-2px_8px_0_rgba(0,0,0,0.25),
                /* Subtle Inner Glow */
                inset_0_0_20px_0_rgba(147,51,234,0.4),
                /* Outer Glow - Purple Aura */
                0_4px_20px_-4px_rgba(139,92,246,0.6),
                0_8px_30px_-6px_rgba(139,92,246,0.4)
            ]

            /* Hover: Enhanced Glow & Lift */
            hover:shadow-[
                inset_0_1px_0_0_rgba(255,255,255,0.7),
                inset_0_3px_16px_0_rgba(255,255,255,0.4),
                inset_0_-2px_8px_0_rgba(0,0,0,0.2),
                inset_0_0_25px_0_rgba(147,51,234,0.5),
                0_6px_25px_-4px_rgba(139,92,246,0.8),
                0_12px_40px_-6px_rgba(139,92,246,0.6)
            ]
            hover:-translate-y-[2px]
            hover:brightness-110

            /* Active: Pressed Effect */
            active:translate-y-[1px]
            active:shadow-[
                inset_0_3px_12px_0_rgba(0,0,0,0.4),
                0_2px_10px_-2px_rgba(139,92,246,0.5)
            ]
            active:brightness-95

            /* Subtle Scale on Hover */
            hover:scale-[1.02]
        `,

        // Secondary (Clean, adaptive)
        secondary: `
            ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}
            border border-transparent
            shadow-[
                inset_0_1px_0_0_rgba(255,255,255,0.3),
                0_2px_8px_-2px_rgba(0,0,0,0.1)
            ]
            hover:bg-[rgb(var(--accent))]/10 
            hover:text-[rgb(var(--accent))]
            hover:shadow-[0_4px_12px_-2px_rgba(var(--accent),0.2)]
            backdrop-blur-md
        `,

        // Outline
        outline: `
            border-2 border-[rgb(var(--accent))] 
            text-[rgb(var(--accent))] 
            bg-transparent
            hover:bg-[rgb(var(--accent))] 
            hover:text-white
            shadow-[0_0_15px_rgba(var(--accent),0.3)]
            hover:shadow-[
                inset_0_1px_0_0_rgba(255,255,255,0.3),
                0_0_25px_rgba(var(--accent),0.5)
            ]
        `,

        // Danger
        danger: `
            bg-gradient-to-br from-red-500 via-red-600 to-red-700
            text-white
            shadow-[
                inset_0_1px_0_0_rgba(255,255,255,0.4),
                inset_0_-2px_6px_0_rgba(0,0,0,0.2),
                0_4px_15px_-2px_rgba(239,68,68,0.5)
            ]
            hover:shadow-[
                inset_0_1px_0_0_rgba(255,255,255,0.6),
                0_6px_20px_-2px_rgba(239,68,68,0.7)
            ]
            hover:-translate-y-[2px]
        `,
    };

    // Sizes
    const sizes = {
        sm: "px-4 py-1.5 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading}
            {...props}
        >
            {/* Glass Overlay - Top Shine Effect */}
            {variant === 'primary' && (
                <>
                    {/* Top Glass Reflection */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[45%] rounded-full 
                        bg-gradient-to-b from-white/30 via-white/10 to-transparent 
                        opacity-100 pointer-events-none"
                    />

                    {/* Bottom Subtle Shadow */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[30%] rounded-full 
                        bg-gradient-to-t from-black/20 to-transparent 
                        pointer-events-none"
                    />

                    {/* Animated Shimmer Effect (Optional) */}
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)',
                            backgroundSize: '200% 200%',
                        }}
                        animate={{
                            backgroundPosition: ['0% 0%', '200% 200%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </>
            )}

            {/* Content Layer */}
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : Icon ? (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : null}
                {children}
            </span>
        </motion.button>
    );
};

export default Button;