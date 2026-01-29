import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FloatingShapes = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Reduced to 6 shapes for cleaner look
    const shapes = [
        // Circles
        { type: 'circle', size: 150, top: '8%', left: '12%', delay: 0, duration: 20 },
        { type: 'circle', size: 120, top: '70%', left: '8%', delay: 2, duration: 18 },

        // Squares
        { type: 'square', size: 130, top: '15%', right: '10%', delay: 1.5, duration: 25 },
        { type: 'square', size: 100, top: '75%', left: '80%', delay: 0.5, duration: 19 },

        // Triangles
        { type: 'triangle', size: 120, top: '50%', right: '12%', delay: 2.5, duration: 21 },
        { type: 'triangle', size: 100, top: '85%', left: '45%', delay: 1, duration: 23 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            {shapes.map((shape, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        top: shape.top,
                        left: shape.left,
                        right: shape.right,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        rotate: shape.type === 'square' ? [0, 180, 360] : [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        delay: shape.delay,
                        ease: "easeInOut",
                    }}
                >
                    {shape.type === 'circle' && (
                        <div
                            className={`rounded-full backdrop-blur-sm border-2 ${isDark
                                    ? 'bg-white/5 border-white/15'
                                    : 'bg-slate-900/8 border-slate-900/20'
                                }`}
                            style={{
                                width: shape.size,
                                height: shape.size,
                                boxShadow: isDark
                                    ? '0 0 60px rgba(255, 255, 255, 0.08), inset 0 0 30px rgba(255, 255, 255, 0.03)'
                                    : '0 0 60px rgba(15, 23, 42, 0.12), inset 0 0 30px rgba(15, 23, 42, 0.05)',
                            }}
                        />
                    )}

                    {shape.type === 'square' && (
                        <div
                            className={`rounded-xl backdrop-blur-sm border-2 ${isDark
                                    ? 'bg-white/5 border-white/15'
                                    : 'bg-slate-900/8 border-slate-900/20'
                                }`}
                            style={{
                                width: shape.size,
                                height: shape.size,
                                boxShadow: isDark
                                    ? '0 0 60px rgba(255, 255, 255, 0.08), inset 0 0 30px rgba(255, 255, 255, 0.03)'
                                    : '0 0 60px rgba(15, 23, 42, 0.12), inset 0 0 30px rgba(15, 23, 42, 0.05)',
                            }}
                        />
                    )}

                    {shape.type === 'triangle' && (
                        <div
                            className="relative"
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: `${shape.size / 2}px solid transparent`,
                                borderRight: `${shape.size / 2}px solid transparent`,
                                borderBottom: `${shape.size}px solid ${isDark
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(15, 23, 42, 0.12)'
                                    }`,
                                filter: `drop-shadow(0 0 40px ${isDark
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(15, 23, 42, 0.12)'
                                    })`,
                            }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingShapes;
