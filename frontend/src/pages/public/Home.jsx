import Hero from '../../components/sections/Hero';
import Skills from '../../components/sections/Skills';
import GithubActivity from '../../components/sections/GithubActivity';
import Experience from '../../components/sections/Experience';
import BentoCertificates from '../../components/sections/BentoCertificates';
import BentoProjects from '../../components/sections/BentoProjects';
import Contactsection from '../../components/sections/Contactsection';
import { useFetch } from '../../hooks/useFetch';
import Loader from '../../components/ui/Loader';

const Home = () => {
    const { loading } = useFetch('/about');
    if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
    return (
        <main>
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