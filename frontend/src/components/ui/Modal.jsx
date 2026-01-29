import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={`
                            fixed inset-0 z-50 backdrop-blur-sm
                            ${isDark ? 'bg-[#020617]/70' : 'bg-slate-200/60'}
                        `}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className={`
                                w-full ${sizes[size]} max-h-[90vh] overflow-hidden rounded-3xl
                                
                                /* --- 3D MODAL STYLE --- */
                                ${!isDark ? `
                                    bg-slate-100 
                                    shadow-[20px_20px_60px_#a0aab8,-20px_-20px_60px_#ffffff]
                                ` : ''}
                                ${isDark ? `
                                    bg-[#0f172a] 
                                    shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]
                                    border border-slate-800
                                ` : ''}
                            `}
                        >
                            {/* Header */}
                            <div className={`
                                flex items-center justify-between p-6 
                                ${!isDark ? 'border-b border-slate-200' : 'border-b border-slate-800'}
                            `}>
                                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {title}
                                </h2>

                                {/* Close Button (Pressed Effect) */}
                                <button
                                    onClick={onClose}
                                    className={`
                                        p-2 rounded-full transition-all duration-200
                                        ${!isDark ? 'bg-slate-100 hover:shadow-[inset_2px_2px_5px_#cbd5e1]' : 'bg-[#0f172a] hover:bg-slate-800'}
                                    `}
                                >
                                    <X className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;