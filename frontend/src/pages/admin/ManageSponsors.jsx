import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSponsors, createSponsor, updateSponsor, deleteSponsor } from '../../store/slices/sponsorSlice';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Crown, Award, Medal, Building2, Star, Loader2, Image, X } from 'lucide-react';

const tierOptions = ['Title Sponsor', 'Gold Sponsor', 'Silver Sponsor', 'Stall / Booth', 'Food Partner', 'Other'];

const tierBadge = {
  'Title Sponsor': 'bg-amber-100 text-amber-700',
  'Gold Sponsor': 'bg-yellow-100 text-yellow-700',
  'Silver Sponsor': 'bg-gray-100 text-gray-600',
  'Stall / Booth': 'bg-orange-100 text-orange-700',
  'Food Partner': 'bg-red-100 text-red-700',
  'Other': 'bg-blue-100 text-blue-700',
};

const emptyForm = { brandName: '', tier: 'Other', website: '', description: '', isActive: true };

export default function ManageSponsors() {
  const dispatch = useDispatch();
  const { items: sponsors, loading } = useSelector((s) => s.adminSponsors);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchSponsors()); }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setLogo(null);
    setLogoPreview('');
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ brandName: s.brandName, tier: s.tier, website: s.website || '', description: s.description || '', isActive: s.isActive });
    setLogo(null);
    setLogoPreview(s.logoUrl || '');
    setShowForm(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brandName.trim()) { toast.error('Brand name is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('brandName', form.brandName);
      fd.append('tier', form.tier);
      fd.append('website', form.website);
      fd.append('description', form.description);
      fd.append('isActive', form.isActive);
      if (logo) fd.append('logo', logo);

      if (editing) {
        await dispatch(updateSponsor({ id: editing, formData: fd })).unwrap();
        toast.success('Sponsor updated');
      } else {
        await dispatch(createSponsor(fd)).unwrap();
        toast.success('Sponsor added');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sponsor?')) return;
    try {
      await dispatch(deleteSponsor(id)).unwrap();
      toast.success('Sponsor deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Sponsors</h1>
          <p className="text-sm text-gray-500 mt-1">{sponsors.length} sponsor{sponsors.length !== 1 ? 's' : ''} added</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? 'Edit Sponsor' : 'Add New Sponsor'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                <input type="text" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  {tierOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Image className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{logo ? logo.name : 'Click to upload logo'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
                {logoPreview && (
                  <img src={logoPreview} alt="Preview" className="mt-2 h-16 w-auto object-contain rounded-lg border" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="https://example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-700">Active (visible on public site)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Update' : 'Add Sponsor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : sponsors.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Crown className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-semibold">No sponsors yet</p>
          <p className="text-sm mt-1">Click "Add Sponsor" to add your first sponsor.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Brand</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tier</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Website</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Active</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sponsors.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.logoUrl ? (
                          <img src={s.logoUrl} alt={s.brandName} className="w-10 h-10 object-contain rounded-lg border bg-white" />
                        ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-primary">{s.brandName.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{s.brandName}</p>
                          {s.description && <p className="text-xs text-gray-500 line-clamp-1">{s.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tierBadge[s.tier] || tierBadge['Other']}`}>
                        {s.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline truncate block max-w-[150px]">{s.website}</a>
                      ) : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
