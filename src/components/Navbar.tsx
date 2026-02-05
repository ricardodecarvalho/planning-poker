import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18n-lite';

import { auth } from '../firebase';
import useIsOpen from '../hooks/useIsOpen';
import Offcanvas from './Offcanvas';
import useUserContext from '../context/useUserContext';
import Avatar from './Avatar';
import useThemeContext from '../context/useThemeContext';
import ChangeLanguage from '../locales/ChangeLanguage';

import LogoPPK from '../assets/images/logo-planning-poker.svg?react';
import LogoPPKWhite from '../assets/images/logo-planning-poker-white.svg?react';
import IconLogout from '../assets/images/logout.svg?react';
import MoonIcon from '../assets/images/moon.svg?react';
import SunIcon from '../assets/images/sun.svg?react';
import GitHubLogo from '../assets/images/github-logo.svg?react';
import Hand from '../assets/images/hand.svg?react';
import GlobeIcon from '../assets/images/globe.svg?react';

const appName = import.meta.env.VITE_APP_NAME;

const DONATE_LINK = import.meta.env.VITE_DONATE_LINK;

const REPOSITORY_LINK = 'https://github.com/ricardodecarvalho/planning-poker';

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
  const { t } = useTranslation();

  const logout = async () => {
    auth.signOut();
  };

  return (
    <>
      <nav className={`navbar border-bottom sticky-top mb-md-3 mb-2`}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <Link to="/" title={t('navbar.goHome')}>
              {theme === 'light' ? (
                <LogoPPK width={30} height={24} />
              ) : (
                <LogoPPKWhite width={30} height={24} />
              )}
            </Link>
            <Link to="/" className="navbar-brand" title={t('navbar.goHome')}>
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
          <li className="list-group-item list-group-item-action">
            <div className="d-flex gap-2 align-items-center">
              <GlobeIcon />
              <ChangeLanguage type="select" />
            </div>
          </li>

          <button
            className="list-group-item list-group-item-action"
            onClick={toggleTheme}
          >
            <div className="d-flex gap-2 align-items-center">
              {theme === 'light' ? (
                <>
                  <MoonIcon />
                  <span>{t('navbar.enableDarkMode')}</span>
                </>
              ) : (
                <>
                  <SunIcon />
                  <span>{t('navbar.enableLightMode')}</span>
                </>
              )}
            </div>
          </button>

          <a
            target="_blank"
            href={REPOSITORY_LINK}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex gap-2 align-items-center">
              <GitHubLogo />
              <span>{t('navbar.repository')}</span>
            </div>
          </a>

          <a
            target="_blank"
            href={DONATE_LINK}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex gap-2 align-items-center">
              <Hand />
              <span>{t('navbar.donate')}</span>
            </div>
          </a>

          <button
            className="list-group-item list-group-item-action"
            title={t('navbar.logout')}
            onClick={logout}
          >
            <div className="d-flex gap-2 align-items-center">
              <IconLogout />
              <span>{t('navbar.logout')}</span>
            </div>
          </button>
        </ul>
      </Offcanvas>
    </>
  );
};

export default Navbar;
