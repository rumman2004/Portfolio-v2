import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

function StarField({ theme }) {
    const points = useRef();

    // 1. Create 2000 random stars/dots
    const particleCount = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 60;     // x spread
            pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // y spread
            pos[i * 3 + 2] = (Math.random() - 0.5) * 60; // z spread
        }
        return pos;
    }, []);

    useFrame((state) => {
        // 2. SCROLL INTERACTION
        // We grab the scroll position directly from the window
        const scrollY = window.scrollY;

        // Rotate the entire galaxy based on how far you have scrolled
        // This creates the "Interactive Scrolling Effect"
        points.current.rotation.y = scrollY * 0.0005; // Spin horizontally
        points.current.rotation.x = scrollY * 0.0002; // Tilt vertically

        // 3. IDLE ANIMATION
        // Gently rotate even when not scrolling
        points.current.rotation.z += 0.0003;
    });

    // Theme Colors: Bright Blue for Dark Mode, Subtle Gray for Light Mode
    const starColor = theme === 'dark' ? '#60a5fa' : '#94a3b8';

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}             // Size of dots
                color={starColor}       // Theme color
                transparent
                opacity={theme === 'dark' ? 0.8 : 0.6}
                sizeAttenuation={true}  // Dots get smaller when further away
            />
        </points>
    );
}

const SimpleBackground = () => {
    const { theme } = useTheme();

    // Background Color Transition
    const bgStyle = {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', // Slate-900 vs White
        transition: 'background-color 0.5s ease',
    };

    return (
        <div style={bgStyle} className="fixed inset-0 -z-50 w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <StarField theme={theme} />
            </Canvas>
        </div>
    );
};

export default SimpleBackground;