import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/account" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
