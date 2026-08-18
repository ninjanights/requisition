import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "PUBLIC")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  /*
   * Wait until /me finishes.
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  /*
   * No authenticated user.
   */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  /*
   * User exists but doesn't have permission.
   */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
