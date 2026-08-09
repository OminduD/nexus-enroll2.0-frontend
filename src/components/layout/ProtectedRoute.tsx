import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';
import { Skeleton } from '../ui/Skeleton';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
        <div className="space-y-4 max-w-md w-full text-center">
          <Skeleton className="h-12 w-12 mx-auto rounded-xl" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their proper role dashboard if attempting forbidden route
    const roleDefaultPath =
      user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'FACULTY' ? '/faculty/dashboard' : '/student/dashboard';
    return <Navigate to={roleDefaultPath} replace />;
  }

  return <Outlet />;
};
