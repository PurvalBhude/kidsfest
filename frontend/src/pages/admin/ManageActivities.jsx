import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, createActivity, updateActivity, deleteActivity } from '../../store/slices/activitySlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, X, Loader2, Sparkles, Upload } from 'lucide-react';

export default function ManageActivities() {
  const dispatch = useDispatch();
  const { items: activities, loading } = useSelector((state) => state.activities);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [imageFile, setImageFile] = useState(null);

  function emptyForm() {
    return { title: '', category: '', description: '', ageGroup: '', isActive: true };
  }

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const openCreate = () => { setForm(emptyForm()); setImageFile(null); setModal('create'); };
  const openEdit = (act) => {
    setForm({ title: act.title, category: act.category, description: act.description || '', ageGroup: act.ageGroup || '', isActive: act.isActive });
    setImageFile(null);
    setModal(act);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      if (modal === 'create') {
        await dispatch(createActivity(formData)).unwrap();
        toast.success('Activity created!');
      } else {
        await dispatch(updateActivity({ id: modal._id, formData })).unwrap();
        toast.success('Activity updated!');
      }
      setModal(null);
    } catch (err) {
      toast.error(err || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await dispatch(deleteActivity(id)).unwrap();
      toast.success('Activity deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Activities</h1>
          <p className="text-gray-500">Create and manage festival activities</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
          <Plus className="w-5 h-5" /> Add Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => (
          <div key={act._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {act.imageUrl ? (
              <img src={act.imageUrl} alt={act.title} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary/30" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{act.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{act.category}</span>
                    {act.ageGroup && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-dark">{act.ageGroup}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(act)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(act._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              {act.description && <p className="text-sm text-gray-500 line-clamp-2">{act.description}</p>}
              <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${act.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {act.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{modal === 'create' ? 'Add Activity' : 'Edit Activity'}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" required placeholder="e.g., Arts, Music, Sports" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <input type="text" value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., 5-10 years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{imageFile ? imageFile.name : 'Click to upload'}</span>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                <span className="text-sm font-medium">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} {modal === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
