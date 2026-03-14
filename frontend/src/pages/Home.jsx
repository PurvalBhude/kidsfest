import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles, Ticket, Users, Building2, Calendar, MapPin,
  ArrowRight, Star, ChevronDown, Cpu, Rocket, Lightbulb, Microscope,
  Zap, Cog,
} from 'lucide-react';

const funIcons = [Star, Cpu, Rocket, Lightbulb, Microscope, Sparkles];

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
    { q: 'What is Intellofest?', a: 'Intellofest is a two-day mega STEM & Innovation Carnival — an electrifying collision of science, robotics, space, AI, engineering, and maker culture, all under one roof, designed to ignite curiosity in thousands of young minds.' },
    { q: 'What age group is Intellofest for?', a: 'Intellofest is designed for children ages 4–14, along with their parents and educators. Every zone and activity is curated for specific age groups.' },
    { q: 'How do I book tickets?', a: 'Click the "Get Your Passes" button, select the passes you want, and proceed to our secure checkout powered by Razorpay. You\'ll receive an e-ticket instantly.' },
    { q: 'Can I cancel or refund my tickets?', a: 'Tickets are non-refundable but fully transferable. Contact our support team if you\'d like to transfer to another person.' },
    { q: 'Is there a group / bulk booking discount?', a: 'Yes! Select 5 or more passes of the same type to unlock automatic group discounts at checkout.' },
    { q: 'Is food & parking available?', a: 'Yes! We have a curated food court with kid-friendly options, and ample parking is available near the venue. Arrive early as spots fill up fast.' },
    { q: 'What activities can kids expect?', a: 'From drone shows and AR/VR zones to robotics showcases, 3D printing, rocketry, science fire shows, maker challenges, and 25+ DIY activity stalls — there\'s something for every young innovator!' },
    { q: 'Are there sessions for parents?', a: 'Absolutely! We have expert panel discussions, new-age parenting roundtables, live podcasts, and drawing-based child analysis workshops for adults.' },
  ];

  return (
    <div>
      {/* ───── Hero Section ───── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-purple-600 to-accent min-h-[85vh] flex items-center">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full object-cover"
            src="https://www.youtube.com/embed/UWD7FS7QVMQ?si=XPnxKFr6f0CI5eM7&autoplay=1&mute=1&controls=0&loop=1&playlist=UWD7FS7QVMQ&modestbranding=1&rel=0"
            title="Intellofest Background Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              border: 'none',
              opacity: 0.9,
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full" />
          {/* {['🚀', '🤖', '🔬', '⚡', '🛸', '💡', '⭐', '🧬', '🔭', '🧪'].map((emoji, i) => (
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
          ))} */}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6 animate-slide-up">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">
              {settings?.eventDates || 'Dates Coming Soon'}
            </span>
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-bold mb-3 animate-slide-up delay-75">By TinkerDen</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-slide-up delay-100">
            Welcome to{' '}
            <span className="text-secondary drop-shadow-lg animate-wiggle inline-block">
              {settings?.eventName || 'Intellofest 2026'} 
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up delay-200">
            Surat's Biggest Kids STEM & Innovation Carnival! 🔬 Science, 🤖 Robotics, 🚀 Space, 💡 AI & Engineering
            — an electrifying experience for the whole family!
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
      {/* <section className="bg-primary py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-white font-bold text-sm">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex gap-8 items-center">
              {['🤖 Robotics Arena', '🚀 Rocketry & 3D Printing', '🔬 Mega Science Show', '🛸 Drone Performances', '🥽 AR/VR Zones', '🔭 Smart Planetarium', '⚡ Maker Challenges', '🧬 25+ DIY Stalls'].map((f) => (
                <span key={`${rep}-${f}`} className="flex items-center gap-2 px-4">{f}</span>
              ))}
            </span>
          ))}
        </div>
      </section> */}

      {/* ───── Why KidsFest ───── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why {settings?.eventName || 'Intellofest 2026'}? ✨
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A movement, not just a moment — positioning Surat as a hub of future-ready learning.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Microscope, title: 'Experiential STEM', desc: 'Learning by doing — every zone is built around tactile, real-world scientific exploration that makes concepts stick.', color: 'bg-purple-100 text-purple-600' },
              { icon: Cog, title: 'Hands-On Engineering', desc: 'From building circuits to launching rockets, kids become engineers — designing, testing, and iterating in real time.', color: 'bg-blue-100 text-blue-600' },
              { icon: Lightbulb, title: 'Innovation Mindset', desc: 'Cultivating creative problem-solving and entrepreneurial thinking from an early age through challenge-based learning.', color: 'bg-green-100 text-green-600' },
              { icon: Cpu, title: 'Future Technologies', desc: 'AI, AR/VR, 3D printing, drones, and robotics — giving children firsthand access to the tools shaping tomorrow.', color: 'bg-amber-100 text-amber-600' },
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
                Hero Highlights & Activities 🔬
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From drone shows to robotics arenas, every experience is designed for spectacle, awe, and deep learning.
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
            <p className="text-gray-600 text-lg">Be a part of the Intellofest movement!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/passes"
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 h-80"
            >
              <img
                src="https://kukdukoo.com/images/exhibit-flea.jpg"
                alt="Get Passes"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Get Passes 🎟️</h3>
                <p className="text-white/90 mb-4">
                  Book your passes now and join Surat's biggest STEM carnival!
                </p>
                <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-3 transition-all w-fit">
                  Book Now <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>

            <Link
              to="/volunteer"
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 h-80"
            >
              <img
                src="https://kukdukoo.com/images/exhibit-expo.jpg"
                alt="Volunteer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Volunteer 🙋</h3>
                <p className="text-white/90 mb-4">
                  Join our crew and help create magical STEM moments for kids!
                </p>
                <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-3 transition-all w-fit">
                  Join Us <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>

            <Link
              to="/exhibitor"
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 h-80"
            >
              <img
                src="https://kukdukoo.com/images/exhibit-sponsor.jpg"
                alt="Sponsor"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Sponsor 🏢</h3>
                <p className="text-white/90 mb-4">
                  Partner with Intellofest and reach 2,000+ premium families!
                </p>
                <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-3 transition-all w-fit">
                  Learn More <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="py-16 bg-linear-to-r from-primary via-purple-600 to-accent text-white relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://kukdukoo.com/images/exhibit-banner.jpg)',
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-purple-600/80 to-accent/80" />
        
        <div className="absolute inset-0 overflow-hidden">
          {['✨', '🌟', '💫'].map((e, i) => (
            <span key={i} className="absolute text-4xl opacity-10 animate-float"
              style={{ top: `${20 + i * 25}%`, left: `${15 + i * 30}%`, animationDelay: `${i}s` }}>
              {e}
            </span>
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '25+', label: 'DIY Activity Stalls' },
              { num: '2K+', label: 'Attendees Expected' },
              { num: '10+', label: 'High-Impact Shows' },
              { num: '2', label: 'Day Mega Festival' },
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
            <p className="text-gray-600 text-lg">Hear from families who experienced TinkerDen events!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', text: 'My son built his first robot and launched a rocket — all in one day! TinkerDen makes STEM genuinely exciting for kids.', role: 'Mother of 2' },
              { name: 'Rahul Mehta', text: 'Amazingly organized event. The drone show and AR/VR zones blew our minds. My daughter hasn\'t stopped talking about it!', role: 'Father' },
              { name: 'Anita Desai', text: 'The best STEM event in Gujarat. My kids loved the maker challenges and the science fire show was spectacular!', role: 'Mother of 3' },
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
            <p className="text-gray-600 text-lg">Everything you need to know about Intellofest</p>
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
      <section className="py-16 sm:py-20 bg-linear-to-r from-primary to-accent text-white text-center relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://kukdukoo.com/images/exhibit-banner.jpg)',
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Ignite Curiosity? 🚀</h2>
          <p className="text-white/80 text-lg mb-8">
            Limited passes available. Don't miss Surat's biggest STEM & Innovation Carnival!
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
