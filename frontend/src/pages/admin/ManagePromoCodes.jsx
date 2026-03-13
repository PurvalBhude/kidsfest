import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from '../../store/slices/promoCodeSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

export default function ManagePromoCodes() {
  const dispatch = useDispatch();
  const { items: codes, loading } = useSelector((state) => state.promoCodes);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return { code: '', discountType: 'percentage', discountValue: '', maxUses: '', validUntil: '', isActive: true };
  }

  useEffect(() => {
    dispatch(fetchPromoCodes());
  }, [dispatch]);

  const openCreate = () => { setForm(emptyForm()); setModal('create'); };
  const openEdit = (pc) => {
    setForm({
      code: pc.code, discountType: pc.discountType, discountValue: pc.discountValue,
      maxUses: pc.maxUses || '', validUntil: pc.validUntil ? pc.validUntil.slice(0, 10) : '', isActive: pc.isActive,
    });
    setModal(pc);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        maxUses: Number(form.maxUses) || 0,
        validUntil: form.validUntil || null,
      };
      if (modal === 'create') {
        await dispatch(createPromoCode(payload)).unwrap();
        toast.success('Promo code created!');
      } else {
        await dispatch(updatePromoCode({ id: modal._id, payload })).unwrap();
        toast.success('Promo code updated!');
      }
      setModal(null);
    } catch (err) {
      toast.error(err || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await dispatch(deletePromoCode(id)).unwrap();
      toast.success('Promo code deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-gray-500">Manage discount codes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
          <Plus className="w-5 h-5" /> Add Code
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Discount</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Used</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Valid Until</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((pc) => (
                <tr key={pc._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold font-mono text-primary">{pc.code}</td>
                  <td className="px-4 py-3">
                    {pc.discountType === 'percentage' ? `${pc.discountValue}%` : `₹${pc.discountValue}`}
                  </td>
                  <td className="px-4 py-3">{pc.timesUsed}{pc.maxUses ? ` / ${pc.maxUses}` : ' / ∞'}</td>
                  <td className="px-4 py-3">{pc.validUntil ? new Date(pc.validUntil).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(pc)} className="p-1.5 hover:bg-gray-100 rounded-lg inline-block"><Pencil className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => handleDelete(pc._id)} className="p-1.5 hover:bg-red-50 rounded-lg inline-block ml-1"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No promo codes yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{modal === 'create' ? 'Create Promo Code' : 'Edit Promo Code'}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary uppercase font-mono" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary">
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input type="number" min="0" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (0 = unlimited)</label>
                  <input type="number" min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                <span className="text-sm font-medium">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2">
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
