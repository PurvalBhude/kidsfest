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
  
  // Track files separately so we can build FormData accurately
  const [files, setFiles] = useState({
    navbarLogo: null,
    homePassesImage: null,
    homeVolunteerImage: null,
    homeSponsorImage: null,
  });

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);
  useEffect(() => { if (settings) setLocal({ ...settings }); }, [settings]);

  const handleFileChange = (e, fieldName) => {
    if (e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [fieldName]: e.target.files[0] }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all textual/boolean strings
      Object.keys(local).forEach((key) => {
        // Exclude system fields or old file strings if uploading new replacements
        if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return;
        formData.append(key, local[key] === null ? '' : local[key]);
      });

      // Append new files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      await dispatch(updateSettings(formData)).unwrap();
      toast.success('Settings saved!');
    } catch (err) { toast.error(err || 'Failed to save'); }
  };

  if (loading) return <LoadingSpinner />;
  if (!local) return <p className="text-center text-red-500 mt-10">Failed to load settings</p>;

  // Helper mapping wrapper for file UI
  const FileUploadField = ({ label, field, currentUrl }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        {currentUrl && !files[field] && (
          <img src={currentUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md border" />
        )}
        {files[field] && (
          <span className="text-xs text-green-600 font-semibold border px-2 py-1 rounded bg-green-50">
            [New File Selected]
          </span>
        )}
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => handleFileChange(e, field)}
          className="text-sm border border-gray-200 p-2 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Event Settings</h1>
        <p className="text-gray-500">Configure your event details and visual media</p>
      </div>
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        
        {/* Core Event Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> General Info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input type="text" value={local.eventName || ''} onChange={(e) => setLocal({ ...local, eventName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline / Event Description</label>
            <input type="text" value={local.eventDescription || ''} onChange={(e) => setLocal({ ...local, eventDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="e.g., India's biggest arts & literature festival for kids" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Dates</label>
              <input type="text" value={local.eventDates || ''} onChange={(e) => setLocal({ ...local, eventDates: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="e.g., Jan 15-20, 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Location</label>
              <input type="text" value={local.venue || ''} onChange={(e) => setLocal({ ...local, venue: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Event venue address" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Map / Location Tracker Link</label>
            <input type="url" value={local.locationMapLink || ''} onChange={(e) => setLocal({ ...local, locationMapLink: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="https://maps.google.com/..." />
          </div>
        </div>

        {/* Global Flags */}
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

        {/* Branding & Uploads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold mb-4">Branding & Media Integration</h2>
          
          <FileUploadField label="Navbar Brand Logo" field="navbarLogo" currentUrl={local.navbarLogo} />
          <hr className="my-2 border-gray-100" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Background Video URL</label>
            <input type="url" value={local.heroVideoLink || ''} onChange={(e) => setLocal({ ...local, heroVideoLink: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="https://www.youtube.com/embed/... or raw streaming URL" />
            <p className="text-xs text-gray-500 mt-1">Provide a raw video link to be scaled as the immersive background cover on the home page.</p>
          </div>
          <hr className="my-2 border-gray-100" />
          
          <h3 className="text-md font-semibold text-gray-800">Homepage Call-to-Action Grid</h3>
          <p className="text-xs text-gray-500 mb-3">Upload replacement illustrations for the 3 main grid boxes.</p>
          <div className="space-y-4">
            <FileUploadField label="Card 1: Get Passes Cover" field="homePassesImage" currentUrl={local.homePassesImage} />
            <FileUploadField label="Card 2: Volunteer Cover" field="homeVolunteerImage" currentUrl={local.homeVolunteerImage} />
            <FileUploadField label="Card 3: Sponsor Cover" field="homeSponsorImage" currentUrl={local.homeSponsorImage} />
          </div>
          
          <div className="pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sponsoship Pitch (Card Description)</label>
            <input type="text" value={local.sponsorshipOpportunities || ''} onChange={(e) => setLocal({ ...local, sponsorshipOpportunities: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Partner with us and reach 2,000+ premium families!" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={saving}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
