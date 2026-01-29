import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-9xl font-bold bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 bg-clip-text text-transparent mb-4"
                >
                    404
                </motion.div>

                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>

                <p className="text-xl text-[rgb(var(--text-secondary))] mb-8 max-w-md">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/">
                        <Button size="lg" icon={Home}>
                            Go Home
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        icon={ArrowLeft}
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 relative">
                    <motion.div
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="w-64 h-64 mx-auto opacity-10"
                    >
                        <div className="absolute inset-0 glass rounded-full" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
