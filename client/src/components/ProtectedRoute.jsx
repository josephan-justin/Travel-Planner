import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}