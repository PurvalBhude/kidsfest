import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles, Ticket, Calendar, MapPin, ArrowRight, Star,
  ChevronDown, Cpu, Rocket, Lightbulb, Microscope, Zap,
} from 'lucide-react';

const funIcons = [Star, Cpu, Rocket, Lightbulb, Microscope, Sparkles];

/* ── helpers ── */
const SectionHeading = ({ teal, red, sub }) => (
  <div className="text-center mb-10">
    <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#1a9fb5' }}>
      {teal}{red && <span style={{ color: '#e63228' }}>{red}</span>}
    </h2>
    {sub && <p style={{ fontFamily: 'Signika, sans-serif', color: '#555', marginTop: '0.5rem', maxWidth: 560, margin: '0.5rem auto 0' }}>{sub}</p>}
  </div>
);

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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const faqs = [
    { q: 'What is this festival?', a: 'This is a two-day mega arts & literature carnival — an electrifying collision of storytelling, theatre, crafts, quizzing, and live performances designed to spark creativity and curiosity in young minds.' },
    { q: 'What age group is it for?', a: 'The fest is designed for children aged 1.5 to 13 years along with parents and guardians. Every zone and activity is curated for specific age groups.' },
    { q: 'How do I book tickets?', a: 'Click the "Book Passes" button, select the passes you want, and proceed to our secure checkout. You\'ll receive an e-ticket confirmation instantly.' },
    { q: 'Can I cancel or refund my tickets?', a: 'Tickets are non-refundable but the information on them may be transferred. Please contact our support team for specific requests.' },
    { q: 'Is there a group / bulk booking discount?', a: 'Yes! We offer discounts for bulk booking of more than 20 passes. Contact +91-8595684432 for more details.' },
    { q: 'Is food & parking available?', a: 'Yes! We have a curated food festival area with kid-friendly options. Ample parking is available near the venue.' },
    { q: 'What activities can kids expect?', a: 'Storytelling, theatre, DIY art & craft, puppetry, mime & clowning, superhero cosplay, quizzing & mentalism, kids cosplay conclave, and much more!' },
    { q: 'Are parents required to buy a ticket?', a: 'Parents accompanying the child (up to two) can enter with the child\'s pass. The festival is primarily ticketed for children.' },
  ];

  return (
    <div style={{ background: '#f5f3ee' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Video BG */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            src="https://www.youtube.com/embed/UWD7FS7QVMQ?si=XPnxKFr6f0CI5eM7&autoplay=1&mute=1&controls=0&loop=1&playlist=UWD7FS7QVMQ&modestbranding=1&rel=0"
            title="Festival Background Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full text-center px-4 py-20">
          <div className="animate-slide-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', borderRadius: '50px', padding: '0.4rem 1.2rem', marginBottom: '1.2rem' }}>
            <Calendar className="w-4 h-4 text-white" />
            <span style={{ color: '#fff', fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
              {settings?.eventDates || 'Dates Coming Soon'}
            </span>
          </div>

          <h2 className="animate-slide-up delay-100"
            style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(2.5rem,7vw,5.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            Kid-O-Fest
            <span style={{ display: 'block', fontSize: 'clamp(1.5rem,5vw,3.5rem)', color: '#e63228' }}>Surat's Biggest Festival for Children</span>
          </h2>

          {settings?.venue && (
            <div className="animate-slide-up delay-200" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,.9)', marginBottom: '0.5rem', fontFamily: 'Signika, sans-serif' }}>
              <MapPin className="w-5 h-5" />
              <span style={{ fontSize: '1.1rem' }}>{settings.venue}</span>
            </div>
          )}

          <div className="animate-slide-up delay-300" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/passes"
              style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', background: '#e63228', color: '#fff', borderRadius: '50px', padding: '0.75rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', letterSpacing: '0.03em', transition: 'transform .2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Ticket className="w-5 h-5" /> Book Passes
            </Link>
            <Link to="/activities"
              style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.1rem', background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: '50px', padding: '0.75rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.4)', transition: 'background .2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.28)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.18)'}
            >
              Explore Activities <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLUE EVENT INFO STRIP ── */}
      <div style={{ background: '#1a9fb5', padding: '1rem 2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
        {settings?.eventDates && (
          <span style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', fontSize: '1rem', letterSpacing: '0.02em' }}>
            📅 {settings.eventDates}
          </span>
        )}
        {settings?.venue && (
          <span style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.9)', fontSize: '0.95rem' }}>
            📍 {settings.venue}
          </span>
        )}
        <Link to="/passes"
          style={{ fontFamily: 'Lilita One, sans-serif', background: '#fff', color: '#1a9fb5', borderRadius: '50px', padding: '0.4rem 1.4rem', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.02em', transition: 'transform .2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          BOOK PASSES!
        </Link>
      </div>

      {/* ── ACTIVITIES GRID ── */}
      {activities.length > 0 && (
        <section style={{ padding: '5rem 0', background: '#f5f3ee' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              teal="🎨 Everything Fun "
              red="In Store"
              sub="What makes this your child's best weekend of the year — the perfect fusion of art, theater, literature & performances."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activities.slice(0, 4).map((activity, idx) => {
                const Icon = funIcons[idx % funIcons.length];
                return (
                  <div
                    key={activity._id}
                    className="kk-card animate-slide-up group"
                    style={{ animationDelay: `${idx * 0.07}s`, position: 'relative', aspectRatio: '4/3' }}
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
                        <Icon style={{ width: 48, height: 48, color: '#1a9fb560' }} />
                      </div>
                    )}
                    {/* Dark overlay + title */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 60%)', display: 'flex', alignItems: 'flex-end', padding: '0.75rem' }}>
                      <span style={{ fontFamily: 'Lilita One, sans-serif', color: '#fff', fontSize: 'clamp(0.75rem,2vw,0.95rem)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                        {activity.title}
                      </span>
                    </div>
                    {/* Hover flip-desc */}
                    <div style={{ position: 'absolute', inset: 0, background: '#1a9fb5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', opacity: 0, transition: 'opacity .3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <p style={{ fontFamily: 'Signika, sans-serif', color: '#fff', textAlign: 'center', fontSize: '0.88rem' }}>
                        {activity.description || activity.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {activities.length > 4 && (
              <div className="text-center mt-10">
                <Link to="/activities" className="btn-kk">
                  View All Activities <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA CARDS (Get Involved) ── */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading teal="Get Involved " red="🤝" sub="Be a part of the festival movement!" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: '/passes', img: 'https://kukdukoo.com/images/exhibit-flea.jpg', title: 'Get Passes 🎟️', desc: 'Book your passes and join the biggest children\'s carnival!', cta: 'Book Now' },
              { to: '/volunteer', img: 'https://kukdukoo.com/images/exhibit-expo.jpg', title: 'Volunteer 🙋', desc: 'Join our crew and help create magical moments for kids!', cta: 'Join Us' },
              { to: '/exhibitor', img: 'https://kukdukoo.com/images/exhibit-sponsor.jpg', title: 'Sponsor 🏢', desc: 'Partner with us and reach 2,000+ premium families!', cta: 'Learn More' },
            ].map((c) => (
              <Link key={c.to} to={c.to}
                className="kk-card group"
                style={{ position: 'relative', height: '320px', display: 'block', textDecoration: 'none' }}>
                <img src={c.img} alt={c.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                  className="group-hover:scale-110" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.15) 60%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', color: '#fff' }}>
                  <h3 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.4rem', marginBottom: '0.35rem' }}>{c.title}</h3>
                  <p style={{ fontFamily: 'Signika, sans-serif', fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.75rem' }}>{c.desc}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'Lilita One, sans-serif', fontSize: '0.95rem', color: '#f7941d' }}>
                    {c.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ position: 'relative', padding: '4rem 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://kukdukoo.com/images/exhibit-banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,159,181,.88), rgba(230,50,40,.75))' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '45+', label: 'Artists & Performers' },
              { num: '5K+', label: 'Attendees Expected' },
              { num: '10+', label: 'Shows & Workshops' },
              { num: '2', label: 'Day Mega Festival' },
            ].map((s, i) => (
              <div key={s.label} className="animate-count-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#fff' }}>{s.num}</div>
                <div style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.85)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 0', background: '#f5f3ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading teal="What Parents " red="Say 💬" sub="Hear from families who've experienced our past festivals!" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', text: 'My daughter built her first puppet and performed on stage — all in one day! The storytelling sessions were absolutely magical.', role: 'Mother of 2' },
              { name: 'Rahul Mehta', text: 'Amazingly organised event. The theatre and cosplay zones blew our minds. My son hasn\'t stopped talking about it for weeks!', role: 'Father' },
              { name: 'Anita Desai', text: 'Best literary festival for kids in India. My children loved the quizzing and the DIY art craft was spectacular!', role: 'Mother of 3' },
            ].map((t, i) => (
              <div key={t.name} className="card-border animate-slide-up"
                style={{ padding: '1.5rem', animationDelay: `${i * 0.15}s` }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} style={{ width: 16, height: 16, color: '#f7941d', fill: '#f7941d' }} />
                  ))}
                </div>
                <p style={{ fontFamily: 'Signika, sans-serif', color: '#444', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1rem' }}>"{t.text}"</p>
                <div>
                  <p style={{ fontFamily: 'Lilita One, sans-serif', color: '#1a1a1a', fontSize: '0.95rem' }}>{t.name}</p>
                  <p style={{ fontFamily: 'Signika, sans-serif', color: '#888', fontSize: '0.82rem' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading teal="Frequently Asked " red="Questions" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #e8e4dc', background: '#faf9f5' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 1.25rem', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: 'Signika, sans-serif', fontWeight: 600, fontSize: '0.97rem',
                    color: openFaq === i ? '#1a9fb5' : '#1a1a1a',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    style={{
                      width: 18, height: 18, color: openFaq === i ? '#1a9fb5' : '#888',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .3s',
                      flexShrink: 0, marginLeft: '1rem',
                    }}
                  />
                </button>
                <div style={{
                  overflow: 'hidden', maxHeight: openFaq === i ? '200px' : '0', transition: 'max-height .3s ease',
                }}>
                  <p style={{ fontFamily: 'Signika, sans-serif', color: '#555', padding: '0 1.25rem 1rem', lineHeight: 1.7, fontSize: '0.92rem' }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', padding: '5rem 0', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://kukdukoo.com/images/exhibit-banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(230,50,40,.88), rgba(247,148,29,.75))' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 style={{ fontFamily: 'Lilita One, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', marginBottom: '1rem' }}>
            Ready to Create Magical Memories? 🎪
          </h2>
          <p style={{ fontFamily: 'Signika, sans-serif', color: 'rgba(255,255,255,.88)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Limited passes available. Book now for {settings?.eventDates || 'the upcoming festival!'}
          </p>
          <Link to="/passes"
            style={{ fontFamily: 'Lilita One, sans-serif', fontSize: '1.15rem', background: '#fff', color: '#e63228', borderRadius: '50px', padding: '0.85rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', letterSpacing: '0.03em', boxShadow: '0 6px 20px rgba(0,0,0,.2)', transition: 'transform .2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Ticket className="w-5 h-5" /> Book Your Passes Now
          </Link>
        </div>
      </section>
    </div>
  );
}
