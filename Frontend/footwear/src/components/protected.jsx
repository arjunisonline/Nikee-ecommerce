import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return isTokenValid(token) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
