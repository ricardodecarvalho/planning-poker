import styled from "styled-components";

import GitHubLogo from "../assets/images/github-mark.svg";

const DONATE_LINK = import.meta.env.VITE_DONATE_LINK;

const StyledFooter = styled.footer`
  position: sticky;
  bottom: 0;
  width: 100%;
  margin: 1rem 0;
  background-color: #ffffff;
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
