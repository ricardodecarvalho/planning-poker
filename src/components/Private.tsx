import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Private = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default Private;
