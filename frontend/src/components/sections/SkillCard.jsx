import { useRef } from 'react';
import { getSkillIcon } from '../../components/icons';

/*
 * SkillCard — same font system as Hero / Skills / GithubActivity
 * Fonts: Syne (name label) + DM Mono (fallback letter)
 * Hover: pure CSS — no Framer Motion dependency
 */

const SkillCard = ({ skill }) => {
  const cardRef = useRef(null);

  const getIcon = () => {
    const iconKey = skill.iconName || skill.name.toLowerCase().replace(/\s+/g, '');
    const IconComponent = getSkillIcon(iconKey);

    if (IconComponent) {
      return <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />;
    }

    if (skill.icon?.url) {
      return (
        <img
          src={skill.icon.url}
          alt={skill.name}
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
      );
    }

    return (
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 400,
          fontSize: '1.1rem',
          letterSpacing: '-0.02em',
        }}
      >
        {skill.name.charAt(0)}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
        .skill-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1.25rem;
          margin: 0 0.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.04);
          min-width: fit-content;
          cursor: default;
          transition: transform 0.25s cubic-bezier(0.23,1,0.32,1),
                      background 0.25s ease,
                      border-color 0.25s ease,
                      box-shadow 0.25s ease;
          will-change: transform;
        }
        .skill-card:hover {
          transform: translateY(-4px) scale(1.03);
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 8px 28px rgba(0,0,0,0.15),
                      0 0 0 1px rgba(var(--accent), 0.15);
        }
        .skill-card-light {
          background: rgba(255,255,255,0.55);
          border-color: rgba(255,255,255,0.75);
        }
        .skill-card-light:hover {
          background: rgba(255,255,255,0.80);
          border-color: rgba(var(--accent), 0.35);
          box-shadow: 0 8px 28px rgba(100,116,139,0.12),
                      0 0 0 1px rgba(var(--accent), 0.12);
        }
        .skill-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(0.7rem, 1vw, 0.85rem);
          letter-spacing: 0.01em;
          white-space: nowrap;
          color: rgb(var(--text-primary));
        }
      `}</style>

      <div ref={cardRef} className="skill-card">
        <div style={{ color: 'rgb(var(--accent))', flexShrink: 0 }}>
          {getIcon()}
        </div>
        <span className="skill-name">{skill.name}</span>
      </div>
    </>
  );
};

export default SkillCard;