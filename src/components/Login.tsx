import useAuth from "../hooks/useAuth";
import styled from "styled-components";

import LogoPPK from "../assets/images/logo-planning-poker.svg?react";
import LogoPPKWhite from "../assets/images/logo-planning-poker-white.svg?react";
import useThemeContext from "../context/useThemeContext";
import ConnectionAlert from "./ConnectionAlert";

const LoginWithGoogleButton = styled.button`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 350px;
`;

const appName = import.meta.env.VITE_APP_NAME;

const Login = () => {
  const { loginWithGoogle, loadingLoginWithGoogle } = useAuth();
  const { theme } = useThemeContext();

  return (
    <>
      <ConnectionAlert />
      <div className="container">
        {theme === "light" ? (
          <LogoPPK className="mx-auto d-block mt-5" width={250} height={250} />
        ) : (
          <LogoPPKWhite
            className="mx-auto d-block mt-5"
            width={250}
            height={250}
          />
        )}
        <div className="mt-4 d-flex flex-column align-items-center justify-content-center gap-3">
          <h1 className="text-center">
            <span className="text-body-secondary">Welcome to</span>{" "}
            <span style={{ whiteSpace: "nowrap" }}>{appName}</span>
          </h1>
          <LoginWithGoogleButton
            className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-lg`}
            onClick={loginWithGoogle}
            disabled={loadingLoginWithGoogle}
          >
            Login with Google to continue
          </LoginWithGoogleButton>
        </div>
      </div>
    </>
  );
};

export default Login;
