import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import {
  ArrowUpRight,
  FileText,
  Globe,
  Heart,
  LogOut,
  Moon,
  Sun,
  X,
} from 'lucide-react';

import { auth } from '../firebase';
import useUserContext from '../context/useUserContext';
import useThemeContext from '../context/useThemeContext';
import Avatar from './Avatar';
import Switch from './ui/Switch';
import Select from './ui/Select';
import GithubIcon from './ui/GithubIcon';

const appName = import.meta.env.VITE_APP_NAME;
const appVersion = import.meta.env.VITE_APP_VERSION;
const donateLink = import.meta.env.VITE_DONATE_LINK;
const REPOSITORY_LINK = 'https://github.com/ricardodecarvalho/planning-poker';
const TERMS_LINK = 'https://skaptain.com/web-planning-poker/terms-of-use';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
`;

const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background: var(--surface-overlay);
  backdrop-filter: blur(2px);
  animation: ppFade var(--duration-base) var(--ease-out);
`;

const Panel = styled.aside`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: var(--surface-card);
  border-left: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  animation: ppSlideIn var(--duration-slow) var(--ease-out);

  @media (min-width: 480px) {
    width: 384px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
  border-bottom: 1px solid var(--border-subtle);

  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 19px;
    letter-spacing: -0.01em;
  }
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-colors);

  &:hover {
    background: var(--fill-hover);
    color: var(--text-primary);
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  .name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 16px;
  }
  .email {
    color: var(--text-muted);
    font-size: 13px;
    font-family: var(--font-mono);
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Eyebrow = styled.span`
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PrefRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 0;

  .label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14.5px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: var(--border-subtle);
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const linkStyles = `
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 14.5px;
  transition: var(--transition-colors);
  text-align: left;
  width: 100%;
`;

const LinkItem = styled.a`
  ${linkStyles}
  color: var(--text-primary);
  &:hover {
    background: var(--fill-hover);
    text-decoration: none;
    color: var(--text-primary);
  }
`;

const LogoutButton = styled.button`
  ${linkStyles}
  border: none;
  background: none;
  cursor: pointer;
  color: var(--danger);
  font-family: var(--font-body);
  &:hover {
    background: var(--danger-bg);
  }
`;

const Footer = styled.div`
  padding: 14px 22px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 12px;
  font-family: var(--font-mono);
`;

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { t, language, setLanguage } = useTranslation();
  const { userContext } = useUserContext();
  const { theme, toggleTheme } = useThemeContext();

  const isDark = theme === 'dark';

  const logout = async () => {
    onClose();
    await auth.signOut();
  };

  if (!isOpen) return null;

  const langOptions = [
    { label: 'Português', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
  ];

  return (
    <Overlay>
      <Scrim onClick={onClose} />
      <Panel>
        <Header>
          <h2>{t('navbar.userSettings')}</h2>
          <IconButton onClick={onClose} title={t('modal.cancel')} aria-label="Close">
            <X size={20} />
          </IconButton>
        </Header>

        <Body>
          {userContext && (
            <Profile>
              <Avatar {...userContext} size={52} />
              <div style={{ minWidth: 0 }}>
                <div className="name">{userContext.displayName}</div>
                <div className="email">{userContext.email}</div>
              </div>
            </Profile>
          )}

          <Section>
            <Eyebrow>{t('navbar.preferences')}</Eyebrow>
            <Row>
              <Globe size={18} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <Select
                  block
                  size="sm"
                  options={langOptions}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
            </Row>
            <PrefRow>
              <div className="label">
                {isDark ? (
                  <Sun size={18} color="var(--text-secondary)" />
                ) : (
                  <Moon size={18} color="var(--text-secondary)" />
                )}
                <span>{t('navbar.darkTheme')}</span>
              </div>
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                ariaLabel={t('navbar.darkTheme')}
              />
            </PrefRow>
          </Section>

          <Divider />

          <Links>
            <LinkItem href={TERMS_LINK} target="_blank" rel="noreferrer">
              <FileText size={19} />
              <span>{t('navbar.termsOfUse')}</span>
              <ArrowUpRight
                size={15}
                color="var(--text-muted)"
                style={{ marginLeft: 'auto' }}
              />
            </LinkItem>
            <LinkItem href={REPOSITORY_LINK} target="_blank" rel="noreferrer">
              <GithubIcon size={19} />
              <span>{t('navbar.repository')}</span>
              <ArrowUpRight
                size={15}
                color="var(--text-muted)"
                style={{ marginLeft: 'auto' }}
              />
            </LinkItem>
            {donateLink && (
              <LinkItem href={donateLink} target="_blank" rel="noreferrer">
                <Heart size={19} color="var(--coral-500)" />
                <span>{t('navbar.donate')}</span>
              </LinkItem>
            )}
            <LogoutButton onClick={logout}>
              <LogOut size={19} />
              <span>{t('navbar.logout')}</span>
            </LogoutButton>
          </Links>
        </Body>

        <Footer>
          Skaptain · {appName} v{appVersion}
        </Footer>
      </Panel>
    </Overlay>
  );
};

export default SettingsDrawer;
