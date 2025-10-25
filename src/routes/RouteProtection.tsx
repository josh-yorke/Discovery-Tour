import { Navigate } from "react-router-dom";

const RouteProtection = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  // if not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if logged in → allow access
  return <>{children}</>;
};

export default RouteProtection;
