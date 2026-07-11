import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18n-lite';

import useIsOpen from '../hooks/useIsOpen';
import useUserContext from '../context/useUserContext';
import useThemeContext from '../context/useThemeContext';
import Avatar from './Avatar';
import SettingsDrawer from './SettingsDrawer';
import logoColored from '../assets/images/logo-planning-poker.svg';
import logoWhite from '../assets/images/logo-planning-poker-white.svg';

const appName = import.meta.env.VITE_APP_NAME;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 clamp(16px, 4vw, 32px);
  background: var(--surface-card);
  border-bottom: 1px solid var(--border-subtle);
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 11px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-primary);
  text-decoration: none;

  &:hover,
  &:focus {
    color: var(--text-primary);
    text-decoration: none;
  }

  img {
    object-fit: contain;
    flex: none;
  }

  span {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.02em;
  }
`;

const AvatarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: var(--radius-full);
  display: flex;

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
`;

const Navbar = () => {
  const { isOpen, open, close } = useIsOpen();
  const { userContext } = useUserContext();
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  return (
    <>
      <Header>
        <Brand to="/" title={t('navbar.goHome')}>
          <img
            src={theme === 'light' ? logoColored : logoWhite}
            width={36}
            height={36}
            alt={appName}
          />
          <span>{appName}</span>
        </Brand>
        {userContext && (
          <AvatarButton onClick={open} title={t('navbar.userSettings')}>
            <Avatar {...userContext} size={38} />
          </AvatarButton>
        )}
      </Header>

      <SettingsDrawer isOpen={isOpen} onClose={close} />
    </>
  );
};

export default Navbar;
