import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, ScrollControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- BUBBLE COMPONENT ---
function Bubbles({ count = 40, theme }) {
    const mesh = useRef();
    const { viewport, pointer } = useThree();

    // Generate random initial positions and speeds for bubbles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    // Determine colors based on theme
    const materialProps = useMemo(() => {
        return theme === 'dark'
            ? {
                color: "#4f46e5", // Indigo-600
                emissive: "#312e81", // Indigo-900 (Glow)
                roughness: 0.1,
                metalness: 0.8,
                transparent: true,
                opacity: 0.6,
            }
            : {
                color: "#bae6fd", // Sky-200
                emissive: "#f0f9ff", // Sky-50
                roughness: 0.2,
                metalness: 0.1,
                transparent: true,
                opacity: 0.4,
            };
    }, [theme]);

    // Loop to animate every frame
    useFrame((state) => {
        // Scroll offset (0 to 1)
        const scrollY = window.scrollY;
        const scrollMax = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / (scrollMax || 1);

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

            // Update time
            t = particle.t += speed / 2;

            // Calculate basic floating movement (Lissajous curve for organic feel)
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Apply Scroll Interaction (Parallax)
            // Bubbles move UP as you scroll DOWN
            const scrollShift = scrollProgress * 15;

            // Apply Mouse Interaction
            // Calculate distance from pointer to this bubble
            // (This is a simplified approximation for performance)
            particle.mx += (pointer.x * viewport.width - particle.mx) * 0.02;
            particle.my += (pointer.y * viewport.height - particle.my) * 0.02;

            // Update dummy object position
            const dummy = new THREE.Object3D();
            dummy.position.set(
                (particle.mx / 10) + a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) + b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10 + scrollShift,
                b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Scale based on "breathing" effect
            const scale = 1 + Math.cos(t) * 0.2;
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();

            // Apply to the InstancedMesh at index i
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial {...materialProps} />
        </instancedMesh>
    );
}

const GlowingBubblesBackground = () => {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-700"
            style={{
                background: theme === 'dark'
                    ? 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)' // Deep Indigo Void
                    : 'radial-gradient(circle at 50% 50%, #f0f9ff 0%, #e0f2fe 100%)' // Soft Water White
            }}
        >
            <Canvas camera={{ position: [0, 0, 50], fov: 75 }} dpr={[1, 2]}>
                {/* Lights */}
                <ambientLight intensity={theme === 'dark' ? 0.5 : 1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color={theme === 'dark' ? "#818cf8" : "#38bdf8"} />
                <pointLight position={[-10, -10, -10]} intensity={theme === 'dark' ? 2 : 1} color={theme === 'dark' ? "#4f46e5" : "#bae6fd"} />

                {/* The Bubbles */}
                <Bubbles count={50} theme={theme} />

                {/* Environment Reflections for "Glass" look */}
                <Environment preset={theme === 'dark' ? "city" : "studio"} />
            </Canvas>
        </div>
    );
};

export default GlowingBubblesBackground;