import { Navigate, Outlet, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";

const Private = () => {
  const { user, loadingAuthStateChanged } = useAuth();

  const { roomId } = useParams();
  const redirect = roomId ? `/room/${roomId}` : "/";

  if (loadingAuthStateChanged) {
    return (
      <div className="d-flex justify-content-center">
        <LoadingSpinner />
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
