import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Users, Heart, Loader2, CheckCircle, Star, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Volunteer() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', preferredRole: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/public/volunteer', form);
      setSubmitted(true);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center max-w-md w-full animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You! 🙋</h2>
          <p className="text-gray-600 mb-6">
            Your volunteer application has been submitted. We'll review it and get back to you soon!
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-br from-green-500 via-emerald-500 to-teal-500 py-16 sm:py-24 text-white text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          {['🙋', '❤️', '🌟', '🤝'].map((e, i) => (
            <span key={i} className="absolute text-3xl opacity-20 animate-float"
              style={{ top: `${10 + i * 22}%`, left: `${8 + i * 25}%`, animationDelay: `${i * 0.7}s` }}>
              {e}
            </span>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">Become a Volunteer 🙋</h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto animate-slide-up delay-100">
            Join our incredible team and help make Intellofest magical for thousands of young innovators!
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-5 animate-slide-up delay-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Volunteer Registration</h2>
                  <p className="text-sm text-gray-500">Fill out the form below to apply</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" placeholder="Your full name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" placeholder="you@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" placeholder="+91 98765 43210" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Role</label>
                <select value={form.preferredRole} onChange={(e) => setForm({ ...form, preferredRole: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                  <option value="">Select a role (optional)</option>
                  <option value="Event Coordination">Event Coordination</option>
                  <option value="Activity Management">Activity / Stall Management</option>
                  <option value="Registration Desk">Registration Desk</option>
                  <option value="Stage Management">Stage & Show Management</option>
                  <option value="STEM Zone Support">STEM Zone Support</option>
                  <option value="Arena Support">Arena Zone Support</option>
                  <option value="First Aid">First Aid</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          {/* Perks */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up delay-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Why Volunteer? 🌟</h3>
            {[
              { icon: Star, title: 'Certificate & Recognition', desc: 'Get an official volunteer certificate.' },
              { icon: Clock, title: 'Flexible Shifts', desc: 'Choose shifts that fit your schedule.' },
              { icon: Shield, title: 'Free Entry & Meals', desc: 'Complimentary festival access and meals.' },
              { icon: Heart, title: 'Make a Difference', desc: 'Help ignite curiosity in young minds!' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-green-600" />
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
    </div>
  );
}
