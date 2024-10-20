import styled from "styled-components";

import GitHubLogo from "../assets/images/github-mark.svg";

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-bottom: 1rem;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const GitHub = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <FooterContainer>
        <GitHub className="mb-3">
          <img src={GitHubLogo} alt="GitHub Logo" height={24} />
          <a
            target="_blank"
            href="https://github.com/ricardodecarvalho/planning-poker"
          >
            Repository
          </a>
        </GitHub>
      </FooterContainer>
    </StyledFooter>
  );
};

export default Footer;
