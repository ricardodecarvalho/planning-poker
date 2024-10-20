import { Navigate, Outlet, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";

const Private = () => {
  const { user, loading } = useAuth();

  const { roomId } = useParams();
  const redirect = roomId ? `/room/${roomId}` : "/";

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border mt-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ redirect }} />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Private;
