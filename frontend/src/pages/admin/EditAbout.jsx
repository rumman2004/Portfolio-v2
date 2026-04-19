import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  User, Mail, Phone, MapPin, Briefcase, Save, Upload, TrendingUp,
  Code, Award, Users, X, Trash2, Image as ImageIcon
} from 'lucide-react';
import { Input, Button, Textarea, GlassCard } from '../../components/ui';
import { aboutAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const EditAbout = () => {
  const { token } = useAuth();
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData]     = useState({
    name: '', title: '', bio: '', email: '', phone: '', location: '',
    stats: { yearsExperience: 2, projectsCompleted: 10, certificatesEarned: 5, happyClients: 10 }
  });
  const [profileImage, setProfileImage]               = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [removeProfileImage, setRemoveProfileImage]   = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm]     = useState(false);
  const [resume, setResume]                           = useState(null);
  const [currentResume, setCurrentResume]             = useState(null);
  const [existingHeroImages, setExistingHeroImages]   = useState([]);
  const [newHeroFiles, setNewHeroFiles]               = useState([]);

  const wrapRef    = useRef(null);
  const headerRef  = useRef(null);
  const cardRef    = useRef(null);
  const confirmRef = useRef(null);

  /* ── fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await aboutAPI.get();
        const data = res.data.data;
        if (data) {
          setFormData({
            name: data.name || '', title: data.title || '', bio: data.bio || '',
            email: data.email || '', phone: data.phone || '', location: data.location || '',
            stats: {
              yearsExperience:   data.stats?.yearsExperience   || 2,
              projectsCompleted: data.stats?.projectsCompleted || 10,
              certificatesEarned:data.stats?.certificatesEarned|| 5,
              happyClients:      data.stats?.happyClients      || 10,
            },
          });
          if (data.profileImage?.url) setProfileImagePreview(data.profileImage.url);
          if (data.resume?.url)       setCurrentResume(data.resume.url);
          if (Array.isArray(data.heroImages)) setExistingHeroImages(data.heroImages);
        }
      } catch { /* fresh start */ }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 32, opacity: 0, skewY: 1.5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.0, ease: 'expo.out' }
      );
      gsap.fromTo(cardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.12 }
      );
      /* Divider lines: scaleX */
      wrapRef.current?.querySelectorAll('.ea-divider').forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.0, ease: 'expo.out', delay: 0.25 }
        );
      });
    }, wrapRef.current);
    return () => ctx.revert();
  }, [loading]);

  /* ── Confirm modal GSAP toggle ── */
  useEffect(() => {
    const el = confirmRef.current;
    if (!el) return;
    if (showRemoveConfirm) {
      gsap.set(el, { display: 'flex' });
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'expo.out' });
      gsap.fromTo(el.querySelector('.confirm-panel'),
        { scale: 0.9, y: 20 },
        { scale: 1, y: 0, duration: 0.45, ease: 'expo.out' }
      );
    } else {
      gsap.to(el, {
        opacity: 0, duration: 0.2, ease: 'expo.in',
        onComplete: () => gsap.set(el, { display: 'none' }),
      });
    }
  }, [showRemoveConfirm]);

  /* handlers */
  const handleChange      = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleStatsChange = (e) => setFormData({ ...formData, stats: { ...formData.stats, [e.target.name]: parseInt(e.target.value) || 0 } });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return; }
    setProfileImage(file); setProfileImagePreview(URL.createObjectURL(file)); setRemoveProfileImage(false);
  };

  const handleRemoveProfileImage = () => {
    setShowRemoveConfirm(false);
    setProfileImagePreview(''); setProfileImage(null); setRemoveProfileImage(true);
    toast.success('Profile image will be removed on save');
  };

  const handleHeroFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingHeroImages.length + newHeroFiles.length + files.length > 5) {
      toast.error('Maximum 5 hero images.'); return;
    }
    const valid = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) { toast.error(`${f.name} is too large`); return false; }
      if (!f.type.startsWith('image/')) { toast.error(`${f.name} is not a valid image`); return false; }
      return true;
    });
    setNewHeroFiles(prev => [...prev, ...valid]);
  };

  const deleteExistingHeroImage = async (image) => {
    const imageId = image._id || image.public_id;
    if (!imageId) { setExistingHeroImages(prev => prev.filter(i => i !== image)); return; }
    if (!window.confirm('Delete this image?')) return;
    try {
      const raw   = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const host  = raw.replace(/\/api\/?$/, '').replace(/\/$/, '');
      const res   = await fetch(`${host}/api/about/hero-image/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data  = await res.json();
      if (res.ok && data.success) {
        toast.success('Image deleted');
        setExistingHeroImages(prev => prev.filter(i => (i._id || i.public_id) !== imageId));
      } else { toast.error(data.message || 'Failed to delete'); }
    } catch { toast.error('Server error'); }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File size should be less than 5MB'); return; }
    if (!file.type.includes('pdf') && !file.type.includes('document')) { toast.error('Only PDF and DOC'); return; }
    setResume(file); toast.success('Resume selected');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.title.trim() || !formData.email.trim() || !formData.bio.trim()) {
      toast.error('Please fill in all required fields'); return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim()); data.append('title', formData.title.trim());
      data.append('bio', formData.bio.trim()); data.append('email', formData.email.trim());
      if (formData.phone)    data.append('phone', formData.phone.trim());
      if (formData.location) data.append('location', formData.location.trim());
      data.append('stats', JSON.stringify(formData.stats));
      if (removeProfileImage) data.append('removeProfileImage', 'true');
      if (profileImage)       data.append('profileImage', profileImage);
      if (resume)             data.append('resume', resume);
      newHeroFiles.forEach(f => data.append('heroImages', f));

      const response = await aboutAPI.update(data);
      if (response.data.success) {
        toast.success('About information updated!');
        setProfileImage(null); setResume(null); setNewHeroFiles([]); setRemoveProfileImage(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loader fullScreen size="lg" />;

  return (
    <div ref={wrapRef} className="space-y-6 max-w-4xl mx-auto" style={{ fontFamily: "'Syne', sans-serif" }}>

      {/* Header */}
      <div ref={headerRef} className="text-center sm:text-left">
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', fontWeight: 300,
          fontStyle: 'italic', letterSpacing: '0.12em', color: 'rgb(var(--accent))', opacity: 0.7,
          marginBottom: '0.4rem',
        }}>◆</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'rgb(var(--text-primary))' }}>
          Edit About Section
        </h1>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.78rem',
          letterSpacing: '0.02em', color: 'rgb(var(--text-secondary))', marginTop: '0.5rem',
        }}>
          Update your personal information, profile, and homepage stats
        </p>
        <div className="ea-divider" style={{ height: '1px', marginTop: '1rem', background: 'linear-gradient(to right, rgba(var(--accent),0.4), transparent)' }} />
      </div>

      {/* Card */}
      <div ref={cardRef}>
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Hero images */}
            <div className="pb-6 border-b border-[rgb(var(--border))]">
              <h3 className="text-lg sm:text-xl font-extrabold mb-4 flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                <ImageIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                Hero Slider Images
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', fontWeight: 300, opacity: 0.5, letterSpacing: '0.1em' }}>(MAX 5)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {existingHeroImages.map((img, i) => (
                  <div key={img._id || img.public_id || `ex-${i}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] transition-colors">
                    <img src={img.url} alt={`Hero ${i+1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => deleteExistingHeroImage(img)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {newHeroFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-dashed border-[rgb(var(--accent))]">
                    <img src={URL.createObjectURL(file)} alt={`New ${i+1}`} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em' }} className="text-white bg-[rgb(var(--accent))] px-2 py-1 rounded-full">NEW</span>
                    </div>
                    <button type="button" onClick={() => setNewHeroFiles(prev => prev.filter((_,j) => j !== i))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {(existingHeroImages.length + newHeroFiles.length) < 5 && (
                  <label className="border-2 border-dashed border-[rgb(var(--border))] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--accent))] transition-colors aspect-video bg-[rgb(var(--bg-secondary))]/30">
                    <Upload className="w-6 h-6 mb-2" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em' }}>Add Image</span>
                    <input type="file" multiple accept="image/*" onChange={handleHeroFilesChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Profile image */}
            <div className="pb-6 border-b border-[rgb(var(--border))]">
              <h3 className="text-lg sm:text-xl font-extrabold mb-4" style={{ letterSpacing: '-0.02em' }}>Profile Image</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[rgb(var(--accent))]/20 bg-[rgb(var(--bg-secondary))]">
                  {profileImagePreview
                    ? <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><User className="w-16 h-16 text-[rgb(var(--text-secondary))]/50" /></div>
                  }
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 bg-[rgb(var(--accent))] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em' }}>Upload New</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {profileImagePreview && (
                      <button type="button" onClick={() => setShowRemoveConfirm(true)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em' }}>Remove</span>
                      </button>
                    )}
                  </div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.05em', color: 'rgb(var(--text-secondary))' }}>
                    Square image, min 400×400px, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="pb-6 border-b border-[rgb(var(--border))]">
              <h3 className="text-lg sm:text-xl font-extrabold mb-4" style={{ letterSpacing: '-0.02em' }}>Resume / CV</h3>
              <div className="space-y-3">
                {currentResume && (
                  <div className="flex items-center gap-3 p-3 bg-[rgb(var(--bg-secondary))]/30 rounded-lg">
                    <Award className="w-5 h-5 text-[rgb(var(--accent))]" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.78rem' }} className="flex-1">Current resume uploaded</span>
                    <a href={currentResume} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: 'rgb(var(--accent))' }} className="hover:underline">View</a>
                  </div>
                )}
                <label className="cursor-pointer inline-block">
                  <div className="px-4 py-2 border-2 border-dashed border-[rgb(var(--border))] rounded-lg hover:border-[rgb(var(--accent))] transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                      {resume ? resume.name : 'Upload New Resume'}
                    </span>
                  </div>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Personal info */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name"          name="name"     value={formData.name}     onChange={handleChange} icon={User}     required />
                <Input label="Professional Title" name="title"    value={formData.title}    onChange={handleChange} icon={Briefcase}required />
                <Input label="Email"    type="email" name="email" value={formData.email}    onChange={handleChange} icon={Mail}     required />
                <Input label="Phone"              name="phone"    value={formData.phone}    onChange={handleChange} icon={Phone} />
                <Input label="Location"           name="location" value={formData.location} onChange={handleChange} icon={MapPin} />
              </div>
              <Textarea label="Bio / About Me" name="bio" value={formData.bio} onChange={handleChange} rows={5} required />
            </div>

            {/* Stats */}
            <div className="space-y-4 pt-6 border-t border-[rgb(var(--border))]">
              <h3 className="text-lg sm:text-xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>Homepage Statistics</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Years of Experience"  type="number" name="yearsExperience"   value={formData.stats.yearsExperience}   onChange={handleStatsChange} icon={Briefcase} min="0" />
                <Input label="Projects Completed"   type="number" name="projectsCompleted" value={formData.stats.projectsCompleted} onChange={handleStatsChange} icon={Code}      min="0" />
                <Input label="Certificates Earned"  type="number" name="certificatesEarned"value={formData.stats.certificatesEarned}onChange={handleStatsChange} icon={Award}     min="0" />
                <Input label="Happy Clients"         type="number" name="happyClients"      value={formData.stats.happyClients}     onChange={handleStatsChange} icon={Users}     min="0" />
              </div>
            </div>

            {/* Save */}
            <div className="pt-6 border-t border-[rgb(var(--border))]">
              <Button type="submit" loading={submitting} disabled={submitting} icon={Save} className="w-full sm:w-auto" size="lg">
                {submitting ? 'Saving Changes…' : 'Save All Changes'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Confirm remove modal (GSAP) */}
      <div
        ref={confirmRef}
        style={{
          display: 'none', position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 50,
          alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
        onClick={() => setShowRemoveConfirm(false)}
      >
        <div
          className="confirm-panel bg-[rgb(var(--bg-card))] rounded-2xl p-6 max-w-sm w-full border border-[rgb(var(--border))]"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-lg font-extrabold mb-2" style={{ letterSpacing: '-0.02em' }}>Remove Profile Image?</h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: '0.78rem', color: 'rgb(var(--text-secondary))', marginBottom: '1.5rem' }}>
            This will remove your current profile image. You can upload a new one anytime.
          </p>
          <div className="flex gap-3">
            <button onClick={handleRemoveProfileImage} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Remove</button>
            <button onClick={() => setShowRemoveConfirm(false)} className="flex-1 px-4 py-2 border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--bg-secondary))] transition-colors"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAbout;