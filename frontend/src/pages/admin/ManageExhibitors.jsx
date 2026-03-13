import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExhibitors, updateExhibitorStatus, deleteExhibitor } from '../../store/slices/exhibitorSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function ManageExhibitors() {
  const dispatch = useDispatch();
  const { items: exhibitors, loading } = useSelector((s) => s.exhibitors);

  useEffect(() => { dispatch(fetchExhibitors()); }, [dispatch]);

  const handleStatus = async (id, status) => {
    try {
      await dispatch(updateExhibitorStatus({ id, status })).unwrap();
      toast.success(`Exhibitor ${status.toLowerCase()}`);
    } catch (err) { toast.error(err || 'Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exhibitor?')) return;
    try {
      await dispatch(deleteExhibitor(id)).unwrap();
      toast.success('Exhibitor deleted');
    } catch (err) { toast.error(err || 'Failed to delete'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exhibitors</h1>
        <p className="text-gray-500">Manage exhibitor & sponsor enquiries</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Brand</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tier</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Brochure</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exhibitors.map((ex) => (
                <tr key={ex._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{ex.brandName}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.contactPerson}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.email}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.interestTier || '—'}</td>
                  <td className="px-4 py-3">
                    {ex.brochureUrl ? (
                      <a href={ex.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[ex.status]}`}>{ex.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {ex.status !== 'Approved' && (
                        <button onClick={() => handleStatus(ex._id, 'Approved')} className="p-1.5 hover:bg-green-50 rounded-lg" title="Approve">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      {ex.status !== 'Rejected' && (
                        <button onClick={() => handleStatus(ex._id, 'Rejected')} className="p-1.5 hover:bg-red-50 rounded-lg" title="Reject">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(ex._id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {exhibitors.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No exhibitor enquiries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
