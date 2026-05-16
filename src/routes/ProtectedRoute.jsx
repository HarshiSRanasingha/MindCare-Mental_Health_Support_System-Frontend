import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loader-fullscreen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "student" ? "/student/dashboard" : "/counselor/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
