import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute () {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
