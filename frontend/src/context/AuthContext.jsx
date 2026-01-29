import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 1. Create Context (Named Export)
export const AuthContext = createContext();

// 2. Create Provider Component (Named Export)
export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check for token on mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const savedAdmin = localStorage.getItem('admin');
                const token = localStorage.getItem('token');

                if (savedAdmin && token) {
                    setAdmin(JSON.parse(savedAdmin));
                }
            } catch (error) {
                console.error("Auth init error", error);
                localStorage.removeItem('admin');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (adminData) => {
        // Save to storage immediately
        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('token', adminData.token);

        setAdmin(adminData);
        toast.success('Login successful!');
        navigate('/admin/dashboard');
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    // FIXED: Trust localStorage immediately for smoother redirects
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, isAuthenticated, loading, token: admin?.token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Default Export the Provider (Fixes Vite HMR Error)
export default AuthProvider;