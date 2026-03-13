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
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-linear-to-br from-secondary via-orange-500 to-red-400 py-16 sm:py-24 text-white text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-300/15 rounded-full blur-2xl" />
          {['🎟️', '🎪', '🎠', '🎡'].map((e, i) => (
            <span key={i} className="absolute text-3xl opacity-20 animate-float"
              style={{ top: `${15 + i * 20}%`, left: `${10 + i * 22}%`, animationDelay: `${i * 0.8}s` }}>
              {e}
            </span>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 text-sm font-semibold">
            <Star className="w-4 h-4" /> Limited Availability
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Get Your Passes 🎟️</h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto">
            Choose from various pass types and secure your spot at the most exciting kids festival!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isOpen ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Registration is Currently Closed</h2>
            <p className="text-gray-500 max-w-md mx-auto">
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
                    className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 animate-slide-up ${
                      qty > 0 ? 'border-primary animate-pulse-glow' : 'border-transparent'
                    }`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {isEarlyBird && (
                      <div className="absolute -top-3 left-6 bg-linear-to-r from-accent to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Zap className="w-3 h-3" /> Early Bird Offer
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-2 mt-1">{pass.name}</h3>
                    {pass.description && (
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{pass.description}</p>
                    )}

                    <div className="mb-4">
                      {isEarlyBird && (
                        <span className="text-gray-400 line-through text-lg mr-2">
                          ₹{pass.regularPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-primary">₹{price}</span>
                      <span className="text-gray-500 text-sm"> / person</span>
                    </div>

                    {pass.minQuantityForDiscount > 0 && (
                      <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4 font-medium">
                        🎉 Buy {pass.minQuantityForDiscount}+ and get {pass.bulkDiscountPercentage}% off!
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className={available <= 10 ? 'text-red-500 font-semibold' : ''}>
                          {available <= 10 ? `Only ${available} left!` : `${available} spots left`}
                        </span>
                      </span>
                    </div>

                    {available > 0 && (pass.isRegistrationOpen !== false) ? (
                      <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl py-3">
                        <button
                          onClick={() => updateQty(pass._id, -1)}
                          disabled={qty === 0}
                          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-all hover:scale-110 active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-2xl font-bold w-8 text-center text-primary">{qty}</span>
                        <button
                          onClick={() => updateQty(pass._id, 1)}
                          disabled={qty >= available}
                          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-30 transition-all hover:scale-110 active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-red-500 font-semibold bg-red-50 rounded-xl">
                        {available <= 0 ? '🚫 Sold Out!' : 'Registration Closed'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 py-6">
              {[
                { icon: Shield, text: '100% Secure Payment' },
                { icon: Ticket, text: 'Instant E-Ticket' },
                { icon: Star, text: '5000+ Happy Families' },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-medium">{badge.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Sticky Cart */}
            {totalItems > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t shadow-2xl z-40 p-4 animate-slide-up">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-gray-900">{totalItems}</span> pass{totalItems > 1 ? 'es' : ''} selected
                    </p>
                    <p className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="flex items-center gap-2 px-8 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-full text-lg transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" /> Proceed to Checkout
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
