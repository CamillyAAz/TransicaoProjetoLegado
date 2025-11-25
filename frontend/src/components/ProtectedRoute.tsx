import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, canAccessPath } from "@/lib/permissions";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { accessToken, user } = useAuth();
  const location = useLocation();
  
  // Se não está autenticado, redireciona para login
  if (!accessToken) return <Navigate to="/login" replace />;
  
  const admin = isAdmin(user);
  const ok = canAccessPath(user, location.pathname);
  if (!admin && !ok) return <Navigate to="/sales" replace />;
  
  return children;
}
