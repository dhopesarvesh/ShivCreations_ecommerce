import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
