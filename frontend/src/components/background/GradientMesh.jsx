import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const GradientMesh = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Beautiful gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: isDark
                        ? 'linear-gradient(to bottom right, #020617 0%, #0f172a 30%, #1e1b4b 50%, #0f172a 70%, #020617 100%)'
                        : 'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 25%, #fdf4ff 50%, #f0f9ff 75%, #dbeafe 100%)',
                }}
            />

            {/* Soft overlay pattern for light theme */}
            {!isDark && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`,
                    }}
                />
            )}

            {/* Dark theme radial gradients */}
            {isDark && (
                <>
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(30, 27, 75, 0.5) 0%, transparent 100%)',
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
                        }}
                    />
                </>
            )}

            {/* Animated gradient orbs - more vibrant for light theme */}
            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    width: isDark ? '500px' : '600px',
                    height: isDark ? '500px' : '600px',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    top: isDark ? '10%' : '5%',
                    left: isDark ? '10%' : '15%',
                    opacity: isDark ? 0.45 : 0.8,
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    width: isDark ? '600px' : '700px',
                    height: isDark ? '600px' : '700px',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
                    bottom: isDark ? '10%' : '5%',
                    right: isDark ? '10%' : '10%',
                    opacity: isDark ? 0.35 : 0.9,
                }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute rounded-full blur-3xl"
                style={{
                    width: isDark ? '400px' : '500px',
                    height: isDark ? '400px' : '500px',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: isDark ? 0.3 : 0.85,
                }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Additional light theme orb for more depth */}
            {!isDark && (
                <motion.div
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: '550px',
                        height: '550px',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                        top: '30%',
                        left: '5%',
                        opacity: 0.7,
                    }}
                    animate={{
                        x: [0, 40, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            )}
        </div>
    );
};

export default GradientMesh;
