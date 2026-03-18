import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Building2, Loader2, CheckCircle, Upload, Star, Users, TrendingUp, Eye, Award, Crown, Medal, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import StemBackground from '../components/StemBackground';

const tierConfig = {
  'Title Sponsor': { color: '#f59e0b', badge: Crown, label: '👑 Title Sponsor', border: '#f59e0b', bg: '#fffbeb' },
  'Platinum Sponsor': { color: '#8b5cf6', badge: Award, label: '💎 Platinum', border: '#8b5cf6', bg: '#f5f3ff' },
  'Gold Sponsor': { color: '#d97706', badge: Award, label: '🥇 Gold', border: '#d97706', bg: '#fffbeb' },
  'Silver Sponsor': { color: '#6b7280', badge: Medal, label: '🥈 Silver', border: '#9ca3af', bg: '#f9fafb' },
  'Stall / Booth': { color: '#f7941d', badge: Building2, label: '🏪 Stall Partner', border: '#f7941d', bg: '#fff7ed' },
  'Food Partner': { color: '#e63228', badge: Star, label: '🍕 Food Partner', border: '#e63228', bg: '#fff0f0' },
};

const inputStyle = {
  width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
  border: '2px solid #e8e4dc', outline: 'none', fontFamily: 'Signika, sans-serif',
  fontSize: '0.95rem', color: '#333', background: '#faf9f6', boxSizing: 'border-box',
};

export default function Exhibitor() {
  const [sponsors, setSponsors] = useState([]);
  const [settings, setSettings] = useState(null); // Added for toggle control
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    brandName: '', contactPerson: '', email: '', phone: '', interestTier: '',
  });
  const [brochure, setBrochure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sponsorRes, settingsRes] = await Promise.all([
          api.get('/public/sponsors'),
          api.get('/public/data') // Fetching global event settings
        ]);
        setSponsors(sponsorRes.data.data || []);
        // Safely extract nested settings depending on the backend response structure
        const resData = settingsRes.data.data;
        setSettings(resData.settings ? resData.settings : resData);
      } catch (err) {
        console.error("Error fetching page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandName.trim() || !form.contactPerson.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+\-()]{10,15}$/;

    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (brochure) formData.append('brochure', brochure);
      await api.post('/public/exhibitor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      toast.success('Enquiry submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="animate-slide-up" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,.1)', padding: '3rem', textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <div style={{ width: 80, height: 80, background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle style={{ width: 44, height: 44, color: '#f7941d' }} />
          </div>
          <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Thank You! 🚀</h2>
          <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginBottom: '1.5rem' }}>
            Your sponsorship enquiry has been submitted. Our team will reach out shortly!
          </p>
          <Link to="/"
            style={{ fontFamily: 'Lilita One, sans-serif', background: '#f7941d', color: '#fff', borderRadius: '50px', padding: '0.65rem 2rem', textDecoration: 'none', display: 'inline-block', fontSize: '0.95rem' }}>
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  const tierOrder = ['Title Sponsor', 'Platinum Sponsor', 'Gold Sponsor', 'Silver Sponsor', 'Stall / Booth', 'Food Partner'];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee', position: 'relative' }}>
      <StemBackground numberOfEmojis={40} />
      {/* Header */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#f7941d', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
        {['🚀', '🤝', '💎', '🏢'].map((e, i) => (
          <span key={i} className="animate-float" style={{
            position: 'absolute', fontSize: '2rem', opacity: 0.2,
            top: `${10 + i * 22}%`, left: `${8 + i * 25}%`,
            animationDelay: `${i * 0.7}s`,
          }}>{e}</span>
        ))}
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <h1 className="animate-slide-up"
            style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', marginBottom: '0.75rem' }}>
            Sponsors & Partners 🚀
          </h1>
          <p className="animate-slide-up delay-100"
            style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.88)', fontSize: '1.05rem' }}>
            Meet the brands powering our festival — and partner with us!
          </p>
        </div>
      </section>

      {/* Sponsors Grid - Always visible if sponsors exist */}
      <section style={{ padding: '4rem 0', background: '#fff', position: 'relative' }}>
        <StemBackground numberOfEmojis={30} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1a9fb5' }}>
              Our Proud Partners ⭐
            </h2>
            <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginTop: '0.5rem' }}>
              Thank you to our incredible sponsors who make the festival possible!
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 style={{ width: 32, height: 32, color: '#f7941d' }} className="animate-spin" />
            </div>
          ) : sponsors.length === 0 ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ width: 80, height: 80, background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Crown style={{ width: 40, height: 40, color: '#f7941d' }} />
              </div>
              <h3 style={{ fontFamily: 'Lilita One, sans-serif', color: '#555', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Be Our First Sponsor!</h3>
              <p style={{ fontFamily: 'Signika, sans-serif', color: '#888', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                Sponsorship spots are open. Get premium brand visibility to 5,000+ families!
              </p>
              <a href="#become-sponsor" className="btn-kk-orange">Apply Now</a>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {tierOrder.map((tier) => {
                const list = sponsors.filter(s => s.tier === tier);
                if (list.length === 0) return null;
                const config = tierConfig[tier] || tierConfig['Stall / Booth'];
                const TierIcon = config.badge;

                return (
                  <div key={tier} className="flex flex-col items-center">
                    {/* Centered Tier Heading */}
                    <div className="flex flex-col items-center mb-10 w-full animate-slide-up">
                      <div className="flex items-center gap-3 px-6 py-2.5 rounded-full border-2 border-dashed mb-4" 
                           style={{ borderColor: `${config.border}60`, background: `${config.bg}` }}>
                        <TierIcon style={{ width: 22, height: 22, color: config.color }} />
                        <span style={{ fontFamily: 'Lilita One, sans-serif', color: '#1a1a1a', fontSize: '1.25rem', letterSpacing: '0.04em' }}>
                          {config.label.toUpperCase()}
                        </span>
                      </div>
                      <div className="h-1.5 w-32 rounded-full" style={{ background: config.color, opacity: 0.3 }} />
                    </div>

                    {/* Centered Horizontal Flex Row for this Tier */}
                    <div className="w-full">
                      {(() => {
                        const isBig = tier === 'Title Sponsor' || tier === 'Platinum Sponsor';
                        const isMedium = tier === 'Gold Sponsor' || tier === 'Silver Sponsor';
                        const isSmall = !isBig && !isMedium;

                        // Updated widths (+15%) and adjusted height for more squarish overall look
                        const cardWidthClass = isBig 
                          ? 'w-[320px] sm:w-[370px]' 
                          : isMedium 
                            ? 'w-[210px] sm:w-[255px]' 
                            : 'w-[165px] sm:w-[200px]';

                        return (
                          <div className="flex flex-wrap justify-center gap-6 md:gap-10 w-full max-w-7xl mx-auto">
                            {list.map((sponsor) => (
                              <div 
                                key={sponsor._id}
                                className={`group relative bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col shadow-sm hover:shadow-lg animate-slide-up ${cardWidthClass} ${
                                  isBig ? 'rounded-3xl' : isMedium ? 'rounded-2xl' : 'rounded-xl'
                                }`}
                                style={{ border: `1px solid ${config.border}25` }}
                              >
                                {/* Image Container - Adjusted aspect for squarish look (+15% W, -10% H ratio) */}
                                <div className="relative w-full aspect-[1.3/1] bg-white overflow-hidden">
                                  {sponsor.logoUrl ? (
                                    <img 
                                      src={sponsor.logoUrl} 
                                      alt={sponsor.brandName} 
                                      className={`w-full h-full relative z-10 transition-transform duration-700 group-hover:scale-105 ${
                                        isSmall ? 'object-contain p-4' : 'object-cover'
                                      }`}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center" 
                                         style={{ background: `linear-gradient(135deg, ${config.color}15, ${config.color}35)` }}>
                                      <span className={`font-heading ${isBig ? 'text-5xl' : isMedium ? 'text-4xl' : 'text-2xl'}`} style={{ color: config.color }}>
                                        {sponsor.brandName.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                </div>

                                {/* Info area - Tightened padding to reduce overall height */}
                                <div className={`${isBig ? 'p-4' : isMedium ? 'p-3' : 'p-2'} text-center bg-white flex-grow flex flex-col justify-center items-center relative z-20`}>
                                  <h4 className={`font-heading text-[#333] leading-tight line-clamp-2 ${
                                    isBig ? 'text-base md:text-lg' : isMedium ? 'text-sm md:text-base' : 'text-[0.7rem] sm:text-xs'
                                  }`}>
                                    {sponsor.brandName}
                                  </h4>
                                  {sponsor.website && (
                                    <a 
                                      href={sponsor.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={`mt-1 text-[#1a9fb5] font-bold font-body inline-flex items-center gap-1 hover:underline underline-offset-2 ${
                                        isBig ? 'text-sm' : isMedium ? 'text-[0.7rem]' : 'text-[0.6rem]'
                                      }`}
                                    >
                                      {isSmall ? 'Link' : 'Visit Website'} <ExternalLink className={isBig ? 'w-4 h-4' : 'w-3 h-3'} />
                                    </a>
                                  )}
                                </div>
                                
                                {/* Tier Accent Bar */}
                                <div className={`${isBig ? 'h-2' : 'h-1.5'} w-full`} style={{ background: config.color, opacity: 0.9 }} />
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* Sponsorship Tiers */}
      {(settings?.isSponsorshipOpen !== false) && (
        <section style={{ padding: '4rem 0', background: '#f5f3ee', position: 'relative' }}>
          <StemBackground numberOfEmojis={30} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1a9fb5' }}>Sponsorship Opportunities 📊</h2>
            <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginTop: '0.5rem' }}>Tiered partnerships designed to maximise brand visibility and ROI.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { tier: 'Title Sponsor', price: '₹10 Lakhs', emoji: '👑', perks: ['Event naming rights', 'All-media prominence', 'VIP booth', 'PR features'], highlight: true },
              { tier: 'Platinum', price: '₹5 Lakhs', emoji: '💎', perks: ['Zone naming rights', 'Dedicated branded area', 'Stage mentions', 'Social media'] },
              { tier: 'Gold', price: '₹3 Lakhs', emoji: '🥇', perks: ['Activity partner', 'Prime booth', 'Stage mentions', 'Social media'] },
              { tier: 'Silver', price: '₹1.5 Lakhs', emoji: '🥈', perks: ['Brand visibility', 'Event collateral', 'Digital branding', 'Certificate'] },
            ].map((t) => (
              <div key={t.tier}
                style={{
                  background: '#fff', borderRadius: '16px', padding: '1.5rem',
                  border: `2px solid ${t.highlight ? '#f59e0b' : '#e8e4dc'}`,
                  position: 'relative', transition: 'all .25s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {t.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', fontSize: '0.7rem', fontFamily: 'Lilita One, sans-serif', padding: '3px 14px', borderRadius: '50px', letterSpacing: '0.06em' }}>
                    NAMING RIGHTS
                  </div>
                )}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{t.emoji}</span>
                  <h3 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', color: '#1a1a1a', marginTop: '0.35rem' }}>{t.tier}</h3>
                  <p style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.15rem', color: '#e63228', marginTop: '0.25rem' }}>{t.price}</p>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {t.perks.map((p) => (
                    <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontFamily: 'Signika, sans-serif', fontSize: '0.85rem', color: '#555' }}>
                      <CheckCircle style={{ width: 14, height: 14, color: '#2db46b', flexShrink: 0, marginTop: '2px' }} /> {p}
                    </li>
                  ))}
                </ul>
                <a href="#become-sponsor"
                  style={{
                    display: 'block', textAlign: 'center', padding: '0.6rem', borderRadius: '10px',
                    fontFamily: 'Lilita One, sans-serif', fontSize: '0.88rem',
                    background: t.highlight ? '#f7941d' : '#f5f3ee',
                    color: t.highlight ? '#fff' : '#555',
                    textDecoration: 'none', transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.highlight ? '#d97b10' : '#e8e4dc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = t.highlight ? '#f7941d' : '#f5f3ee'; }}
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: 'Signika, sans-serif', fontSize: '0.85rem', color: '#888' }}>
            Also available: <strong>Stall Partners</strong> — Exhibition booths with direct access to 5,000+ families
          </div>
        </div>
      </section>
      )}

      {/* Sponsor Form */}
      {(settings?.isSponsorshipOpen !== false) && (
      <section id="become-sponsor" style={{ padding: '4rem 0', background: '#fff', position: 'relative' }}>
        <StemBackground numberOfEmojis={30} />
        <div className="max-w-4xl mx-auto px-4">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1a9fb5' }}>Become a Sponsor 🤝</h2>
            <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginTop: '0.5rem' }}>Fill out the form and our team will get in touch!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="animate-slide-up"
                style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,.08)', border: '1.5px solid #f0ede6', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: 42, height: 42, background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 style={{ width: 20, height: 20, color: '#f7941d' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', color: '#1a1a1a' }}>Sponsorship Enquiry</h3>
                    <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.82rem', color: '#888' }}>Tell us about your brand</p>
                  </div>
                </div>

                {[
                  { key: 'brandName', label: 'Brand Name *', placeholder: 'Your brand name', type: 'text' },
                  { key: 'contactPerson', label: 'Contact Person *', placeholder: 'Full name', type: 'text' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>{label}</label>
                    <input type={type} value={form[key]} placeholder={placeholder} required
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = '#f7941d'}
                      onBlur={(e) => e.target.style.borderColor = '#e8e4dc'}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'email', label: 'Email *', placeholder: 'you@brand.com', type: 'email' },
                    { key: 'phone', label: 'Phone *', placeholder: '+91 98765 43210', type: 'tel' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>{label}</label>
                      <input type={type} value={form[key]} placeholder={placeholder} required
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#f7941d'}
                        onBlur={(e) => e.target.style.borderColor = '#e8e4dc'}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>Interest Tier</label>
                  <select value={form.interestTier} onChange={(e) => setForm({ ...form, interestTier: e.target.value })} style={inputStyle}>
                    <option value="">Select tier (optional)</option>
                    <option value="Title Sponsor">Title Sponsor — ₹10 Lakhs</option>
                    <option value="Platinum Sponsor">Platinum — ₹5 Lakhs</option>
                    <option value="Gold Sponsor">Gold — ₹3 Lakhs</option>
                    <option value="Silver Sponsor">Silver — ₹1.5 Lakhs</option>
                    <option value="Stall / Booth">Stall Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>Brochure (optional)</label>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.25rem', border: '2px dashed #e8e4dc', borderRadius: '12px', cursor: 'pointer', transition: 'border-color .2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f7941d'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e8e4dc'}
                  >
                    <Upload style={{ width: 18, height: 18, color: '#aaa' }} />
                    <span style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.88rem', color: '#888' }}>{brochure ? brochure.name : 'Upload PDF or image'}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => setBrochure(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                  </label>
                </div>

                <button type="submit" disabled={submitting}
                  style={{
                    width: '100%', padding: '0.85rem', background: '#f7941d', color: '#fff',
                    fontFamily: 'Lilita One, sans-serif', fontSize: '1rem', border: 'none', borderRadius: '12px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: submitting ? 0.6 : 1, transition: 'all .2s', letterSpacing: '0.02em',
                  }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = '#d97b10')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f7941d')}
                >
                  {submitting ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : <Building2 style={{ width: 18, height: 18 }} />}
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 animate-slide-up delay-300" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.15rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Why Sponsor Us? 📈</h3>
              {[
                { icon: Eye, title: '5,000+ Premium Families', desc: 'Education-focused households with strong purchasing power.' },
                { icon: Star, title: 'Cultural Brand Positioning', desc: 'Align with arts, literature & creativity values.' },
                { icon: Users, title: 'CSR Education Impact', desc: 'Tangible education contributions for CSR reporting.' },
                { icon: TrendingUp, title: 'Lead Gen & Amplification', desc: 'On-ground engagement + social media visibility.' },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="card-border" style={{ display: 'flex', gap: '0.75rem', padding: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 18, height: 18, color: '#f7941d' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Lilita One, sans-serif', color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '0.15rem' }}>{p.title}</p>
                      <p style={{ fontFamily: 'Signika, sans-serif', color: '#777', fontSize: '0.8rem' }}>{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      )}

    </div>
  );
}