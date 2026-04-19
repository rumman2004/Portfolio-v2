// ==================== EXPORT ALL SKILL ICONS ====================
// NOTE: All named imports MUST come before skillIconMap usage.
// PHPIcon lives in LanguageIcons ONLY (removed from DevToolIcons).
// FirebaseIcon, AWSIcon, GoogleCloudIcon, ViteIcon live in DevToolIcons ONLY.

// ── Imports ────────────────────────────────────────────────────────────────────

// Languages  (LanguageIcons.jsx)
import {
    HTMLIcon,
    CSSIcon,
    JavaScriptIcon,
    TypeScriptIcon,
    PythonIcon,
    JavaIcon,
    CIcon,
    CPlusPlusIcon,
    PHPIcon,           // ✅ Lives here — NOT in DevToolIcons
} from './LanguageIcons';

// Frameworks & Libraries  (FrameworkIcons.jsx)
import {
    ReactIcon,
    NodeJSIcon,
    ExpressIcon,
    TailwindIcon,
    NextJSIcon,
} from './FrameworkIcons';

// Databases  (DatabaseIcons.jsx)
import {
    MongoDBIcon,
    MySQLIcon,
    PostgreSQLIcon,
    RedisIcon,
} from './DatabaseIcons';

// Dev Tools  (DevToolIcons.jsx)
import {
    GitIcon,
    GitHubIcon,
    DockerIcon,
    FigmaIcon,
    VSCodeIcon,
    PostmanIcon,
    WebpackIcon,
    NPMIcon,
    YarnIcon,
    WebStormIcon,
    LinuxIcon,
    SupabaseIcon,
    VercelIcon,
    RenderIcon,
    RailwayIcon,
    ViteIcon,          // ✅ Lives here — NOT in LanguageIcons
    AWSIcon,           // ✅ Lives here
    GoogleCloudIcon,   // ✅ Lives here
    FirebaseIcon,      // ✅ Lives here
} from './DevToolIcons';

// ── Re-exports (barrel) ────────────────────────────────────────────────────────
// Using named re-exports instead of `export *` avoids duplicate-export
// conflicts when two files accidentally define the same name.

// Languages
export {
    HTMLIcon,
    CSSIcon,
    JavaScriptIcon,
    TypeScriptIcon,
    PythonIcon,
    JavaIcon,
    CIcon,
    CPlusPlusIcon,
    PHPIcon,
};

// Frameworks & Libraries
export {
    ReactIcon,
    NodeJSIcon,
    ExpressIcon,
    TailwindIcon,
    NextJSIcon,
};

// Databases
export {
    MongoDBIcon,
    MySQLIcon,
    PostgreSQLIcon,
    RedisIcon,
};

// Dev Tools
export {
    GitIcon,
    GitHubIcon,
    DockerIcon,
    FigmaIcon,
    VSCodeIcon,
    PostmanIcon,
    WebpackIcon,
    NPMIcon,
    YarnIcon,
    WebStormIcon,
    LinuxIcon,
    SupabaseIcon,
    VercelIcon,
    RenderIcon,
    RailwayIcon,
    ViteIcon,
    AWSIcon,
    GoogleCloudIcon,
    FirebaseIcon,
};

// ── Skill Icon Map ─────────────────────────────────────────────────────────────

export const skillIconMap = {
    // ── Languages ──────────────────────────────────────────────
    html:           HTMLIcon,
    css:            CSSIcon,
    javascript:     JavaScriptIcon,
    typescript:     TypeScriptIcon,
    python:         PythonIcon,
    java:           JavaIcon,
    c:              CIcon,
    'c++':          CPlusPlusIcon,
    php:            PHPIcon,

    // ── Frameworks & Libraries ─────────────────────────────────
    react:          ReactIcon,
    nodejs:         NodeJSIcon,
    expressjs:      ExpressIcon,
    tailwindcss:    TailwindIcon,
    nextjs:         NextJSIcon,

    // ── Databases ──────────────────────────────────────────────
    mongodb:        MongoDBIcon,
    mysql:          MySQLIcon,
    postgresql:     PostgreSQLIcon,
    redis:          RedisIcon,

    // ── Dev Tools ──────────────────────────────────────────────
    git:                    GitIcon,
    github:                 GitHubIcon,
    docker:                 DockerIcon,
    figma:                  FigmaIcon,
    'visual studio code':   VSCodeIcon,
    postman:                PostmanIcon,
    webpack:                WebpackIcon,
    npm:                    NPMIcon,
    yarn:                   YarnIcon,
    webstorm:               WebStormIcon,
    linux:                  LinuxIcon,
    supabase:               SupabaseIcon,
    vercel:                 VercelIcon,
    render:                 RenderIcon,
    railway:                RailwayIcon,
    vite:                   ViteIcon,
    aws:                    AWSIcon,
    'google cloud':         GoogleCloudIcon,
    firebase:               FirebaseIcon,
};

// ── Helper ─────────────────────────────────────────────────────────────────────

/**
 * Returns the icon component for a given skill name.
 * Tries exact match first, then lowercase-trimmed match.
 *
 * @param {string} skillName
 * @returns {React.ComponentType | null}
 */
export const getSkillIcon = (skillName) => {
    if (!skillName) return null;

    // 1. Exact match (preserves keys like 'c++' and 'C++')
    if (skillIconMap[skillName]) return skillIconMap[skillName];

    // 2. Lowercase + trimmed fallback
    const normalizedName = skillName.toLowerCase().trim();
    return skillIconMap[normalizedName] ?? null;
};