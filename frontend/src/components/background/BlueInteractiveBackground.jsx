import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext'; // Check your path to context

// --- CUSTOM SHADER FOR THE GLOWING HORIZON ---
// This creates that smooth "atmosphere" fade effect from your image
const vertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 color;
uniform vec3 glowColor;
varying vec3 vNormal;

void main() {
  // Calculate intensity based on the angle of the surface to the camera (Fresnel effect)
  float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
  
  // Mix the base color with the glow
  vec3 finalColor = mix(color, glowColor, intensity * 2.0);
  
  // Fade out opacity at the edges
  gl_FragColor = vec4(finalColor, 1.0) + vec4(glowColor, intensity);
}
`;

function HorizonSphere({ theme }) {
    const mesh = useRef();

    // Define colors based on theme
    const colors = useMemo(() => {
        return theme === 'dark'
            ? { base: new THREE.Color('#020617'), glow: new THREE.Color('#3b82f6') } // Dark Slate + Blue Glow
            : { base: new THREE.Color('#f1f5f9'), glow: new THREE.Color('#0ea5e9') }; // Light Slate + Sky Glow
    }, [theme]);

    // Uniforms for the shader
    const uniforms = useMemo(
        () => ({
            color: { value: colors.base },
            glowColor: { value: colors.glow },
        }),
        [colors]
    );

    useFrame((state) => {
        // 1. ROTATE ON SCROLL & TIME
        // Get scroll position from the DOM body (works without ScrollControls wrapper)
        const scrollY = window.scrollY;
        const scrollMax = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / (scrollMax || 1);

        // Continuous slow rotation
        mesh.current.rotation.z += 0.0005;

        // Interactive rotation based on scroll (Flying over the planet)
        mesh.current.rotation.x = scrollProgress * 0.5 + 0.2;
    });

    return (
        <mesh ref={mesh} position={[0, -4.5, -2]} scale={[6, 6, 6]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

function SceneContent() {
    const { theme } = useTheme();

    return (
        <>
            <HorizonSphere theme={theme} />

            {/* Floating Particles/Stars */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Stars
                    radius={50}
                    depth={50}
                    count={theme === 'dark' ? 3000 : 500} // Fewer stars in light mode
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
            </Float>

            {/* Lighting (Subtle) */}
            <ambientLight intensity={0.5} />
        </>
    );
}

const BlueInteractiveBackground = () => {
    const { theme } = useTheme();

    // Background CSS color to match the "Void"
    const bgStyle = {
        backgroundColor: theme === 'dark' ? '#020617' : '#ffffff', // Slate-950 vs White
        transition: 'background-color 0.5s ease',
    };

    return (
        <div
            className="fixed inset-0 -z-50 w-full h-full transition-colors duration-500"
            style={bgStyle}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]} // Handle high-res screens
                gl={{ antialias: true, alpha: true }}
            >
                <SceneContent />
            </Canvas>

            {/* Overlay Gradient to blend the 3D edge smoothly into the page content */}
            <div
                className={`absolute inset-0 pointer-events-none bg-gradient-to-b 
          ${theme === 'dark'
                        ? 'from-transparent via-slate-950/20 to-slate-950'
                        : 'from-transparent via-white/20 to-white'}
        `}
            />
        </div>
    );
};

export default BlueInteractiveBackground;