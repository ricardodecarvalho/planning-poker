import styled from 'styled-components';

import GitHubLogo from '../assets/images/github-mark.svg';
import GitHubLogoWhite from '../assets/images/github-mark-white.svg';
import useThemeContext from '../context/useThemeContext';
import { useTranslation } from 'react-i18n-lite';

const StyledFooter = styled.footer`
  width: 100%;
  margin: 1rem 0;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 1rem;
`;

const GitHub = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Footer = () => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  return (
    <StyledFooter className="mt-5">
      <FooterContainer>
        <GitHub className="mb-3">
          <img
            src={theme === 'dark' ? GitHubLogoWhite : GitHubLogo}
            alt={t('navbar.repository')}
            height={24}
          />
          <a
            target="_blank"
            href="https://github.com/ricardodecarvalho/planning-poker"
          >
            {t('navbar.repository')}
          </a>
        </GitHub>
      </FooterContainer>
    </StyledFooter>
  );
};

export default Footer;
