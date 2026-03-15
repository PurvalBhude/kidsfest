import { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, Star, Cpu, Rocket, Lightbulb, Microscope, Sparkles } from 'lucide-react';

const funIcons = [Star, Cpu, Rocket, Lightbulb, Microscope, Sparkles];

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    api.get('/public/data')
      .then(({ data }) => {
        const d = data.data || data;
        setActivities(d.activities || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const categories = ['All', ...new Set(activities.map((a) => a.category).filter(Boolean))];

  const filtered = activities.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee' }}>
      {/* Header Banner */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#1a9fb5', padding: '4rem 1rem', textAlign: 'center' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(230,50,40,.15)' }} />

        {['🎭', '🎨', '📚', '🎪', '🌟'].map((e, i) => (
          <span key={i} className="animate-float" style={{
            position: 'absolute', fontSize: '2rem', opacity: 0.2,
            top: `${10 + i * 18}%`, left: `${5 + i * 20}%`,
            animationDelay: `${i * 0.6}s`,
          }}>{e}</span>
        ))}

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <h1 className="animate-slide-up"
            style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', marginBottom: '0.75rem' }}>
            🎨 Activities & Experiences
          </h1>
          <p className="animate-slide-up delay-100"
            style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.88)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto' }}>
            Discover all the hands-on fun activities, shows, and workshops at our festival!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up delay-200">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#888' }} />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.85rem', paddingBottom: '0.85rem',
                borderRadius: '50px', border: '2px solid #e8e4dc', outline: 'none', background: '#fff',
                fontFamily: 'Signika, sans-serif', fontSize: '0.95rem', color: '#333',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.2rem', borderRadius: '50px', border: '2px solid',
                  fontFamily: 'Lilita One, sans-serif', fontSize: '0.82rem', cursor: 'pointer', transition: 'all .2s',
                  borderColor: selectedCategory === cat ? '#1a9fb5' : '#e8e4dc',
                  background: selectedCategory === cat ? '#1a9fb5' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#555',
                  letterSpacing: '0.02em',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p style={{ fontFamily: 'Signika, sans-serif', color: '#888', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          {filtered.length} activities found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in" style={{ color: '#aaa' }}>
            <Filter style={{ width: 56, height: 56, margin: '0 auto 1rem', opacity: 0.4 }} />
            <p style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.2rem' }}>No activities found</p>
            <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.9rem', marginTop: '0.35rem' }}>Try a different search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((activity, idx) => {
              const Icon = funIcons[idx % funIcons.length];
              return (
                <div
                  key={activity._id}
                  className="kk-card animate-slide-up group"
                  style={{ animationDelay: `${Math.min(idx * 0.07, 0.5)}s`, position: 'relative', aspectRatio: '1/1' }}
                >
                  {activity.imageUrl ? (
                    <img
                      src={activity.imageUrl}
                      alt={activity.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s' }}
                      className="group-hover:scale-110"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a9fb520,#e6322820)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 52, height: 52, color: '#1a9fb550' }} />
                    </div>
                  )}
                  {/* Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.05) 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.75rem' }}>
                    <span style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', fontSize: 'clamp(0.72rem,1.8vw,0.9rem)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {activity.title}
                    </span>
                    {activity.ageGroup && (
                      <span style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.75)', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                        Ages: {activity.ageGroup}
                      </span>
                    )}
                  </div>
                  {/* Hover desc */}
                  <div style={{
                    position: 'absolute', inset: 0, background: '#1a9fb5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem', opacity: 0, transition: 'opacity .3s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <p style={{ fontFamily: 'Signika, sans-serif', color: '#fff', textAlign: 'center', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {activity.description || activity.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
