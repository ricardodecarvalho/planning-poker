import useAuth from "../hooks/useAuth";
import styled from "styled-components";
import { useTranslation } from "react-i18n-lite";

import LogoPPK from "../assets/images/logo-planning-poker.svg?react";
import LogoPPKWhite from "../assets/images/logo-planning-poker-white.svg?react";
import useThemeContext from "../context/useThemeContext";
import ConnectionAlert from "./ConnectionAlert";
import ChangeLanguage from "../locales/ChangeLanguage";

const LoginWithGoogleButton = styled.button`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 350px;
`;

const appName = import.meta.env.VITE_APP_NAME;

const Login = () => {
  const { loginWithGoogle, loadingLoginWithGoogle } = useAuth();
  const { theme } = useThemeContext();

  const { t } = useTranslation();

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
            <span className="text-body-secondary">{t("login.welcomeTo")}</span>{" "}
            <span style={{ whiteSpace: "nowrap" }}>{appName}</span>
          </h1>
          <LoginWithGoogleButton
            className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-lg`}
            onClick={loginWithGoogle}
            disabled={loadingLoginWithGoogle}
          >
            {loadingLoginWithGoogle && (
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
            )}
            {t("login.loginWithGoogle")}
          </LoginWithGoogleButton>

          <div className="d-flex gap-2 align-items-center">
            <span>{t("login.language")}</span>
            <ChangeLanguage type="select" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
