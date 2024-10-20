import { getDownloadURL, ref } from "firebase/storage";
import useAuth from "../hooks/useAuth";
import { storage } from "../firebase";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Logo = styled.img`
  height: 150px;

  @media (min-width: 768px) {
    height: 250px;
  }
`;

const LoginWithGoogleButton = styled.button`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 350px;
`;

const logoStorage = import.meta.env.VITE_FIREBASE_STORAGE_LOGO;
const appName = import.meta.env.VITE_APP_NAME;

const Login = () => {
  const { loginWithGoogle, loadingLoginWithGoogle } = useAuth();

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
        <Logo
          src={logoUrl}
          className="mx-auto d-block mt-5"
          alt="Logo planning poker"
        />
      )}
      <div className="mt-4 d-flex flex-column align-items-center justify-content-center gap-3">
        <h1 className="text-center">
          <span className="text-body-secondary">Welcome to</span>{" "}
          <span style={{ whiteSpace: "nowrap" }}>{appName}</span>
        </h1>
        <LoginWithGoogleButton
          className="btn btn-dark btn-lg"
          onClick={loginWithGoogle}
          disabled={loadingLoginWithGoogle}
        >
          Login with Google to continue
        </LoginWithGoogleButton>
      </div>
    </div>
  );
};

export default Login;
