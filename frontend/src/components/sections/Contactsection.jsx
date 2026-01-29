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
      toast.success(response.data.message || 'Message sent successfully!');
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
      <section className="container mx-auto px-4 py-8 sm:py-20">
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
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            >
              Get In Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))] max-w-xl mx-auto px-2"
            >
              Have a question or want to work together? Feel free to reach out!
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 sm:gap-8">
            {/* Contact Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-5 sm:space-y-6"
            >
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h2>

                <div className="space-y-4 sm:space-y-6">
                  {about?.email && (
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0">
                        <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold mb-0.5">Email</p>
                        <a
                          href={`mailto:${about.email}`}
                          className="text-xs sm:text-base text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors break-all"
                        >
                          {about.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {about?.phone && (
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0">
                        <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold mb-0.5">Phone</p>
                        <a
                          href={`tel:${about.phone}`}
                          className="text-xs sm:text-base text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent))] transition-colors"
                        >
                          {about.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {about?.location && (
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 glass rounded-lg flex-shrink-0">
                        <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold mb-0.5">Location</p>
                        <p className="text-xs sm:text-base text-[rgb(var(--text-secondary))]">
                          {about.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Social Links */}
              {socials.length > 0 && (
                <GlassCard className="p-5 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Follow Me</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {socials.map((social) => (
                      <motion.a
                        key={social._id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-all text-xs sm:text-base"
                      >
                        <span className="capitalize">{social.platform}</span>
                      </motion.a>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>

            {/* Contact Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-5 sm:p-8">
                <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Send Message</h2>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] mb-4">
                      Thank you for reaching out! I'll get back to you soon.
                    </p>
                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">
                      📧 Check your email for confirmation.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <Input
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="text-sm"
                    />

                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="text-sm"
                    />

                    <Input
                      label="Phone (Optional)"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className="text-sm"
                    />

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry"
                      className="text-sm"
                    />

                    <Textarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      rows={5}
                      required
                      className="text-sm"
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

                    <p className="text-[10px] sm:text-xs text-center text-[rgb(var(--text-secondary))] mt-4">
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