import { useTheme } from '../../context/ThemeContext';
import ParticlesBackground from './ParticlesBackground';
import FloatingElements from './FloatingElements';
import GradientMesh from './GradientMesh';
import StarsBackground from './StarsBackground';
import InteractiveParticles from './InteractiveParticles';

const AnimatedBackground = ({ type = 'combined' }) => {
    const { theme } = useTheme();

    const backgrounds = {
        particles: <ParticlesBackground />,
        floating: <FloatingElements />,
        gradient: <GradientMesh />,
        stars: <StarsBackground />,
        interactive: (
            <>
                <GradientMesh />
                <InteractiveParticles />
            </>
        ),
        combined: (
            <>
                <GradientMesh />
                <InteractiveParticles />
                {theme === 'dark'}
            </>
        ),
        elegant: (
            <>
                <GradientMesh />
                <InteractiveParticles />
            </>
        ),
        minimal: <GradientMesh />,
    };

    return backgrounds[type] || backgrounds.combined;
};

export default AnimatedBackground;
