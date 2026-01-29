import Hero from '../../components/sections/Hero';
import Skills from '../../components/sections/Skills';
import GithubActivity from '../../components/sections/GithubActivity';
import Experience from '../../components/sections/Experience';
import BentoCertificates from '../../components/sections/BentoCertificates';
import BentoProjects from '../../components/sections/BentoProjects';
import Contactsection from '../../components/sections/Contactsection';

const Home = () => {
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