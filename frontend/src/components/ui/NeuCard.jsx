import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { GlassCard } from './index';

const NeuCard = ({ exp, isDark, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative w-full md:w-[45%]"
        >
            <motion.div
                // 3D Tilted effect matching your drawing
                whileHover={{
                    y: -10,
                    rotateX: 4,
                    rotateY: index % 2 === 0 ? 8 : -8,
                    scale: 1.02
                }}
                className="h-full perspective-1000"
            >
                <GlassCard className="h-full border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-500">
                    {/* Background Accent Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--accent))]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[rgb(var(--accent))]/30 transition-all duration-700" />

                    <div className="relative z-10 p-2">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/20 shadow-inner">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {exp.title}
                                </h3>
                                <p className="text-[rgb(var(--accent))] font-semibold text-sm">
                                    {exp.company}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap gap-3 mb-4 text-[10px] sm:text-xs font-medium">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                                }`}>
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                    {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
                                </span>
                            </div>
                            {exp.location && (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                                    }`}>
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{exp.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Role Description */}
                        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                            {exp.description}
                        </p>

                        {/* Responsibility Points */}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <ul className="space-y-2">
                                {exp.responsibilities.map((resp, i) => (
                                    <li key={i} className="flex gap-3 text-xs leading-relaxed text-[rgb(var(--text-secondary))]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))] mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgb(var(--accent))]" />
                                        <span>{resp}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

export default NeuCard;