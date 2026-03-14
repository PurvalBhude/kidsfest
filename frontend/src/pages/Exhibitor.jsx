import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Building2, Loader2, CheckCircle, Upload, Star, Users, TrendingUp, Eye, Award, Crown, Medal, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const tierConfig = {
  'Title Sponsor': { color: 'from-yellow-400 to-amber-500', badge: Crown, label: '👑 Title Sponsor', ring: 'ring-amber-400', bg: 'bg-amber-50' },
  'Platinum Sponsor': { color: 'from-indigo-400 to-purple-500', badge: Award, label: '💎 Platinum', ring: 'ring-purple-400', bg: 'bg-purple-50' },
  'Gold Sponsor': { color: 'from-yellow-300 to-yellow-500', badge: Award, label: '🥇 Gold', ring: 'ring-yellow-400', bg: 'bg-yellow-50' },
  'Silver Sponsor': { color: 'from-gray-300 to-gray-400', badge: Medal, label: '🥈 Silver', ring: 'ring-gray-400', bg: 'bg-gray-100' },
  'Stall / Booth': { color: 'from-orange-400 to-orange-500', badge: Building2, label: '🏪 Stall Partner', ring: 'ring-orange-300', bg: 'bg-orange-50' },
  'Food Partner': { color: 'from-red-400 to-red-500', badge: Star, label: '🍕 Food Partner', ring: 'ring-red-300', bg: 'bg-red-50' },
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
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center max-w-md w-full animate-slide-up">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You! 🚀</h2>
          <p className="text-gray-600 mb-6">
            Your sponsorship enquiry has been submitted. Our team will reach out shortly!
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-full hover:bg-secondary-dark transition-colors">
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
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-br from-secondary via-orange-500 to-red-400 py-16 sm:py-24 text-white text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          {['🚀', '🤝', '💎', '🏢'].map((e, i) => (
            <span key={i} className="absolute text-3xl opacity-20 animate-float"
              style={{ top: `${10 + i * 22}%`, left: `${8 + i * 25}%`, animationDelay: `${i * 0.7}s` }}>{e}</span>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">Sponsors & Partners 🚀</h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto animate-slide-up delay-100">
            Meet the brands powering Intellofest — and partner with us!
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Proud Partners ⭐</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Thank you to our incredible sponsors who make Intellofest possible!
            </p>
          </div>
          {loadingSponsors ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-secondary animate-spin" /></div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-orange-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Be Our First Sponsor!</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">Sponsorship spots are open. Get premium brand visibility to 2,000+ families!</p>
              <a href="#become-sponsor" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-full hover:bg-secondary-dark transition-all hover:scale-105">Apply Now</a>
            </div>
          ) : (
            <div className="space-y-12">
              {tierOrder.map((tier) => {
                const list = groupedSponsors[tier];
                if (!list || list.length === 0) return null;
                const config = tierConfig[tier] || tierConfig['Stall / Booth'];
                const TierIcon = config.badge;
                return (
                  <div key={tier} className="animate-slide-up">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <TierIcon className="w-5 h-5 text-amber-500" />
                      <h3 className="text-lg font-bold text-gray-700">{config.label}</h3>
                    </div>
                    <div className={`grid gap-4 ${
                      tier === 'Title Sponsor' ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' :
                      tier === 'Platinum Sponsor' || tier === 'Gold Sponsor' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
                      'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                    }`}>
                      {list.map((sponsor) => (
                        <div key={sponsor._id} className={`${config.bg} rounded-2xl p-5 text-center ring-2 ${config.ring} ring-opacity-30 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1`}>
                          {sponsor.logoUrl ? (
                            <img src={sponsor.logoUrl} alt={sponsor.brandName} className="w-16 h-16 mx-auto mb-3 rounded-xl object-contain" />
                          ) : (
                            <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-linear-to-br ${config.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                              <span className="text-white font-bold text-xl">{sponsor.brandName.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{sponsor.brandName}</h4>
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-secondary hover:underline mt-1">
                              Visit <ExternalLink className="w-3 h-3" />
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

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Sponsorship Opportunities 📊</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Tiered partnerships designed to maximize brand visibility and ROI.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { tier: 'Title Sponsor', price: '₹10 Lakhs', emoji: '👑', perks: ['Event naming rights', 'All-media prominence', 'VIP booth', 'PR features'], highlight: true },
              { tier: 'Platinum', price: '₹5 Lakhs', emoji: '💎', perks: ['Zone naming rights', 'Dedicated branded area', 'Stage mentions', 'Social media'] },
              { tier: 'Gold', price: '₹3 Lakhs', emoji: '🥇', perks: ['Activity partner', 'Prime booth', 'Stage mentions', 'Social media'] },
              { tier: 'Silver', price: '₹1.5 Lakhs', emoji: '🥈', perks: ['Brand visibility', 'Event collateral', 'Digital branding', 'Certificate'] },
            ].map((t) => (
              <div key={t.tier} className={`bg-white rounded-2xl p-6 border-2 hover:shadow-xl transition-all hover:-translate-y-1 ${t.highlight ? 'border-amber-400 relative' : 'border-gray-100'}`}>
                {t.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-bold px-4 py-1 rounded-full">NAMING RIGHTS</div>}
                <div className="text-center mb-4">
                  <span className="text-4xl">{t.emoji}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{t.tier}</h3>
                  <p className="text-lg font-bold text-primary mt-1">{t.price}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
                <a href="#become-sponsor" className={`block text-center py-2.5 rounded-xl font-bold text-sm transition-all ${t.highlight ? 'bg-secondary text-white hover:bg-secondary-dark' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Apply Now
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">Also available: <strong>Stall Partners</strong> — Exhibition booths with direct access to 2,000+ families</p>
          </div>
        </div>
      </section>

      <section id="become-sponsor" className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Become a Sponsor 🤝</h2>
            <p className="text-gray-600 text-lg">Fill out the form and our team will get in touch!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-5 animate-slide-up border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Sponsorship Enquiry</h3>
                    <p className="text-sm text-gray-500">Tell us about your brand</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                  <input type="text" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="Your brand name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                  <input type="text" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="Full name" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="you@brand.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none" placeholder="+91 98765 43210" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Tier</label>
                  <select value={form.interestTier} onChange={(e) => setForm({ ...form, interestTier: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brochure (optional)</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-5 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-secondary hover:bg-orange-50/50 transition-all">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">{brochure ? brochure.name : 'Upload PDF or image'}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => setBrochure(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Building2 className="w-5 h-5" />}
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4 animate-slide-up delay-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Why Sponsor Intellofest? 📈</h3>
              {[
                { icon: Eye, title: '2,000+ Premium Families', desc: 'Education-focused households with strong purchasing power.' },
                { icon: Star, title: 'Innovation Positioning', desc: 'Align with cutting-edge STEM and future tech values.' },
                { icon: Users, title: 'CSR Education Impact', desc: 'Tangible STEM education contributions for CSR reporting.' },
                { icon: TrendingUp, title: 'Lead Gen & Amplification', desc: 'On-ground engagement + social media visibility.' },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.title}</p>
                      <p className="text-xs text-gray-500">{p.desc}</p>
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
