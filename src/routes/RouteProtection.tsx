import { Navigate } from "react-router-dom";

const RouteProtection = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RouteProtection;
