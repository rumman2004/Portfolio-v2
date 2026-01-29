import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Fingerprint } from 'lucide-react';
import { Input, Button } from '../../components/ui';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 3D Tilt State
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ✅ FIX: Robust URL Construction
            // 1. Get Base URL (default to localhost:5000 if env is missing)
            const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            // 2. Strip any trailing slash and '/api' to ensure a clean host
            // Example: 'http://localhost:5000/api/' -> 'http://localhost:5000'
            const cleanHost = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

            // 3. Construct the final correct URL
            const loginUrl = `${cleanHost}/api/auth/login`;

            console.log('🔐 Sending login request to:', loginUrl);

            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Welcome back!');
                login(data.data);
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error('Connection error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`
            min-h-screen flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500
            ${isDark ? 'bg-[#020617]' : 'bg-slate-200'}
        `}>
            {/* Background Ambient Glows */}
            <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-40
                ${isDark ? 'bg-indigo-600' : 'bg-blue-400'}
            `} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-40
                ${isDark ? 'bg-purple-600' : 'bg-indigo-300'}
            `} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-md perspective-1000"
            >
                {/* Neumorphic Card */}
                <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    }}
                    className={`
                        relative p-8 md:p-10 rounded-3xl transition-transform duration-100 ease-out
                        ${isDark
                            ? 'bg-[#0f172a] shadow-[20px_20px_60px_#05080f,-20px_-20px_60px_rgba(255,255,255,0.03)] border border-slate-800/50'
                            : 'bg-slate-100 shadow-[20px_20px_60px_#a0aab8,-20px_-20px_60px_#ffffff]'
                        }
                    `}
                >
                    <div className="flex justify-center mb-8">
                        <div className={`
                            w-20 h-20 rounded-full flex items-center justify-center
                            ${isDark
                                ? 'bg-[#0f172a] shadow-[inset_6px_6px_12px_#05080f,inset_-6px_-6px_12px_rgba(255,255,255,0.05)]'
                                : 'bg-slate-100 shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff]'
                            }
                        `}>
                            <Fingerprint className={`w-10 h-10 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                            Welcome Back
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Enter your credentials to access the admin panel.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            icon={Mail}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            icon={Lock}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                size="lg"
                                loading={loading}
                                icon={LogIn}
                                glowColor={isDark ? '#6366f1' : '#4f46e5'}
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className={`mt-8 pt-6 border-t flex justify-center text-xs font-medium opacity-60
                        ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}
                    `}>
                        SECURE ADMIN ACCESS
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;