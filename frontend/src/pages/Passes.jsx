import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ticket, Minus, Plus, ShoppingCart, Zap, Users, Shield, Star } from 'lucide-react';

export default function Passes() {
  const [passes, setPasses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/public/passes')
      .then(({ data }) => {
        setPasses(data.data?.passes || data.passes || []);
        setIsOpen(data.data?.isRegistrationOpen ?? data.isRegistrationOpen ?? false);
      })
      .catch(() => toast.error('Failed to load passes'))
      .finally(() => setLoading(false));
  }, []);

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [passId, qty]) => {
    const pass = passes.find((p) => p._id === passId);
    if (!pass) return sum;
    const price = pass.price ?? (pass.isEarlyBird ? pass.earlyBirdPrice : pass.regularPrice);
    return sum + price * qty;
  }, 0);

  const handleCheckout = () => {
    if (totalItems === 0) {
      toast.error('Please select at least one pass');
      return;
    }
    const items = Object.entries(cart).map(([passId, quantity]) => ({ passId, quantity }));
    navigate('/checkout', { state: { items, passes } });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee' }}>
      {/* Header */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#e63228', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(247,148,29,.2)' }} />

        {['🎟️', '🎪', '🌟', '🎭'].map((e, i) => (
          <span key={i} className="animate-float" style={{
            position: 'absolute', fontSize: '2rem', opacity: 0.18,
            top: `${15 + i * 20}%`, left: `${10 + i * 22}%`,
            animationDelay: `${i * 0.8}s`,
          }}>{e}</span>
        ))}

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,.18)', borderRadius: '50px', padding: '0.35rem 1rem', marginBottom: '1rem', fontFamily: 'Signika, sans-serif', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
            <Star style={{ width: 14, height: 14 }} /> Limited Availability
          </div>
          <h1 className="animate-slide-up"
            style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', marginBottom: '0.75rem' }}>
            Get Your Passes 🎟️
          </h1>
          <p className="animate-slide-up delay-100"
            style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.88)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto' }}>
            Choose from various pass types and secure your spot at India's biggest arts & literature festival for kids!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isOpen ? (
          <div className="text-center py-20 animate-fade-in">
            <div style={{ width: 96, height: 96, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}>
              <Ticket style={{ width: 48, height: 48, color: '#e63228' }} />
            </div>
            <h2 style={{ fontFamily: 'Lilita One, sans-serif', color: '#333', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Registration is Currently Closed</h2>
            <p style={{ fontFamily: 'Signika, sans-serif', color: '#888', maxWidth: 400, margin: '0 auto' }}>
              Check back soon! We'll open registrations shortly. Follow us for updates.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {passes.map((pass, idx) => {
                const qty = cart[pass._id] || 0;
                const available = pass.available ?? (pass.capacity - (pass.sold || 0));
                const isEarlyBird = pass.isEarlyBird ?? pass.isEarlyBirdActive;
                const price = pass.price ?? (isEarlyBird ? pass.earlyBirdPrice : pass.regularPrice);

                return (
                  <div
                    key={pass._id}
                    className="animate-slide-up"
                    style={{
                      position: 'relative', background: '#fff', borderRadius: '16px',
                      boxShadow: qty > 0 ? '0 0 0 3px #e63228, 0 8px 24px rgba(230,50,40,.15)' : '0 2px 12px rgba(0,0,0,.08)',
                      padding: '1.5rem', transition: 'box-shadow .25s, transform .25s',
                      transform: qty > 0 ? 'translateY(-2px)' : 'none',
                      animationDelay: `${idx * 0.1}s`,
                      border: '2px solid ' + (qty > 0 ? '#e63228' : '#f0ede6'),
                    }}
                  >
                    {isEarlyBird && (
                      <div style={{
                        position: 'absolute', top: -14, left: 20,
                        background: 'linear-gradient(to right, #e63228, #f7941d)',
                        color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px',
                        borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'Lilita One, sans-serif', letterSpacing: '0.04em', boxShadow: '0 2px 8px rgba(230,50,40,.3)',
                      }}>
                        <Zap style={{ width: 11, height: 11 }} /> Early Bird Offer
                      </div>
                    )}

                    <h3 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '0.35rem', marginTop: isEarlyBird ? '0.5rem' : 0 }}>
                      {pass.name}
                    </h3>
                    {pass.description && (
                      <p style={{ fontFamily: 'Signika, sans-serif', color: '#666', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.55 }}>
                        {pass.description}
                      </p>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                      {isEarlyBird && (
                        <span style={{ fontFamily: 'Signika, sans-serif', color: '#bbb', textDecoration: 'line-through', fontSize: '1.05rem', marginRight: '0.5rem' }}>
                          ₹{pass.regularPrice}
                        </span>
                      )}
                      <span style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.8rem', color: '#e63228' }}>₹{price}</span>
                      <span style={{ fontFamily: 'Signika, sans-serif', color: '#888', fontSize: '0.85rem' }}> / person</span>
                    </div>

                    {pass.minQuantityForDiscount > 0 && (
                      <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.8rem', color: '#2db46b', background: '#f0fdf4', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '1rem' }}>
                        🎉 Buy {pass.minQuantityForDiscount}+ and get {pass.bulkDiscountPercentage}% off!
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'Signika, sans-serif', fontSize: '0.85rem', color: '#888' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: available <= 10 ? '#e63228' : '#888', fontWeight: available <= 10 ? 600 : 400 }}>
                        <Users style={{ width: 14, height: 14 }} />
                        {available <= 10 ? `Only ${available} left!` : `${available} spots left`}
                      </span>
                    </div>

                    {available > 0 && (pass.isRegistrationOpen !== false) ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', background: '#f5f3ee', borderRadius: '12px', padding: '0.75rem' }}>
                        <button
                          onClick={() => updateQty(pass._id, -1)}
                          disabled={qty === 0}
                          style={{
                            width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '1.5px solid #e8e4dc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            opacity: qty === 0 ? 0.3 : 1, transition: 'all .2s',
                          }}
                        >
                          <Minus style={{ width: 15, height: 15, color: '#333' }} />
                        </button>
                        <span style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.5rem', color: '#e63228', width: 28, textAlign: 'center' }}>{qty}</span>
                        <button
                          onClick={() => updateQty(pass._id, 1)}
                          disabled={qty >= available}
                          style={{
                            width: 38, height: 38, borderRadius: '50%', background: '#e63228', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            opacity: qty >= available ? 0.3 : 1, transition: 'all .2s',
                          }}
                        >
                          <Plus style={{ width: 15, height: 15, color: '#fff' }} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '0.75rem', fontFamily: 'Lilita One, sans-serif', color: '#e63228', background: '#fff0f0', borderRadius: '12px', fontSize: '0.9rem' }}>
                        {available <= 0 ? '🚫 Sold Out!' : 'Registration Closed'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', padding: '1.5rem 0', fontFamily: 'Signika, sans-serif', fontSize: '0.87rem', color: '#666' }}>
              {[
                { icon: Shield, text: '100% Secure Payment' },
                { icon: Ticket, text: 'Instant E-Ticket' },
                { icon: Star, text: '5000+ Happy Families' },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon style={{ width: 16, height: 16, color: '#1a9fb5' }} />
                    <span style={{ fontWeight: 500 }}>{badge.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Sticky Cart */}
            {totalItems > 0 && (
              <div className="animate-slide-up" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(10px)',
                borderTop: '2px solid #f0ede6', boxShadow: '0 -4px 24px rgba(0,0,0,.1)',
                zIndex: 40, padding: '1rem',
              }}>
                <div className="max-w-7xl mx-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.88rem', color: '#666' }}>
                      <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{totalItems}</span> pass{totalItems > 1 ? 'es' : ''} selected
                    </p>
                    <p style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.5rem', color: '#e63228' }}>₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem',
                      background: '#e63228', color: '#fff', fontFamily: 'Lilita One, sans-serif',
                      fontSize: '1rem', borderRadius: '50px', border: 'none', cursor: 'pointer',
                      letterSpacing: '0.02em', transition: 'all .2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#c0281f'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#e63228'}
                  >
                    <ShoppingCart style={{ width: 18, height: 18 }} /> Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
