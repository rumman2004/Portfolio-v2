import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FloatingElements = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const elements = [
        { size: 'w-64 h-64', delay: 0, duration: 20, x: '10%', y: '20%' },
        { size: 'w-96 h-96', delay: 2, duration: 25, x: '70%', y: '60%' },
        { size: 'w-48 h-48', delay: 4, duration: 18, x: '50%', y: '80%' },
        { size: 'w-80 h-80', delay: 1, duration: 22, x: '85%', y: '15%' },
        { size: 'w-56 h-56', delay: 3, duration: 19, x: '20%', y: '70%' },
    ];

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {elements.map((el, index) => (
                <motion.div
                    key={index}
                    className={`absolute ${el.size} rounded-full`}
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.25) 100%)',
                        left: el.x,
                        top: el.y,
                        opacity: isDark ? 0.4 : 0.7,
                        filter: isDark ? 'blur(60px)' : 'blur(50px)',
                        boxShadow: isDark
                            ? '0 0 100px rgba(99, 102, 241, 0.3)'
                            : '0 0 120px rgba(99, 102, 241, 0.4), 0 0 80px rgba(139, 92, 246, 0.3)',
                    }}
                    animate={{
                        x: [0, 100, 0, -100, 0],
                        y: [0, -100, 0, 100, 0],
                        scale: [1, 1.2, 1, 0.8, 1],
                    }}
                    transition={{
                        duration: el.duration,
                        delay: el.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingElements;
