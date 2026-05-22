import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Checking your session...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
