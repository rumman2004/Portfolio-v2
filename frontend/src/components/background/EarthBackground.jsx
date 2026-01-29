import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- SHADERS FOR DARK MODE (The Glowing Horizon) ---
const vertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 glowColor;
uniform vec3 biasColor;
uniform float power;
varying vec3 vNormal;

void main() {
  // Calculate the "Rim" effect (Fresnel)
  float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), power);
  
  // Mix the glowing edge with the dark center
  vec3 finalColor = glowColor * intensity + biasColor;
  
  // Fade out the alpha at the edges for smoothness
  gl_FragColor = vec4(finalColor, intensity * 1.5);
}
`;

// --- THE EARTH MESH ---
function Earth({ theme }) {
    const meshRef = useRef();

    // Configuration based on theme
    const config = useMemo(() => {
        return theme === 'dark'
            ? {
                // DARK MODE: Glowing Atmosphere
                isShader: true,
                uniforms: {
                    glowColor: { value: new THREE.Color('#3b82f6') }, // Blue-500
                    biasColor: { value: new THREE.Color('#020617') }, // Slate-950
                    power: { value: 4.0 } // How sharp the rim is
                },
                scale: 2.5
            }
            : {
                // LIGHT MODE: White Clay Style
                isShader: false,
                color: '#f8fafc', // Slate-50
                emissive: '#e2e8f0', // Slate-200
                roughness: 0.8, // Matte clay look
                metalness: 0.1,
                scale: 2.2
            };
    }, [theme]);

    useFrame(() => {
        if (!meshRef.current) return;

        // 1. SCROLL INTERACTION
        // Calculate scroll percentage (0.0 to 1.0)
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / (maxScroll || 1);

        // Rotate Earth based on Scroll
        meshRef.current.rotation.y = scrollProgress * Math.PI * 2; // Full spin
        meshRef.current.rotation.x = scrollProgress * 0.5; // Slight tilt

        // 2. AUTO ROTATION (Idle spin)
        meshRef.current.rotation.y += 0.001;
    });

    return (
        <mesh ref={meshRef} position={[0, -1.5, 0]} scale={[config.scale, config.scale, config.scale]}>
            <sphereGeometry args={[1, 64, 64]} />

            {config.isShader ? (
                // DARK MODE MATERIAL (Shader)
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={config.uniforms}
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    side={THREE.FrontSide}
                />
            ) : (
                // LIGHT MODE MATERIAL (Physical Clay)
                <meshStandardMaterial
                    color={config.color}
                    roughness={config.roughness}
                    metalness={config.metalness}
                // To get the "Topography" (mountains) shown in your image,
                // you would uncomment the line below and add a displacement map texture:
                // displacementMap={texture} 
                // displacementScale={0.1}
                />
            )}
        </mesh>
    );
}

// --- MAIN COMPONENT ---
const EarthBackground = () => {
    const { theme } = useTheme();

    return (
        <div
            className="fixed inset-0 -z-50 w-full h-full transition-colors duration-700"
            style={{
                background: theme === 'dark'
                    ? 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' // Dark Space
                    : '#ffffff' // Clean White
            }}
        >
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
                {/* Lights (Critical for the Light Mode "Clay" look) */}
                <ambientLight intensity={theme === 'dark' ? 0.1 : 0.7} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={theme === 'dark' ? 0 : 1.5}
                    castShadow
                />
                <directionalLight
                    position={[-5, 5, -5]}
                    intensity={theme === 'dark' ? 0 : 0.5}
                    color="#bae6fd" // Soft blue backlight for white clay
                />

                {/* The Earth */}
                <Earth theme={theme} />

                {/* Stars (Only visible in Dark Mode) */}
                {theme === 'dark' && (
                    <Stars
                        radius={100}
                        depth={50}
                        count={3000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={1}
                    />
                )}
            </Canvas>
        </div>
    );
};

export default EarthBackground;