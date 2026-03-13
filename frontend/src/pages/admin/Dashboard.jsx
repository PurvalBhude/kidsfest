import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DollarSign, Ticket, Users, Building2, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Tickets Sold',
      value: stats?.totalTicketsSold || 0,
      icon: Ticket,
      color: 'bg-primary',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'Pending Volunteers',
      value: stats?.volunteersPending || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Pending Exhibitors',
      value: stats?.exhibitorsPending || 0,
      icon: Building2,
      color: 'bg-secondary',
      bgLight: 'bg-orange-50',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to your KidsFest admin panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`${card.bgLight} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Manage Passes', href: '/admin/passes', emoji: '🎟️' },
            { label: 'View Bookings', href: '/admin/bookings', emoji: '📋' },
            { label: 'Event Settings', href: '/admin/settings', emoji: '⚙️' },
          ].map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="font-semibold text-gray-700">{a.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
