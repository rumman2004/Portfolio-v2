import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { experienceAPI } from '../../services/api';
import { NeuCard } from '../ui'; // Use the UI component correctly
import { useTheme } from '../../context/ThemeContext';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const response = await experienceAPI.getAll();
        setExperiences(response.data.data);
      } catch (error) {
        console.error("Failed to fetch experience", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  if (loading || experiences.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 border backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10 text-[rgb(var(--accent))]' : 'bg-white/60 border-slate-200 text-slate-800'
              }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Professional Journey</span>
          </motion.div>

          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500">Experience</span>
          </h2>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[rgb(var(--accent))] via-purple-500 to-transparent opacity-20 -translate-x-1/2 hidden md:block" />

          <div className="flex flex-col gap-12">
            {experiences.map((exp, index) => (
              <div
                key={exp._id}
                className={`flex flex-col md:flex-row items-center justify-between w-full ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                {/* The Neumorphic Card */}
                <NeuCard exp={exp} isDark={isDark} index={index} />

                {/* Timeline Node (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-[rgb(var(--bg-primary))] bg-[rgb(var(--accent))] shadow-[0_0_20px_rgba(var(--accent),0.4)] z-20 hidden md:flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>

                {/* Spacer for Timeline alignment */}
                <div className="hidden md:block w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;