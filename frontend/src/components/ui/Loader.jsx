import React, { useEffect, useRef } from 'react';

const ROSE_CONFIG = {
    rotate: true,
    particleCount: 140,
    trailSpan: 0.23,
    durationMs: 9400,
    rotationDurationMs: 55500,
    pulseDurationMs: 8600,
    strokeWidth: 2.2,

    roseA: 11.1,
    roseABoost: 1.4,
    roseBreathBase: 1.1,
    roseBreathBoost: 0.53,
    roseK: 4,
    roseScale: 2,

    point(progress, detailScale) {
        const t = progress * Math.PI * 2;

        const a = this.roseA + detailScale * this.roseABoost;
        const r =
            a *
            (this.roseBreathBase + detailScale * this.roseBreathBoost) *
            Math.cos(this.roseK * t);

        return {
            x: 50 + Math.cos(t) * r * this.roseScale,
            y: 50 + Math.sin(t) * r * this.roseScale,
        };
    },
};

const Loader = ({ size = 'sm', fullScreen = false }) => {
    const groupRef = useRef(null);
    const pathRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const group = groupRef.current;
        const path = pathRef.current;

        if (!group || !path) return;

        const particles = particlesRef.current;
        let raf;
        const start = performance.now();

        const normalize = (p) => ((p % 1) + 1) % 1;

        const getDetailScale = (time) => {
            const pulse =
                (time % ROSE_CONFIG.pulseDurationMs) /
                ROSE_CONFIG.pulseDurationMs;

            return 0.52 + ((Math.sin(pulse * Math.PI * 2 + 0.55) + 1) / 2) * 0.48;
        };

        const getRotation = (time) => {
            if (!ROSE_CONFIG.rotate) return 0;
            return -(
                (time % ROSE_CONFIG.rotationDurationMs) /
                ROSE_CONFIG.rotationDurationMs
            ) * 360;
        };

        const buildPath = (detailScale, steps = 360) => {
            return Array.from({ length: steps + 1 }, (_, i) => {
                const p = ROSE_CONFIG.point(i / steps, detailScale);
                return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
            }).join(' ');
        };

        const getParticle = (i, progress, detailScale) => {
            const tail = i / (ROSE_CONFIG.particleCount - 1);

            const p = ROSE_CONFIG.point(
                normalize(progress - tail * ROSE_CONFIG.trailSpan),
                detailScale
            );

            const fade = Math.pow(1 - tail, 0.6);

            return {
                x: p.x,
                y: p.y,
                r: 0.6 + fade * 1.8, // 🔥 smaller particles
                o: 0.08 + fade * 0.9,
            };
        };

        path.setAttribute('stroke-width', ROSE_CONFIG.strokeWidth);

        const loop = (now) => {
            const time = now - start;

            const progress =
                (time % ROSE_CONFIG.durationMs) /
                ROSE_CONFIG.durationMs;

            const detail = getDetailScale(time);

            group.setAttribute(
                'transform',
                `rotate(${getRotation(time)} 50 50)`
            );

            path.setAttribute('d', buildPath(detail));

            particles.forEach((node, i) => {
                if (!node) return;

                const p = getParticle(i, progress, detail);

                node.setAttribute('cx', p.x);
                node.setAttribute('cy', p.y);
                node.setAttribute('r', p.r);
                node.setAttribute('opacity', p.o);
            });

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    // ✅ Smaller controlled sizes
    const sizes = {
        sm: 40,
        md: 60,
        lg: 80,
    };

    const loader = (
        <div
            style={{
                width: sizes[size],
                height: sizes[size],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <g ref={groupRef}>
                    <path
                        ref={pathRef}
                        stroke="#3b82f6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.15"
                    />
                    {Array.from({ length: ROSE_CONFIG.particleCount }).map((_, i) => (
                        <circle
                            key={i}
                            ref={(el) => (particlesRef.current[i] = el)}
                            fill="#3b82f6"
                        />
                    ))}
                </g>
            </svg>
        </div>
    );

    if (fullScreen) {
        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#050505',
                    zIndex: 9999,
                }}
            >
                {loader}
            </div>
        );
    }

    return loader;
};

export default Loader;