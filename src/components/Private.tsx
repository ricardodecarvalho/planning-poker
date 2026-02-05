import { Navigate, Outlet, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";
import ConnectionAlert from "./ConnectionAlert";

const Private = () => {
  const { user, loadingAuthStateChanged } = useAuth();

  const { roomId = "" } = useParams();

  if (loadingAuthStateChanged) {
    return (
      <div className="d-flex justify-content-center">
        <LoadingSpinner />
      </div>
    );
  }

  const redirect = roomId ? `/room/${roomId}` : "/";

  if (!user) {
    return <Navigate to="/login" state={{ redirect }} />;
  }

  return (
    <>
      <ConnectionAlert />
      <Navbar />
      <Outlet />
    </>
  );
};

export default Private;
