import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../../components/sections/Hero';
import Skills from '../../components/sections/Skills';
import GithubActivity from '../../components/sections/GithubActivity';
import Experience from '../../components/sections/Experience';
import BentoCertificates from '../../components/sections/BentoCertificates';
import BentoProjects from '../../components/sections/BentoProjects';
import Contactsection from '../../components/sections/Contactsection';
import { useFetch } from '../../hooks/useFetch';
import Loader from '../../components/ui/Loader';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { loading } = useFetch('/about');
  const mainRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    const sections = mainRef.current?.querySelectorAll('section, [data-section]');
    if (!sections?.length) return;

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 1.0,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, mainRef.current);

    return () => ctx.revert();
  }, [loading]);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );

  return (
    <main ref={mainRef} style={{ fontFamily: "'Syne', sans-serif" }}>
      <Hero />
      <Skills />
      <GithubActivity username="rumman2004" />
      <Experience />
      <BentoCertificates />
      <BentoProjects />
      <Contactsection />
    </main>
  );
};

export default Home;