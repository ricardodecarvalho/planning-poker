import styled from "styled-components";
import { Link } from "react-router-dom";

import { auth } from "../firebase";

import useIsOpen from "../hooks/useIsOpen";
import Offcanvas from "./Offcanvas";
import useUserContext from "../context/useUserContext";
import Avatar from "./Avatar";
import useThemeContext from "../context/useThemeContext";

import LogoPPK from "../assets/images/logo-planning-poker.svg?react";
import LogoPPKWhite from "../assets/images/logo-planning-poker-white.svg?react";

import IconLogout from "../assets/images/logout.svg?react";
import MoonIcon from "../assets/images/moon.svg?react";
import SunIcon from "../assets/images/sun.svg?react";
import GlobeIcon from "../assets/images/globe.svg?react";
import GitHubLogo from "../assets/images/github-logo.svg?react";
import Hand from "../assets/images/hand.svg?react";

const appName = import.meta.env.VITE_APP_NAME;

const appVersion = import.meta.env.VITE_APP_VERSION;

const DONATE_LINK = import.meta.env.VITE_DONATE_LINK;

const AvatarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer !important;
  padding: 0;
`;

const Navbar = () => {
  const { isOpen, open, close } = useIsOpen();
  const { userContext } = useUserContext();
  const { theme, toggleTheme } = useThemeContext();

  const logout = async () => {
    auth.signOut();
  };

  return (
    <>
      <nav className={`navbar border-bottom sticky-top mb-md-3 mb-2`}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <Link to="/" title="Go home">
              {theme === "light" ? (
                <LogoPPK width={30} height={24} />
              ) : (
                <LogoPPKWhite width={30} height={24} />
              )}
            </Link>
            <Link to="/" className="navbar-brand" title="Go home">
              {appName}
            </Link>
          </span>
          <div className="d-flex text-light">
            {userContext && (
              <AvatarButton onClick={open}>
                <Avatar {...userContext} isShowState={false} />
              </AvatarButton>
            )}
          </div>
        </div>
      </nav>

      <Offcanvas {...{ isOpen }} onClose={close}>
        <ul className="list-group">
          <button
            className="list-group-item list-group-item-action disabled"
            aria-disabled="true"
          >
            <div className="d-flex gap-2 align-items-center">
              <GlobeIcon />
              <span>Language</span>
            </div>
          </button>

          <button
            className="list-group-item list-group-item-action"
            onClick={toggleTheme}
          >
            <div className="d-flex gap-2 align-items-center">
              {theme === "light" ? (
                <>
                  <MoonIcon />
                  <span>Enable dark mode</span>
                </>
              ) : (
                <>
                  <SunIcon />
                  <span>Enable light mode</span>
                </>
              )}
            </div>
          </button>

          <a
            target="_blank"
            href="https://github.com/ricardodecarvalho/planning-poker"
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex gap-2 align-items-center">
              <GitHubLogo />
              <span>Repository</span>
            </div>
          </a>

          <a
            target="_blank"
            href={DONATE_LINK}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex gap-2 align-items-center">
              <Hand />
              <span>Donate</span>
            </div>
          </a>

          <button
            className="list-group-item list-group-item-action"
            title="Logout"
            onClick={logout}
          >
            <div className="d-flex gap-2 align-items-center">
              <IconLogout />
              <span>Logout</span>
            </div>
          </button>
        </ul>
        <p className="text-center mt-3">
          <code>Version {appVersion}</code>
        </p>
      </Offcanvas>
    </>
  );
};

export default Navbar;
