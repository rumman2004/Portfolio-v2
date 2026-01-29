import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const StarsBackground = () => {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const isDark = theme === 'dark';
        const starColor = isDark
            ? { r: 255, g: 255, b: 255 }
            : { r: 99, g: 102, b: 241 };

        // More stars, more visible
        const stars = Array.from({ length: isDark ? 250 : 180 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * (isDark ? 1.8 : 2.2),
            velocity: Math.random() * (isDark ? 0.35 : 0.25),
            opacity: Math.random() * (isDark ? 1 : 0.7) + (isDark ? 0 : 0.2),
            fadeDirection: Math.random() > 0.5 ? 1 : -1,
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, ${star.opacity})`;
                ctx.fill();

                // Enhanced glow
                if (!isDark) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, 0.4)`;
                } else {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, 0.3)`;
                }

                // Twinkle effect
                star.opacity += 0.012 * star.fadeDirection;
                if (star.opacity <= (isDark ? 0.1 : 0.3) || star.opacity >= (isDark ? 1 : 0.9)) {
                    star.fadeDirection *= -1;
                }

                // Move stars
                star.y += star.velocity;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                ctx.shadowBlur = 0;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
        />
    );
};

export default StarsBackground;
