import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// 1. Named Export (Fixes the "does not provide export" error)
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

// 2. Default Export (For flexibility)
export default useAuth;