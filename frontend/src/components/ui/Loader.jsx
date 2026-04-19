import React, { useEffect, useRef } from 'react';

const SPIRAL_CONFIG = {
    rotate: false,
    particleCount: 103,
    trailSpan: 0.43,
    durationMs: 6800,
    rotationDurationMs: 28500,
    pulseDurationMs: 6800,
    strokeWidth: 4.3,
    searchTurns: 4,
    searchBaseRadius: 8,
    searchRadiusAmp: 11.3,
    searchPulse: 1.4,
    searchScale: 0.75,
    point(progress, detailScale) {
        const t = progress * Math.PI * 2;
        const angle = t * this.searchTurns;
        const radius =
            this.searchBaseRadius +
            (1 - Math.cos(t)) * (this.searchRadiusAmp + detailScale * this.searchPulse);
        return {
            x: 50 + Math.cos(angle) * radius * this.searchScale,
            y: 50 + Math.sin(angle) * radius * this.searchScale,
        };
    },
};

const Loader = ({ size = 'md', fullScreen = false }) => {
    const groupRef = useRef(null);
    const pathRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const group = groupRef.current;
        const path = pathRef.current;
        const particles = particlesRef.current;

        // ✅ safer check (don’t block rendering)
        if (!group || !path) return;

        let requestRef;
        const startedAt = performance.now();

        const normalizeProgress = (progress) => ((progress % 1) + 1) % 1;

        const getDetailScale = (time) => {
            const pulseProgress =
                (time % SPIRAL_CONFIG.pulseDurationMs) /
                SPIRAL_CONFIG.pulseDurationMs;

            const pulseAngle = pulseProgress * Math.PI * 2;

            return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
        };

        const getRotation = (time) => {
            if (!SPIRAL_CONFIG.rotate) return 0;
            return -(
                (time % SPIRAL_CONFIG.rotationDurationMs) /
                SPIRAL_CONFIG.rotationDurationMs
            ) * 360;
        };

        const buildPath = (detailScale, steps = 480) => {
            return Array.from({ length: steps + 1 }, (_, index) => {
                const point = SPIRAL_CONFIG.point(index / steps, detailScale);
                return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(
                    2
                )} ${point.y.toFixed(2)}`;
            }).join(' ');
        };

        const getParticle = (index, progress, detailScale) => {
            const tailOffset =
                index / (SPIRAL_CONFIG.particleCount - 1);

            const point = SPIRAL_CONFIG.point(
                normalizeProgress(progress - tailOffset * SPIRAL_CONFIG.trailSpan),
                detailScale
            );

            const fade = Math.pow(1 - tailOffset, 0.56);

            return {
                x: point.x,
                y: point.y,
                radius: 2 + fade * 3.5, // ✅ boosted visibility
                opacity: 0.2 + fade * 0.8, // ✅ more visible
            };
        };

        path.setAttribute(
            'stroke-width',
            String(SPIRAL_CONFIG.strokeWidth)
        );

        const renderFrame = (now) => {
            const time = now - startedAt;

            const progress =
                (time % SPIRAL_CONFIG.durationMs) /
                SPIRAL_CONFIG.durationMs;

            const detailScale = getDetailScale(time);

            group.setAttribute(
                'transform',
                `rotate(${getRotation(time)} 50 50)`
            );

            path.setAttribute('d', buildPath(detailScale));

            particles.forEach((node, index) => {
                if (!node) return;

                const p = getParticle(index, progress, detailScale);

                node.setAttribute('cx', p.x.toFixed(2));
                node.setAttribute('cy', p.y.toFixed(2));
                node.setAttribute('r', p.radius.toFixed(2));
                node.setAttribute('opacity', p.opacity.toFixed(3));
            });

            requestRef = requestAnimationFrame(renderFrame);
        };

        requestRef = requestAnimationFrame(renderFrame);

        return () => cancelAnimationFrame(requestRef);
    }, []);

    const sizes = {
        sm: 40,
        md: 70,
        lg: 100,
        xl: 140,
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
            <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                style={{ overflow: 'visible' }}
            >
                <g ref={groupRef}>
                    <path
                        ref={pathRef}
                        stroke="#3b82f6" // ✅ always visible blue
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.5"
                    />
                    {Array.from({
                        length: SPIRAL_CONFIG.particleCount,
                    }).map((_, i) => (
                        <circle
                            key={i}
                            ref={(el) =>
                                (particlesRef.current[i] = el)
                            }
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
                    background: 'rgba(0,0,0,0.4)',
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