import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Building2, Loader2, CheckCircle, Upload, Star, Users, TrendingUp, Eye, Award, Crown, Medal, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [loadingSponsors, setLoadingSponsors] = useState(true);
  const [form, setForm] = useState({
    brandName: '', contactPerson: '', email: '', phone: '', interestTier: '',
  });
  const [brochure, setBrochure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get('/public/sponsors')
      .then(({ data }) => setSponsors(data.data || []))
      .catch(() => {})
      .finally(() => setLoadingSponsors(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandName.trim() || !form.contactPerson.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Please fill in all required fields');
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
  const groupedSponsors = {};
  sponsors.forEach((s) => {
    const tier = s.tier || 'Other';
    if (!groupedSponsors[tier]) groupedSponsors[tier] = [];
    groupedSponsors[tier].push(s);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee' }}>
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

      {/* Sponsors Grid */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#1a9fb5' }}>
              Our Proud Partners ⭐
            </h2>
            <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginTop: '0.5rem' }}>
              Thank you to our incredible sponsors who make the festival possible!
            </p>
          </div>

          {loadingSponsors ? (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {tierOrder.map((tier) => {
                const list = groupedSponsors[tier];
                if (!list || list.length === 0) return null;
                const config = tierConfig[tier] || tierConfig['Stall / Booth'];
                const TierIcon = config.badge;
                return (
                  <div key={tier} className="animate-slide-up">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <TierIcon style={{ width: 18, height: 18, color: config.color }} />
                      <h3 style={{ fontFamily: 'Lilita One, sans-serif', color: '#444', fontSize: '1.05rem' }}>{config.label}</h3>
                    </div>
                    <div className={`grid gap-4 ${
                      tier === 'Title Sponsor' ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' :
                      tier === 'Platinum Sponsor' || tier === 'Gold Sponsor' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
                      'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                    }`}>
                      {list.map((sponsor) => (
                        <div key={sponsor._id}
                          style={{ background: config.bg, borderRadius: '14px', padding: '1.25rem', textAlign: 'center', border: `2px solid ${config.border}30`, transition: 'all .25s', cursor: 'default' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          {sponsor.logoUrl ? (
                            <img src={sponsor.logoUrl} alt={sponsor.brandName} style={{ width: 64, height: 64, margin: '0 auto 0.75rem', borderRadius: '10px', objectFit: 'contain' }} />
                          ) : (
                            <div style={{ width: 64, height: 64, margin: '0 auto 0.75rem', borderRadius: '10px', background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', fontSize: '1.5rem' }}>{sponsor.brandName.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <h4 style={{ fontFamily: 'Lilita One, sans-serif', color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{sponsor.brandName}</h4>
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                              style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.75rem', color: '#1a9fb5', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                              Visit <ExternalLink style={{ width: 11, height: 11 }} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section style={{ padding: '4rem 0', background: '#f5f3ee' }}>
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

      {/* Sponsor Form */}
      <section id="become-sponsor" style={{ padding: '4rem 0', background: '#fff' }}>
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
    </div>
  );
}
