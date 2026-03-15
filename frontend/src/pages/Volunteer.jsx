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
      <div style={{ minHeight: '100vh', background: '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="animate-slide-up" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,.1)', padding: '3rem', textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <div style={{ width: 80, height: 80, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle style={{ width: 44, height: 44, color: '#2db46b' }} />
          </div>
          <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Thank You! 🙋</h2>
          <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', marginBottom: '1.5rem' }}>
            Your volunteer application has been submitted. We'll review it and get back to you soon!
          </p>
          <Link to="/"
            style={{ fontFamily: 'Lilita One, sans-serif', background: '#2db46b', color: '#fff', borderRadius: '50px', padding: '0.65rem 2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
    border: '2px solid #e8e4dc', outline: 'none', fontFamily: 'Signika, sans-serif',
    fontSize: '0.95rem', color: '#333', background: '#faf9f6', boxSizing: 'border-box',
    transition: 'border-color .2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee' }}>
      {/* Header */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#2db46b', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
        {['🙋', '❤️', '🌟', '🤝'].map((e, i) => (
          <span key={i} className="animate-float" style={{
            position: 'absolute', fontSize: '2rem', opacity: 0.2,
            top: `${10 + i * 22}%`, left: `${8 + i * 25}%`,
            animationDelay: `${i * 0.7}s`,
          }}>{e}</span>
        ))}
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <h1 className="animate-slide-up"
            style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', marginBottom: '0.75rem' }}>
            Become a Volunteer 🙋
          </h1>
          <p className="animate-slide-up delay-100"
            style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.88)', fontSize: '1.05rem' }}>
            Join our incredible team and help make the festival magical for thousands of young minds!
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12" style={{ marginTop: '-2rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="animate-slide-up delay-200"
              style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,.08)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <div style={{ width: 42, height: 42, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users style={{ width: 20, height: 20, color: '#2db46b' }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.15rem', color: '#1a1a1a' }}>Volunteer Registration</h2>
                  <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.82rem', color: '#888' }}>Fill out the form below to apply</p>
                </div>
              </div>

              {[
                { key: 'fullName', label: 'Full Name *', placeholder: 'Your full name', type: 'text' },
                { key: 'email', label: 'Email *', placeholder: 'you@email.com', type: 'email' },
                { key: 'phone', label: 'Phone *', placeholder: '+91 98765 43210', type: 'tel' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>{label}</label>
                  <input type={type} value={form[key]} placeholder={placeholder} required
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#2db46b'}
                    onBlur={(e) => e.target.style.borderColor = '#e8e4dc'}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.4rem' }}>Preferred Role</label>
                <select value={form.preferredRole} onChange={(e) => setForm({ ...form, preferredRole: e.target.value })}
                  style={inputStyle}>
                  <option value="">Select a role (optional)</option>
                  <option value="Event Coordination">Event Coordination</option>
                  <option value="Activity Management">Activity / Stall Management</option>
                  <option value="Registration Desk">Registration Desk</option>
                  <option value="Stage Management">Stage & Show Management</option>
                  <option value="STEM Zone Support">Zone Support</option>
                  <option value="Arena Support">Arena Zone Support</option>
                  <option value="First Aid">First Aid</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit" disabled={submitting}
                style={{
                  width: '100%', padding: '0.85rem', background: '#2db46b', color: '#fff',
                  fontFamily: 'Lilita One, sans-serif', fontSize: '1rem', border: 'none', borderRadius: '12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: submitting ? 0.6 : 1, transition: 'all .2s', letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = '#1f9957')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2db46b')}
              >
                {submitting ? <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" /> : <Heart style={{ width: 18, height: 18 }} />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          {/* Perks */}
          <div className="lg:col-span-2 animate-slide-up delay-300" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Why Volunteer? 🌟</h3>
            {[
              { icon: Star, title: 'Certificate & Recognition', desc: 'Get an official volunteer certificate.' },
              { icon: Clock, title: 'Flexible Shifts', desc: 'Choose shifts that fit your schedule.' },
              { icon: Shield, title: 'Free Entry & Meals', desc: 'Complimentary festival access and meals.' },
              { icon: Heart, title: 'Make a Difference', desc: 'Help ignite creativity in young minds!' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="card-border" style={{ display: 'flex', gap: '0.75rem', padding: '1rem' }}>
                  <div style={{ width: 40, height: 40, background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 18, height: 18, color: '#2db46b' }} />
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
    </div>
  );
}
