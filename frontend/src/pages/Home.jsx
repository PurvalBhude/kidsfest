import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles, Ticket, Users, Building2, Calendar, MapPin,
  ArrowRight, Star, Music, Palette, Trophy, Heart,
  ChevronDown, Shield, Clock, Gift,
} from 'lucide-react';

const funIcons = [Star, Music, Palette, Trophy, Heart, Sparkles];

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    api.get('/public/data')
      .then(({ data }) => {
        const d = data.data || data;
        setSettings(d.settings);
        setActivities(d.activities || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const faqs = [
    { q: 'What age group is KidsFest for?', a: 'KidsFest is designed for kids of all ages, from toddlers to teens! Each activity is tailored for specific age groups so everyone has a blast.' },
    { q: 'How do I book tickets?', a: 'Simply click the "Get Your Tickets" button, select the passes you want, and proceed to our secure checkout powered by Razorpay.' },
    { q: 'Can I cancel or refund my tickets?', a: 'Tickets are non-refundable but can be transferred to another person. Contact our support team for assistance.' },
    { q: 'Is food available at the venue?', a: 'Yes! We have a wide variety of food stalls offering delicious and kid-friendly options throughout the event.' },
    { q: 'Is parking available?', a: 'Yes, ample parking is available at the venue. We recommend arriving early as spots fill up fast!' },
    { q: 'What should I bring?', a: 'Bring your enthusiasm! We recommend comfortable clothing, sunscreen, and a water bottle. Everything else is provided by us.' },
  ];

  return (
    <div>
      {/* ───── Hero Section ───── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-purple-600 to-accent min-h-[85vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full" />
          {['🎈', '🎨', '🎭', '🎪', '🎠', '🎡', '⭐', '🎵', '🎸', '🎤'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-2xl sm:text-3xl opacity-25 animate-float"
              style={{
                top: `${8 + (i * 11) % 80}%`,
                left: `${3 + (i * 12) % 90}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + i * 0.6}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6 animate-slide-up">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">
              {settings?.eventDates || 'Dates Coming Soon'}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-slide-up delay-100">
            Welcome to{' '}
            <span className="text-secondary drop-shadow-lg animate-wiggle inline-block">
              {settings?.eventName || 'KidsFest'} 🎉
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up delay-200">
            The ultimate fun-filled festival for kids! 🎨 Art, 🎵 Music, 🎭 Drama, 🏆 Games
            and so much more. An unforgettable experience for the whole family!
          </p>

          {settings?.venue && (
            <div className="inline-flex items-center gap-2 text-white/90 mb-8 animate-slide-up delay-300">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{settings.venue}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
            <Link
              to="/passes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              <Ticket className="w-5 h-5" /> Get Your Tickets
            </Link>
            <Link
              to="/activities"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass hover:bg-white/20 text-white font-bold rounded-full text-lg transition-all"
            >
              Explore Activities <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Marquee Strip ───── */}
      <section className="bg-primary py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-white font-bold text-sm">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex gap-8 items-center">
              {['🎨 Creative Arts', '🎵 Live Music', '🎭 Drama & Theatre', '🏆 Competitions', '🍕 Food Stalls', '🎠 Carnival Rides', '📚 Book Fest', '🎪 Magic Shows'].map((f) => (
                <span key={`${rep}-${f}`} className="flex items-center gap-2 px-4">{f}</span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ───── Why KidsFest ───── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose KidsFest? ✨
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything fun in store — crafted to spark creativity, joy, and unforgettable memories.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Palette, title: 'Creative Workshops', desc: 'Hands-on art, craft, and DIY sessions guided by expert artists.', color: 'bg-purple-100 text-purple-600' },
              { icon: Music, title: 'Live Performances', desc: 'Music, drama, comedy, and dance shows that wow every age group.', color: 'bg-pink-100 text-pink-600' },
              { icon: Shield, title: 'Safe & Secure', desc: 'Child-safe environment with trained staff, CCTV, and first-aid.', color: 'bg-green-100 text-green-600' },
              { icon: Gift, title: 'Goodies & Prizes', desc: 'Exciting giveaways, competitions, and take-home treasures.', color: 'bg-amber-100 text-amber-600' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Activities Preview ───── */}
      {activities.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Exciting Activities 🎪
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From creative workshops to thrilling performances, there's something for every kid!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.slice(0, 6).map((activity, idx) => {
                const Icon = funIcons[idx % funIcons.length];
                return (
                  <div
                    key={activity._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {activity.imageUrl ? (
                      <div className="overflow-hidden">
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {activity.category}
                        </span>
                        {activity.ageGroup && (
                          <span className="px-3 py-1 bg-secondary/10 text-secondary-dark text-xs font-semibold rounded-full">
                            {activity.ageGroup}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{activity.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {activities.length > 6 && (
              <div className="text-center mt-10">
                <Link
                  to="/activities"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all hover:scale-105"
                >
                  View All Activities <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ───── CTA Cards ───── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Involved 🤝</h2>
            <p className="text-gray-600 text-lg">Be a part of the KidsFest magic!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/passes"
              className="group bg-linear-to-br from-primary to-purple-700 rounded-2xl p-8 text-white hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <Ticket className="w-10 h-10 mb-4 group-hover:animate-wiggle" />
              <h3 className="text-2xl font-bold mb-2">Get Tickets 🎟️</h3>
              <p className="text-white/80 mb-4">
                Book your passes now and join the biggest kids festival!
              </p>
              <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-3 transition-all">
                Book Now <ArrowRight className="w-5 h-5" />
              </span>
            </Link>

            <Link
              to="/volunteer"
              className="group bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <Users className="w-10 h-10 mb-4 group-hover:animate-wiggle" />
              <h3 className="text-2xl font-bold mb-2">Volunteer 🙋</h3>
              <p className="text-white/80 mb-4">
                Be a part of our amazing volunteer team and make a difference!
              </p>
              <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-3 transition-all">
                Join Us <ArrowRight className="w-5 h-5" />
              </span>
            </Link>

            <Link
              to="/exhibitor"
              className="group bg-linear-to-br from-secondary to-orange-500 rounded-2xl p-8 text-white hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <Building2 className="w-10 h-10 mb-4 group-hover:animate-wiggle" />
              <h3 className="text-2xl font-bold mb-2">Exhibit 🏪</h3>
              <p className="text-white/80 mb-4">
                Showcase your brand to thousands of families at KidsFest!
              </p>
              <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="py-16 bg-linear-to-r from-primary via-purple-600 to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {['✨', '🌟', '💫'].map((e, i) => (
            <span key={i} className="absolute text-4xl opacity-10 animate-float"
              style={{ top: `${20 + i * 25}%`, left: `${15 + i * 30}%`, animationDelay: `${i}s` }}>
              {e}
            </span>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '50+', label: 'Activities' },
              { num: '10K+', label: 'Kids Expected' },
              { num: '100+', label: 'Performers' },
              { num: '3', label: 'Fun-Filled Days' },
            ].map((s, i) => (
              <div key={s.label} className="animate-count-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-4xl sm:text-5xl font-bold mb-1">{s.num}</div>
                <div className="text-white/80 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Parents Say 💬</h2>
            <p className="text-gray-600 text-lg">Hear from families who loved KidsFest!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', text: 'My kids had the time of their lives! The art workshop was brilliant. Can\'t wait for next year!', role: 'Mother of 2' },
              { name: 'Rahul Mehta', text: 'Amazingly organized event. Safe, fun, and educational. The live performances were outstanding!', role: 'Father of 1' },
              { name: 'Anita Desai', text: 'Best kids festival in the city! My daughter loved the dance workshops and the carnival rides.', role: 'Mother of 3' },
            ].map((t, i) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions ❓
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to know about KidsFest</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                  <p className="px-6 text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="py-16 sm:py-20 bg-linear-to-r from-primary to-accent text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready for the Adventure? 🚀</h2>
          <p className="text-white/80 text-lg mb-8">
            Limited passes available. Don't miss out on the most exciting kids festival!
          </p>
          <Link
            to="/passes"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-full text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <Ticket className="w-6 h-6" /> Book Your Tickets Now
          </Link>
        </div>
      </section>
    </div>
  );
}
