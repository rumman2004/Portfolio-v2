import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useAuth } from '../../hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Loader from '../ui/Loader';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated, loading } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (loading) {
        return <Loader fullScreen size="xl" />;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className={`
            min-h-screen transition-colors duration-500 overflow-hidden relative font-sans
            ${isDark ? 'bg-[#020617]' : 'bg-slate-200'}
        `}>
            {/* --- Ambient Background Glows --- */}
            <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-20
                ${isDark ? 'bg-indigo-600' : 'bg-blue-400'}
            `} />
            <div className={`fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-20
                ${isDark ? 'bg-purple-600' : 'bg-indigo-300'}
            `} />

            {/* --- Floating Sidebar --- */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* --- Main Content Wrapper --- */}
            <div className={`
                flex flex-col min-h-screen transition-all duration-300 relative z-10
                lg:ml-72 /* Left margin to accommodate floating sidebar on desktop */
            `}>
                {/* Navbar */}
                <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-0">
                    {/* "Pressed" Inset Container for Content 
                       This creates a base layer for the floating cards to sit on top of.
                    */}
                    <div className={`
                        min-h-[calc(100vh-140px)] rounded-3xl p-6 sm:p-8 relative overflow-hidden
                        ${isDark
                            ? 'bg-[#0f172a]/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] border border-white/5'
                            : 'bg-slate-100/40 shadow-[inset_0_0_40px_rgba(255,255,255,0.6)] border border-white/40'
                        }
                        backdrop-blur-sm
                    `}>
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* --- Toast Notifications --- */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        color: isDark ? '#fff' : '#334155',
                        backdropFilter: 'blur(10px)',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: isDark ? '#0f172a' : '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: isDark ? '#0f172a' : '#fff',
                        },
                    },
                }}
            />
        </div>
    );
};

export default AdminLayout;