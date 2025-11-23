import { Navigate } from 'react-router-dom';

export const RedirectHandler: React.FC = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <Navigate to="/auth" replace />;
};

export default RedirectHandler;