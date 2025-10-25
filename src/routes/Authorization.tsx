import { Navigate } from "react-router-dom";

const Authorization = () => {
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Authorization;
