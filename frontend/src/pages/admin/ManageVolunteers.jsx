import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVolunteers, updateVolunteerStatus, deleteVolunteer } from '../../store/slices/volunteerSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function ManageVolunteers() {
  const dispatch = useDispatch();
  const { items: volunteers, loading } = useSelector((state) => state.volunteers);

  useEffect(() => {
    dispatch(fetchVolunteers());
  }, [dispatch]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateVolunteerStatus({ id, status })).unwrap();
      toast.success(`Volunteer ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this volunteer?')) return;
    try {
      await dispatch(deleteVolunteer(id)).unwrap();
      toast.success('Volunteer deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
        <p className="text-gray-500">Manage volunteer applications</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{v.email}</td>
                  <td className="px-4 py-3 text-gray-600">{v.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{v.preferredRole || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {v.status !== 'Approved' && (
                        <button onClick={() => handleUpdateStatus(v._id, 'Approved')} className="p-1.5 hover:bg-green-50 rounded-lg" title="Approve">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      {v.status !== 'Rejected' && (
                        <button onClick={() => handleUpdateStatus(v._id, 'Rejected')} className="p-1.5 hover:bg-red-50 rounded-lg" title="Reject">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(v._id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No volunteer applications yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
