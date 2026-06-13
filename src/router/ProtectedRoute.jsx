import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageSpinner } from "../components/Spinner";
import PendingApproval from "../pages/admin/PendingApproval";

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Super admins can always access the admin panel
  if (user.role === "super_admin") {
    return children;
  }

  if (user.status !== "approved") {
    return <PendingApproval />;
  }

  return children;
}
