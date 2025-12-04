import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user") || "null") : null;

  if (!token || !user) return <Navigate to="/login" />;

  // Role check (if role prop is provided)
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}
