import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useSelector((state) => state.auth);

  if (loading) return <LoadingSpinner />;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
