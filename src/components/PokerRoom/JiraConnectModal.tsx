import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { Filter, Globe, KeyRound, Mail, ShieldCheck, X } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import { JiraConfig } from '../../hooks/useJira';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background: var(--surface-overlay);
  backdrop-filter: blur(2px);
  animation: ppFade var(--duration-base) var(--ease-out);
`;

const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 456px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: ppRise var(--duration-base) var(--ease-out);
`;

const Head = styled.div`
  padding: 24px 26px 18px;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  border-bottom: 1px solid var(--border-subtle);

  .mark {
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 9px;
    background: var(--blue-500);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 19px;
  }
  .titles {
    flex: 1;
    min-width: 0;
  }
  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 20px;
    letter-spacing: -0.01em;
  }
  p {
    margin: 5px 0 0;
    color: var(--text-secondary);
    font-size: 13.5px;
    line-height: 1.5;
  }
`;

const CloseButton = styled.button`
  flex: none;
  width: 34px;
  height: 34px;
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

const Bodyy = styled.div`
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SecureNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  background: var(--surface-sunken);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  color: var(--text-secondary);

  span {
    font-size: 12.5px;
    line-height: 1.5;
  }
`;

const Foot = styled.div`
  padding: 16px 26px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid var(--border-subtle);
`;

interface JiraConnectModalProps {
  open: boolean;
  initial: JiraConfig | null;
  onClose: () => void;
  onConnect: (cfg: JiraConfig) => void;
}

const JiraConnectModal = ({
  open,
  initial,
  onClose,
  onConnect,
}: JiraConnectModalProps) => {
  const { t } = useTranslation();
  const [domain, setDomain] = useState(initial?.domain ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [token, setToken] = useState(initial?.token ?? '');
  const [jql, setJql] = useState(initial?.jql ?? '');
  const [fieldId, setFieldId] = useState(initial?.fieldId ?? '');

  if (!open) return null;

  const ready = !!domain.trim() && !!email.trim() && !!token.trim();

  const connect = () => {
    if (!ready) return;
    onConnect({
      domain: domain.trim(),
      email: email.trim(),
      token: token.trim(),
      jql: jql.trim() || undefined,
      fieldId: fieldId.trim() || undefined,
    });
    onClose();
  };

  return (
    <Overlay>
      <Scrim onClick={onClose} />
      <Dialog>
        <Head>
          <span className="mark">J</span>
          <div className="titles">
            <h2>{t('jira.connectTitle')}</h2>
            <p>{t('jira.connectSubtitle')}</p>
          </div>
          <CloseButton
            onClick={onClose}
            title={t('jira.cancel')}
            aria-label="Close"
          >
            <X size={19} />
          </CloseButton>
        </Head>

        <Bodyy>
          <Input
            label={t('jira.domain')}
            iconLeft={<Globe size={17} />}
            placeholder="suaequipe.atlassian.net"
            value={domain}
            onChange={setDomain}
            autoComplete="off"
          />
          <Input
            label={t('jira.email')}
            iconLeft={<Mail size={17} />}
            placeholder="voce@empresa.com"
            value={email}
            onChange={setEmail}
            autoComplete="off"
          />
          <Input
            label={t('jira.token')}
            iconLeft={<KeyRound size={17} />}
            type="password"
            placeholder={t('jira.tokenPlaceholder')}
            value={token}
            onChange={setToken}
            hint={t('jira.tokenHint')}
            autoComplete="off"
          />
          <Input
            label={t('jira.jql')}
            iconLeft={<Filter size={17} />}
            placeholder="project = ABC ORDER BY created DESC"
            value={jql}
            onChange={setJql}
            autoComplete="off"
          />
          <Input
            label={t('jira.fieldId')}
            value={fieldId}
            onChange={setFieldId}
            hint={t('jira.fieldIdHint')}
            autoComplete="off"
          />
          <SecureNote>
            <ShieldCheck size={17} color="var(--success)" />
            <span>{t('jira.secureNote')}</span>
          </SecureNote>
        </Bodyy>

        <Foot>
          <Button variant="ghost" onClick={onClose}>
            {t('jira.cancel')}
          </Button>
          <Button variant="primary" onClick={connect} disabled={!ready}>
            {t('jira.connect')}
          </Button>
        </Foot>
      </Dialog>
    </Overlay>
  );
};

export default JiraConnectModal;
