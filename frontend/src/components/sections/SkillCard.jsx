import { motion } from 'framer-motion';
import { getSkillIcon } from '../../components/icons'; // Assuming you have this helper

const SkillCard = ({ skill }) => {
  // Helper to get the icon component or image
  const getIcon = () => {
    // 1. Try built-in icon map
    const iconKey = skill.iconName || skill.name.toLowerCase().replace(/\s+/g, '');
    const IconComponent = getSkillIcon(iconKey);

    if (IconComponent) {
      return <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />;
    }

    // 2. Fallback to uploaded image
    if (skill.icon?.url) {
      return (
        <img
          src={skill.icon.url}
          alt={skill.name}
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
      );
    }

    // 3. Text Fallback
    return <span className="text-lg font-bold">{skill.name.charAt(0)}</span>;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`
                flex items-center gap-3 px-5 py-3 mx-3
                rounded-2xl border backdrop-blur-md transition-colors duration-300
                bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-[rgb(var(--accent))]/10
                min-w-fit cursor-default
            `}
    >
      <div className="text-[rgb(var(--accent))]">
        {getIcon()}
      </div>
      <span className="font-medium text-sm sm:text-base text-[rgb(var(--text-primary))] whitespace-nowrap">
        {skill.name}
      </span>
    </motion.div>
  );
};

export default SkillCard;