import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings, setLocalSettings } from '../../store/slices/settingsSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Settings, Loader2, Save } from 'lucide-react';

export default function EventSettings() {
  const dispatch = useDispatch();
  const { data: settings, loading, saving } = useSelector((s) => s.settings);
  const [local, setLocal] = useState(null);

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);
  useEffect(() => { if (settings) setLocal({ ...settings }); }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateSettings(local)).unwrap();
      toast.success('Settings saved!');
    } catch (err) { toast.error(err || 'Failed to save'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!local) return <p className="text-center text-red-500 mt-10">Failed to load settings</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Event Settings</h1>
        <p className="text-gray-500">Configure your event details</p>
      </div>
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> General</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input type="text" value={local.eventName || ''} onChange={(e) => setLocal({ ...local, eventName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Dates</label>
            <input type="text" value={local.eventDates || ''} onChange={(e) => setLocal({ ...local, eventDates: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="e.g., Jan 15-20, 2026" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input type="text" value={local.venue || ''} onChange={(e) => setLocal({ ...local, venue: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Event venue address" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Announcement Banner</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
            <input type="text" value={local.announcementBanner || ''} onChange={(e) => setLocal({ ...local, announcementBanner: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Announcement message" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={local.isBannerActive || false} onChange={(e) => setLocal({ ...local, isBannerActive: e.target.checked })} className="w-4 h-4 text-primary rounded" />
            <span className="text-sm font-medium">Show Banner</span>
          </label>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Registration Controls</h2>
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
            <input type="checkbox" checked={local.isGlobalRegistrationOpen || false} onChange={(e) => setLocal({ ...local, isGlobalRegistrationOpen: e.target.checked })} className="w-5 h-5 text-primary rounded" />
            <div>
              <span className="text-sm font-semibold block">Global Registration Open</span>
              <span className="text-xs text-gray-500">Allow customers to purchase passes</span>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
            <input type="checkbox" checked={local.isGlobalEarlyBirdActive || false} onChange={(e) => setLocal({ ...local, isGlobalEarlyBirdActive: e.target.checked })} className="w-5 h-5 text-primary rounded" />
            <div>
              <span className="text-sm font-semibold block">Early Bird Pricing Active</span>
              <span className="text-xs text-gray-500">Enable early bird discounts on eligible passes</span>
            </div>
          </label>
        </div>
        <button type="submit" disabled={saving}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
