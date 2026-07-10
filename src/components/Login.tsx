import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';

import useAuth from '../hooks/useAuth';
import ConnectionAlert from './ConnectionAlert';
import Select from './ui/Select';
import logoWhite from '../assets/images/logo-planning-poker-white.svg';

const appName = import.meta.env.VITE_APP_NAME;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px 64px;
  background: var(--surface-base);
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 440px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;

  @media (min-width: 860px) {
    flex-direction: row;
    max-width: 940px;
  }
`;

const Brand = styled.div`
  position: relative;
  overflow: hidden;
  flex: none;
  width: 100%;
  padding: 32px 28px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(
    150deg,
    var(--green-500) 0%,
    var(--green-700) 60%,
    var(--green-800) 100%
  );

  @media (min-width: 860px) {
    width: 44%;
    padding: 44px 40px;
    min-height: 440px;
  }
`;

const BrandInner = styled.div`
  position: relative;
  z-index: 2;
`;

const BrandLockup = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: #fff;

  img {
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  }

  span {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 19px;
    letter-spacing: -0.02em;
  }
`;

const Tagline = styled.p`
  margin: 28px 0 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: #fff;
  max-width: 15ch;
`;

const BrandSub = styled.p`
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
  max-width: 34ch;
`;

const BrandGlyph = styled.img`
  position: absolute;
  right: -70px;
  bottom: -70px;
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 24px;
  opacity: 0.28;
  transform: rotate(-8deg);
  z-index: 1;
`;

const Form = styled.div`
  flex: 1;
  padding: clamp(32px, 5vw, 52px) clamp(28px, 5vw, 48px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  min-width: 0;
`;

const Heading = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 30px);
  letter-spacing: -0.02em;
  line-height: 1.15;
`;

const SubText = styled.p`
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.55;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 52px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface-card);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition:
    var(--transition-colors),
    box-shadow var(--duration-fast) var(--ease-standard);

  &:hover:not(:disabled) {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-sm);
  }
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LangRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;

  span {
    color: var(--text-muted);
    font-size: 14px;
    white-space: nowrap;
  }
`;

const Terms = styled.p`
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.5;
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: ppSpin 0.7s linear infinite;
`;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ flex: 'none' }} aria-hidden>
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const Login = () => {
  const { loginWithGoogle, loadingLoginWithGoogle } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const langOptions = [
    { label: 'Português', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
  ];

  return (
    <>
      <ConnectionAlert />
      <Page>
        <Card>
          <Brand>
            <BrandInner>
              <BrandLockup>
                <img src={logoWhite} width={40} height={40} alt="Skaptain" />
                <span>Skaptain</span>
              </BrandLockup>
              <Tagline>{t('login.tagline')}</Tagline>
              <BrandSub>{t('login.brandSubtitle')}</BrandSub>
            </BrandInner>
            <BrandGlyph src={logoWhite} alt="" aria-hidden />
          </Brand>

          <Form>
            <div>
              <Heading>
                {t('login.welcomeTo')}{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{appName}</span>
              </Heading>
              <SubText>{t('login.description')}</SubText>
            </div>

            <GoogleButton
              onClick={loginWithGoogle}
              disabled={loadingLoginWithGoogle}
            >
              {loadingLoginWithGoogle ? <Spinner /> : <GoogleIcon />}
              <span>{t('login.loginWithGoogle')}</span>
            </GoogleButton>

            <LangRow>
              <span>{t('login.language')}</span>
              <Select
                size="sm"
                options={langOptions}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </LangRow>

            <Terms>{t('login.terms')}</Terms>
          </Form>
        </Card>
      </Page>
    </>
  );
};

export default Login;
