import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { socialsAPI } from '../../services/api';
import { socialIconMap } from '../../components/icons/SocialIcons';
import { GlassCard } from '../../components/ui';

const Footer = () => {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    try {
      const response = await socialsAPI.getAll({ visible: true });
      setSocials(response.data.data);
    } catch (error) {
      console.error('Error fetching socials:', error);
    }
  };

  const getSocialIcon = (platform) => {
    const IconComponent = socialIconMap[platform.toLowerCase()];
    return IconComponent || socialIconMap.github;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 py-8 px-4 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left Pill: Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="!rounded-full !py-3 !px-6 flex items-center gap-2 text-xs sm:text-sm shadow-lg">
            <span className="text-[rgb(var(--text-primary))] font-semibold">
              © {currentYear} Rumman.
            </span>
          </GlassCard>
        </motion.div>

        {/* Right Pill: Socials */}
        {socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="!rounded-full !py-2 !px-4 shadow-lg">
              <div className="flex items-center gap-1">
                {socials.map((social) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <motion.a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </footer>
  );
};

export default Footer;