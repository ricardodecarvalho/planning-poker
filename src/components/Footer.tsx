import styled from "styled-components";

import GitHubLogo from "../assets/images/github-mark.svg";
import GitHubLogoWhite from "../assets/images/github-mark-white.svg";
import useThemeContext from "../context/useThemeContext";

const DONATE_LINK = import.meta.env.VITE_DONATE_LINK;

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

const Donate = styled.div``;

const Footer = () => {
  const { theme } = useThemeContext();
  return (
    <StyledFooter className="mt-5">
      <FooterContainer>
        <GitHub className="mb-3">
          <img
            src={theme === "dark" ? GitHubLogoWhite : GitHubLogo}
            alt="GitHub Logo"
            height={24}
          />
          <a
            target="_blank"
            href="https://github.com/ricardodecarvalho/planning-poker"
          >
            Repository
          </a>
        </GitHub>
        {" | "}
        <Donate>
          <a target="_blank" href={DONATE_LINK}>
            Donate
          </a>
        </Donate>
      </FooterContainer>
    </StyledFooter>
  );
};

export default Footer;
