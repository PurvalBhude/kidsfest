import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPasses, createPass, updatePass, deletePass } from '../../store/slices/passSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, X, Loader2, Ticket } from 'lucide-react';

export default function ManagePasses() {
  const dispatch = useDispatch();
  const { items: passes, loading } = useSelector((state) => state.passes);
  const [modal, setModal] = useState(null); // null | 'create' | pass object
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      name: '', description: '', regularPrice: '', earlyBirdPrice: '',
      isEarlyBirdActive: false, isRegistrationOpen: true, capacity: '',
      minQuantityForDiscount: '', bulkDiscountPercentage: '',
    };
  }

  useEffect(() => {
    dispatch(fetchPasses());
  }, [dispatch]);

  const openCreate = () => { setForm(emptyForm()); setModal('create'); };
  const openEdit = (pass) => {
    setForm({
      name: pass.name, description: pass.description || '',
      regularPrice: pass.regularPrice, earlyBirdPrice: pass.earlyBirdPrice || '',
      isEarlyBirdActive: pass.isEarlyBirdActive, isRegistrationOpen: pass.isRegistrationOpen,
      capacity: pass.capacity, minQuantityForDiscount: pass.minQuantityForDiscount || '',
      bulkDiscountPercentage: pass.bulkDiscountPercentage || '',
    });
    setModal(pass);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        regularPrice: Number(form.regularPrice),
        earlyBirdPrice: Number(form.earlyBirdPrice) || 0,
        capacity: Number(form.capacity),
        minQuantityForDiscount: Number(form.minQuantityForDiscount) || 0,
        bulkDiscountPercentage: Number(form.bulkDiscountPercentage) || 0,
      };
      if (modal === 'create') {
        await dispatch(createPass(payload)).unwrap();
        toast.success('Pass created!');
      } else {
        await dispatch(updatePass({ id: modal._id, payload })).unwrap();
        toast.success('Pass updated!');
      }
      setModal(null);
    } catch (err) {
      toast.error(err || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pass?')) return;
    try {
      await dispatch(deletePass(id)).unwrap();
      toast.success('Pass deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Passes</h1>
          <p className="text-gray-500">Create and manage ticket passes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
          <Plus className="w-5 h-5" /> Add Pass
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passes.map((pass) => (
          <div key={pass._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900">{pass.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(pass)} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                <button onClick={() => handleDelete(pass._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
            {pass.description && <p className="text-sm text-gray-500 mb-3">{pass.description}</p>}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500 block text-xs">Price</span><span className="font-bold">₹{pass.regularPrice}</span></div>
              <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500 block text-xs">Early Bird</span><span className="font-bold">₹{pass.earlyBirdPrice || '—'}</span></div>
              <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500 block text-xs">Capacity</span><span className="font-bold">{pass.capacity}</span></div>
              <div className="bg-gray-50 rounded-lg p-2"><span className="text-gray-500 block text-xs">Sold</span><span className="font-bold">{pass.sold}</span></div>
            </div>
            <div className="flex gap-2 mt-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pass.isRegistrationOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {pass.isRegistrationOpen ? 'Open' : 'Closed'}
              </span>
              {pass.isEarlyBirdActive && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent">Early Bird</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{modal === 'create' ? 'Create Pass' : 'Edit Pass'}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price *</label>
                  <input type="number" min="0" value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Price</label>
                  <input type="number" min="0" value={form.earlyBirdPrice} onChange={(e) => setForm({ ...form, earlyBirdPrice: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Qty for Discount</label>
                  <input type="number" min="0" value={form.minQuantityForDiscount} onChange={(e) => setForm({ ...form, minQuantityForDiscount: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bulk Discount %</label>
                  <input type="number" min="0" max="100" value={form.bulkDiscountPercentage} onChange={(e) => setForm({ ...form, bulkDiscountPercentage: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isRegistrationOpen} onChange={(e) => setForm({ ...form, isRegistrationOpen: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm font-medium">Registration Open</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isEarlyBirdActive} onChange={(e) => setForm({ ...form, isEarlyBirdActive: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm font-medium">Early Bird Active</span>
                </label>
              </div>
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
