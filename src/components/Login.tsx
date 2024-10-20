import { getDownloadURL, ref } from "firebase/storage";
import useAuth from "../hooks/useAuth";
import { storage } from "../firebase";
import { useEffect, useState } from "react";

const logoStorage = import.meta.env.VITE_FIREBASE_STORAGE_LOGO;

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const storageRef = ref(storage, logoStorage);

    getDownloadURL(storageRef)
      .then((url) => {
        setLogoUrl(url);
      })
      .catch((error) => {
        console.error("Error getting image URL:", error);
      });
  }, []);

  return (
    <div className="container">
      {logoUrl && (
        <img
          src={logoUrl}
          className="mx-auto d-block mt-5"
          alt="Logo planning poker"
        />
      )}
      <div className="mt-5 d-flex flex-column justify-content-center gap-3">
        <h1 className="text-center">
          <span className="text-body-secondary">Welcome to</span>{" "}
          <span style={{ whiteSpace: "nowrap" }}>Agile Planning Poker</span>
        </h1>
        <button
          className="btn btn-outline-primary btn-lg"
          onClick={loginWithGoogle}
        >
          Login with Google to continue
        </button>
      </div>
    </div>
  );
};

export default Login;
