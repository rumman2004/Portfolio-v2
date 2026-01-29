// ==================== EXPORT ALL SKILL ICONS ====================

// Languages
export * from './LanguageIcons';

// Frameworks & Libraries
export * from './FrameworkIcons';

// Databases
export * from './DatabaseIcons';

// Dev Tools
export * from './DevToolIcons';

// Skill Icon Map for easy lookup
import {
    HTMLIcon,
    CSSIcon,
    JavaScriptIcon,
    TypeScriptIcon,
    PythonIcon,
    JavaIcon,
    CIcon,
    CPlusPlusIcon,  // ✅ ADD THIS IMPORT!
} from './LanguageIcons';

import {
    ReactIcon,
    NodeJSIcon,
    ExpressIcon,
    TailwindIcon,
    NextJSIcon,
} from './FrameworkIcons';

import {
    MongoDBIcon,
    MySQLIcon,
    PostgreSQLIcon,
    RedisIcon,
} from './DatabaseIcons';

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
} from './DevToolIcons';

export const skillIconMap = {
    // Languages
    html: HTMLIcon,
    css: CSSIcon,
    javascript: JavaScriptIcon,
    js: JavaScriptIcon,
    typescript: TypeScriptIcon,
    ts: TypeScriptIcon,
    python: PythonIcon,
    java: JavaIcon,
    c: CIcon,
    'c++': CPlusPlusIcon,
    'C++': CPlusPlusIcon,
    cpp: CPlusPlusIcon,
    cplusplus: CPlusPlusIcon,

    // Frameworks
    react: ReactIcon,
    reactjs: ReactIcon,
    nodejs: NodeJSIcon,
    node: NodeJSIcon,
    express: ExpressIcon,
    expressjs: ExpressIcon,
    tailwind: TailwindIcon,
    tailwindcss: TailwindIcon,
    nextjs: NextJSIcon,
    next: NextJSIcon,

    // Databases
    mongodb: MongoDBIcon,
    mongo: MongoDBIcon,
    mysql: MySQLIcon,
    postgresql: PostgreSQLIcon,
    postgres: PostgreSQLIcon,
    redis: RedisIcon,

    // Dev Tools
    git: GitIcon,
    github: GitHubIcon,
    docker: DockerIcon,
    figma: FigmaIcon,
    vscode: VSCodeIcon,
    'visual studio code': VSCodeIcon,
    postman: PostmanIcon,
    webpack: WebpackIcon,
    npm: NPMIcon,
    yarn: YarnIcon,
    webstorm: WebStormIcon,
    linux: LinuxIcon,
};

// Helper function to get icon by name
export const getSkillIcon = (skillName) => {
    if (!skillName) return null;

    // Try exact match first
    if (skillIconMap[skillName]) {
        return skillIconMap[skillName];
    }

    // Try lowercase match
    const normalizedName = skillName.toLowerCase().trim();
    return skillIconMap[normalizedName] || null;
};
