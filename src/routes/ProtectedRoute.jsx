import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const isAuthLoading = useSelector((state) => state.auth.isAuthLoading);

  if (isAuthLoading) {
    return <div>Checking your session...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
