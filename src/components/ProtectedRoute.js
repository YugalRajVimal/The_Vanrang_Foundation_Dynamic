import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COLORS = { primary: "#E76F51", background: "#FDF6EC" };

// <ProtectedRoute role="user"> or <ProtectedRoute role="admin">
// Redirects to /login or /admin/login respectively if there's no valid session,
// preserving the attempted location so we can send the user back after login.
export default function ProtectedRoute({ role = "user", children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        style={{ background: COLORS.background }}
      >
        <span className="font-serif" style={{ color: COLORS.primary }}>
          Loading…
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = role === "admin" ? "/admin/login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // if (role === "admin" && !isAdmin) {
  //   return <Navigate to="/admin/login" replace state={{ from: location }} />;
  // }

  return children;
}
