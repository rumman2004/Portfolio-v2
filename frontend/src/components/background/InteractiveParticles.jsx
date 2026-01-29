import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const InteractiveParticles = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isDark = theme === 'dark';

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();

        // Initialize particles AFTER canvas is sized
        const particleCount = 100;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
        }));

        const handleResize = () => {
            resizeCanvas();
            // Reinitialize particles on resize
            particlesRef.current = Array.from({ length: particleCount }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
            }));
        };

        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas || !particlesRef.current.length) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Mouse interaction - repel particles
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx -= (dx / distance) * force * 0.1;
                    particle.vy -= (dy / distance) * force * 0.1;
                }

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Friction
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Keep in bounds
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));

                // Draw particle with glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = isDark
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'rgba(59, 130, 246, 0.4)';

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                    ? `rgba(99, 102, 241, ${0.4 + Math.random() * 0.3})`
                    : `rgba(59, 130, 246, ${0.3 + Math.random() * 0.3})`;
                ctx.fill();

                ctx.shadowBlur = 0;

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const otherParticle = particles[j];
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        const opacity = (1 - distance / 120) * 0.3;
                        ctx.strokeStyle = isDark
                            ? `rgba(139, 92, 246, ${opacity})`
                            : `rgba(96, 165, 250, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            // Draw floating geometric shapes
            const time = Date.now() * 0.0005;

            // Circle 1
            ctx.beginPath();
            ctx.arc(
                canvas.width * 0.2 + Math.sin(time) * 50,
                canvas.height * 0.3 + Math.cos(time * 0.8) * 50,
                100,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = isDark
                ? 'rgba(59, 130, 246, 0.05)'
                : 'rgba(96, 165, 250, 0.04)';
            ctx.fill();

            // Circle 2
            ctx.beginPath();
            ctx.arc(
                canvas.width * 0.8 + Math.cos(time * 1.2) * 70,
                canvas.height * 0.6 + Math.sin(time) * 70,
                150,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = isDark
                ? 'rgba(168, 85, 247, 0.05)'
                : 'rgba(147, 197, 253, 0.04)';
            ctx.fill();

            // Circle 3
            ctx.beginPath();
            ctx.arc(
                canvas.width * 0.5 + Math.sin(time * 1.5) * 60,
                canvas.height * 0.7 + Math.cos(time * 1.3) * 60,
                120,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = isDark
                ? 'rgba(139, 92, 246, 0.04)'
                : 'rgba(129, 140, 248, 0.03)';
            ctx.fill();

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: 0,
                opacity: 0.6
            }}
        />
    );
};

export default InteractiveParticles;
