import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
    children: React.ReactElement;
    userRole?: string;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
                                                                            children,
                                                                            userRole
                                                                        }) => {
                                                                            
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (userRole && !['manager', 'root'].includes(userRole)) {
        return <Navigate to="/docs" replace />;
    }

    return children;
};

export default AdminProtectedRoute;