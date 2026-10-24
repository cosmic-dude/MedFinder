import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isPharmacy } = useAuth();

  if (!isAuthenticated || !isPharmacy) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
