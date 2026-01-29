import { createContext, useContext, useEffect, useState } from 'react';

// 1. Export Context (Named Export)
export const ThemeContext = createContext();

// 2. Export Provider (Named Export)
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check what was saved last time
        const saved = localStorage.getItem('theme');

        // SHUFFLE LOGIC:
        // If nothing saved, start 'dark'.
        // If 'dark' was saved, switch to 'light'.
        // If 'light' was saved, switch to 'dark'.
        if (!saved) return 'dark';
        return saved === 'dark' ? 'light' : 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Save the NEW current theme so it can be toggled again next reload
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 3. Custom Hook
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

// 4. Default Export
export default ThemeProvider;