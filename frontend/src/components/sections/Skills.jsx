import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { skillsAPI } from '../../services/api';
import SkillCard from './SkillCard';
import { useTheme } from '../../context/ThemeContext';

const Skills = () => {
    const [skillGroups, setSkillGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await skillsAPI.getGrouped();
                setSkillGroups(response.data.data);
            } catch (error) {
                console.error("Failed to load skills", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    if (loading) return null;

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Constrained Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight"
                    >
                        Technical <span className="text-[rgb(var(--accent))]">Arsenal</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg text-[rgb(var(--text-secondary))] max-w-2xl mx-auto leading-relaxed"
                    >
                        A dynamic collection of tools and technologies I use to build seamless digital experiences.
                    </motion.p>
                </div>

                {/* Skills Marquee Rows - Contained Width */}
                <div className="flex flex-col gap-12">
                    {skillGroups.map((group, index) => {
                        const direction = index % 2 === 0 ? 1 : -1;

                        return (
                            <div key={group._id} className="relative">
                                {/* Category Label */}
                                <div className="mb-6">
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`
                                            inline-block text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full border
                                            ${isDark
                                                ? 'border-white/10 text-white/70 bg-white/5'
                                                : 'border-black/10 text-black/70 bg-black/5'
                                            }
                                        `}
                                    >
                                        {group._id}
                                    </motion.span>
                                </div>

                                {/* Marquee Container - Contained with Overflow */}
                                <div className="relative overflow-hidden rounded-2xl">
                                    {/* Fade Masks on Edges */}
                                    <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[rgb(var(--bg-primary))] to-transparent z-10 pointer-events-none" />
                                    <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[rgb(var(--bg-primary))] to-transparent z-10 pointer-events-none" />

                                    {/* Scrolling Content */}
                                    <motion.div
                                        className="flex items-center gap-4 sm:gap-6 py-2"
                                        animate={{
                                            x: direction === 1 ? ["-50%", "0%"] : ["0%", "-50%"],
                                        }}
                                        transition={{
                                            x: {
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 15,
                                                ease: "linear",
                                            },
                                        }}
                                        style={{ width: "max-content" }}
                                    >
                                        {/* Duplicate skills multiple times for seamless infinite scroll */}
                                        {Array.from({ length: 6 }).flatMap((_, repeatIndex) =>
                                            group.skills.map((skill, skillIndex) => (
                                                <SkillCard
                                                    key={`${group._id}-${skill._id}-${repeatIndex}-${skillIndex}`}
                                                    skill={skill}
                                                />
                                            ))
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Skills;