import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { GlassCard, Input, Textarea, Button } from '../../components/ui';
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

            // Show success message
            toast.success(response.data.message || 'Message sent successfully!');

            // Set submitted state
            setSubmitted(true);

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                phone: '',
            });

            // Reset submitted state after 5 seconds
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
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <GlassCard>
                                <h2 className="text-xl sm:text-2xl font-bold mb-6">Contact Information</h2>

                                {about?.email && (
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 glass rounded-lg flex-shrink-0">
                                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold mb-1">Email</p>
                                            <a
                                                href={`mailto:${about.email}`}
                                                className="text-sm sm:text-base text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors break-all"
                                            >
                                                {about.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {about?.phone && (
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 glass rounded-lg flex-shrink-0">
                                            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold mb-1">Phone</p>
                                            <a
                                                href={`tel:${about.phone}`}
                                                className="text-sm sm:text-base text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors"
                                            >
                                                {about.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {about?.location && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 glass rounded-lg flex-shrink-0">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold mb-1">Location</p>
                                            <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                                                {about.location}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>

                            {/* Social Links */}
                            {socials.length > 0 && (
                                <GlassCard>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Follow Me</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {socials.map((social) => (
                                            <motion.a
                                                key={social._id}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-all text-sm sm:text-base"
                                            >
                                                <span className="capitalize">{social.platform}</span>
                                            </motion.a>
                                        ))}
                                    </div>
                                </GlassCard>
                            )}
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard>
                                <h2 className="text-xl sm:text-2xl font-bold mb-6">Send Message</h2>

                                {submitted ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                        <p className="text-[rgb(var(--text-secondary))] mb-4">
                                            Thank you for reaching out! I'll get back to you soon.
                                        </p>
                                        <p className="text-sm text-[rgb(var(--text-secondary))]">
                                            📧 Check your email for a confirmation message.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                            className="w-full"
                                            size="lg"
                                            loading={loading}
                                            icon={Send}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </Button>

                                        <p className="text-xs text-center text-[rgb(var(--text-secondary))] mt-4">
                                            📧 You'll receive a confirmation email once your message is sent
                                        </p>
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
