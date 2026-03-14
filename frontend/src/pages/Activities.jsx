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
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-purple-600 to-accent py-16 sm:py-24 text-white text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-300/15 rounded-full blur-2xl" />
          {['🤖', '🚀', '🔬', '⚡', '💡'].map((e, i) => (
            <span key={i} className="absolute text-3xl opacity-20 animate-float"
              style={{ top: `${10 + i * 18}%`, left: `${5 + i * 20}%`, animationDelay: `${i * 0.6}s` }}>
              {e}
            </span>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
            Activities & Experiences 🔬
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto animate-slide-up delay-100">
            Discover 25+ hands-on STEM activities, maker challenges, and live shows at Intellofest!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up delay-200">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4 font-medium">{filtered.length} activities found</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 animate-fade-in">
            <Filter className="w-14 h-14 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-semibold">No activities found</p>
            <p className="text-sm mt-1">Try a different search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((activity, idx) => {
              const Icon = funIcons[idx % funIcons.length];
              return (
                <div
                  key={activity._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group animate-slide-up"
                  style={{ animationDelay: `${Math.min(idx * 0.08, 0.6)}s` }}
                >
                  {activity.imageUrl ? (
                    <div className="overflow-hidden">
                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-52 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {activity.category}
                      </span>
                      {activity.ageGroup && (
                        <span className="px-3 py-1 bg-secondary/10 text-secondary-dark text-xs font-semibold rounded-full">
                          Ages: {activity.ageGroup}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                    {activity.description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{activity.description}</p>
                    )}
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
