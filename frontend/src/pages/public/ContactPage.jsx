import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { GlassCard, Input, Textarea, Button } from '../../components/ui';
import ClockWeatherCard from '../../components/ui/ClockWeatherCard';
import { contactsAPI, aboutAPI, socialsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [about, setAbout] = useState(null);
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [aboutRes, socialsRes] = await Promise.all([
                aboutAPI.get(),
                socialsAPI.getAll({ visible: true }),
            ]);
            setAbout(aboutRes.data.data);
            setSocials(socialsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await contactsAPI.create(formData);
            toast.success(response.data.message || 'Message sent successfully! Check your email for confirmation.');
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                phone: '',
            });
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <section className="container mx-auto px-4 py-12 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                        >
                            Get In Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto px-4"
                        >
                            Have a question or want to work together? Feel free to reach out!
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

                        {/* LEFT COLUMN: Contact Info, Clock & Socials */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-5 sm:space-y-6"
                        >
                            {/* Contact Information Card */}
                            <GlassCard>
                                <h2 className="text-xl sm:text-2xl font-bold mb-6">Contact Information</h2>

                                <div className="space-y-5 sm:space-y-6">
                                    {about?.email && (
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0 text-[rgb(var(--accent))]">
                                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold mb-1 text-xs sm:text-sm text-[rgb(var(--text-secondary))] uppercase tracking-wider">Email</p>
                                                <a
                                                    href={`mailto:${about.email}`}
                                                    className="text-sm sm:text-base hover:text-[rgb(var(--accent))] transition-colors break-all font-medium"
                                                >
                                                    {about.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {about?.phone && (
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0 text-[rgb(var(--accent))]">
                                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold mb-1 text-xs sm:text-sm text-[rgb(var(--text-secondary))] uppercase tracking-wider">Phone</p>
                                                <a
                                                    href={`tel:${about.phone}`}
                                                    className="text-sm sm:text-base hover:text-[rgb(var(--accent))] transition-colors font-medium"
                                                >
                                                    {about.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {about?.location && (
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0 text-[rgb(var(--accent))]">
                                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold mb-1 text-xs sm:text-sm text-[rgb(var(--text-secondary))] uppercase tracking-wider">Location</p>
                                                <p className="text-sm sm:text-base font-medium">
                                                    {about.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>

                            {/* Clock Weather Card - Positioned in the middle */}
                            {about?.location && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-full"
                                >
                                    <ClockWeatherCard locationString={about.location} />
                                </motion.div>
                            )}

                            {/* Social Links */}
                            {socials.length > 0 && (
                                <GlassCard>
                                    <h3 className="text-lg sm:text-xl font-bold mb-4">Follow Me</h3>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                        {socials.map((social) => (
                                            <motion.a
                                                key={social._id}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-3.5 py-2 sm:px-4 sm:py-2.5 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-all text-xs sm:text-sm font-medium"
                                            >
                                                <span className="capitalize">{social.platform}</span>
                                            </motion.a>
                                        ))}
                                    </div>
                                </GlassCard>
                            )}
                        </motion.div>

                        {/* RIGHT COLUMN: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="h-full">
                                <h2 className="text-xl sm:text-2xl font-bold mb-6">Send Message</h2>

                                {submitted ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-12 flex flex-col items-center justify-center h-[400px]"
                                    >
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold mb-3">Message Sent!</h3>
                                        <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] mb-2 max-w-xs mx-auto px-4">
                                            Thank you for reaching out! I'll get back to you within 24 hours.
                                        </p>
                                        <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] flex items-center justify-center gap-2 px-4">
                                            <Mail className="w-4 h-4" />
                                            Check your email for confirmation
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                        <Input
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            required
                                        />

                                        <Input
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                        />

                                        <Input
                                            label="Phone (Optional)"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1234567890"
                                        />

                                        <Input
                                            label="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Project Inquiry"
                                        />

                                        <Textarea
                                            label="Message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell me about your project..."
                                            rows={6}
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full mt-2"
                                            size="lg"
                                            loading={loading}
                                            icon={Send}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                )}
                            </GlassCard>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default ContactPage;