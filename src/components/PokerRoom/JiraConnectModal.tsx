import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { Filter, Globe, KeyRound, Mail, ShieldCheck, X } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import useJira, {
  JiraBoard,
  JiraProject,
  JiraSelection,
  JiraSprint,
} from '../../hooks/useJira';

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

const Body = styled.div`
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-secondary);
  }
`;

const ConnectedBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);

  .who {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 3px var(--success-bg);
  }
  .email {
    font-family: var(--font-mono);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    flex: none;
    background: none;
    border: none;
    color: var(--brand-primary);
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }
`;

const Toggle = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--brand-primary);
  font-family: var(--font-body);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;

const FieldsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: var(--surface-sunken);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);

  .title {
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  label {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13.5px;
    color: var(--text-primary);
    cursor: pointer;
  }
  input {
    width: 16px;
    height: 16px;
    accent-color: var(--brand-primary);
    cursor: pointer;
  }
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

const ErrorText = styled.p`
  margin: 0;
  color: var(--danger);
  font-size: 12.5px;
  line-height: 1.4;
`;

const Hint = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.4;
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
  jira: ReturnType<typeof useJira>;
  onClose: () => void;
}

const JiraConnectModal = ({ open, jira, onClose }: JiraConnectModalProps) => {
  const { t } = useTranslation();

  const [step, setStep] = useState<'creds' | 'select'>('creds');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [fieldId, setFieldId] = useState('');

  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [boards, setBoards] = useState<JiraBoard[]>([]);
  const [sprints, setSprints] = useState<JiraSprint[]>([]);
  const [projectKey, setProjectKey] = useState('');
  const [boardId, setBoardId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [manual, setManual] = useState(false);
  const [jql, setJql] = useState('');
  const [writeSP, setWriteSP] = useState(true);
  const [writeOE, setWriteOE] = useState(false);

  const loadBoards = async (key: string) => {
    setBusy(true);
    try {
      setBoards(await jira.listBoards(key));
    } catch {
      setBoards([]);
    } finally {
      setBusy(false);
    }
  };

  const loadSprints = async (id: number) => {
    try {
      setSprints(await jira.listSprints(id));
    } catch {
      setSprints([]);
    }
  };

  const loadProjects = async () => {
    setBusy(true);
    setError(null);
    try {
      setProjects(await jira.listProjects());
    } catch {
      setError(t('jira.credsError'));
    } finally {
      setBusy(false);
    }
  };

  // Ao abrir: se já há credenciais salvas, pula direto para a escolha do
  // backlog e pré-carrega projetos + a seleção salva desta sala.
  useEffect(() => {
    if (!open) return;
    setError(null);
    if (jira.creds) {
      setDomain(jira.creds.domain);
      setEmail(jira.creds.email);
      setToken(jira.creds.token);
      setFieldId(jira.creds.fieldId ?? '');
      const sel = jira.selection;
      setProjectKey(sel?.projectKey ?? '');
      setBoardId(sel?.boardId ? String(sel.boardId) : '');
      setSprintId(sel?.sprintId ? String(sel.sprintId) : '');
      setManual(sel?.mode === 'jql');
      setJql(sel?.jql ?? '');
      setWriteSP(jira.creds.writeStoryPoints !== false);
      setWriteOE(!!jira.creds.writeOriginalEstimate);
      setStep('select');
      loadProjects();
      if (sel?.projectKey) loadBoards(sel.projectKey);
      if (sel?.boardId) loadSprints(sel.boardId);
    } else {
      setDomain('');
      setEmail('');
      setToken('');
      setFieldId('');
      setProjects([]);
      setBoards([]);
      setSprints([]);
      setProjectKey('');
      setBoardId('');
      setSprintId('');
      setManual(false);
      setJql('');
      setStep('creds');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const credsReady = !!domain.trim() && !!email.trim() && !!token.trim();
  // JQL manual (quando preenchido) tem prioridade; senão usa projeto/board.
  const manualJql = manual ? jql.trim() : '';
  const syncReady = !!manualJql || !!projectKey;

  const submitCreds = async () => {
    if (!credsReady) return;
    setBusy(true);
    setError(null);
    try {
      const list = await jira.saveCreds({
        domain: domain.trim(),
        email: email.trim(),
        token: token.trim(),
        fieldId: fieldId.trim() || undefined,
      });
      setProjects(list);
      setStep('select');
    } catch {
      setError(t('jira.credsError'));
    } finally {
      setBusy(false);
    }
  };

  const onProjectChange = (key: string) => {
    setProjectKey(key);
    setBoardId('');
    setBoards([]);
    setSprints([]);
    setSprintId('');
    if (key) loadBoards(key);
  };

  const onBoardChange = (id: string) => {
    setBoardId(id);
    setSprints([]);
    setSprintId('');
    const board = boards.find((b) => String(b.id) === id);
    if (id && board?.type === 'scrum') loadSprints(Number(id));
  };

  const changeCreds = () => {
    jira.clearCreds();
    setProjects([]);
    setBoards([]);
    setSprints([]);
    setStep('creds');
  };

  const doSync = async () => {
    let sel: JiraSelection | null = null;
    const projectName = projects.find((p) => p.key === projectKey)?.name;
    const board = boards.find((b) => String(b.id) === boardId);
    if (manualJql) {
      sel = { mode: 'jql', jql: manualJql };
    } else if (sprintId) {
      const sprint = sprints.find((s) => String(s.id) === sprintId);
      sel = {
        mode: 'sprint',
        sprintId: Number(sprintId),
        sprintName: sprint?.name,
        boardId: Number(boardId),
        boardName: board?.name,
        boardType: board?.type,
        projectKey,
        projectName,
      };
    } else if (boardId) {
      sel = {
        mode: 'board',
        boardId: Number(boardId),
        boardName: board?.name,
        boardType: board?.type,
        projectKey,
        projectName,
      };
    } else if (projectKey) {
      sel = { mode: 'project', projectKey, projectName };
    }
    if (!sel) return;
    setBusy(true);
    setError(null);
    try {
      await jira.syncSelection(sel);
      onClose();
    } catch {
      setError(t('jira.syncError'));
    } finally {
      setBusy(false);
    }
  };

  const projectOptions = [
    { label: t('jira.selectProject'), value: '' },
    ...projects.map((p) => ({ label: `${p.key} · ${p.name}`, value: p.key })),
  ];
  const boardOptions = [
    { label: t('jira.selectBoard'), value: '' },
    ...boards.map((b) => ({
      label: `${b.name} (${b.type})`,
      value: String(b.id),
    })),
  ];
  const sprintOptions = [
    { label: t('jira.backlog'), value: '' },
    ...sprints.map((s) => ({
      label: `${s.name} · ${s.state}`,
      value: String(s.id),
    })),
  ];

  return (
    <Overlay>
      <Scrim onClick={onClose} />
      <Dialog>
        <Head>
          <span className="mark">J</span>
          <div className="titles">
            <h2>
              {step === 'creds'
                ? t('jira.connectTitle')
                : t('jira.chooseBacklog')}
            </h2>
            <p>
              {step === 'creds'
                ? t('jira.connectSubtitle')
                : t('jira.selectPrompt')}
            </p>
          </div>
          <CloseButton
            onClick={onClose}
            title={t('jira.cancel')}
            aria-label="Close"
          >
            <X size={19} />
          </CloseButton>
        </Head>

        {step === 'creds' ? (
          <Body>
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
            <SecureNote>
              <ShieldCheck size={17} color="var(--success)" />
              <span>{t('jira.secureNote')}</span>
            </SecureNote>
            <Input
              label={t('jira.fieldId')}
              value={fieldId}
              onChange={setFieldId}
              hint={t('jira.fieldIdHint')}
              autoComplete="off"
            />
            {error && <ErrorText>{error}</ErrorText>}
          </Body>
        ) : (
          <Body>
            <ConnectedBar>
              <span className="who">
                <span className="dot" />
                <span className="email">
                  {t('jira.connectedAs').replace('{email}', email)}
                </span>
              </span>
              <button type="button" onClick={changeCreds}>
                {t('jira.changeCredentials')}
              </button>
            </ConnectedBar>

            <Field>
              <span className="label">{t('jira.project')}</span>
              <Select
                block
                options={projectOptions}
                value={projectKey}
                onChange={(e) => onProjectChange(e.target.value)}
              />
            </Field>
            <Field>
              <span className="label">{t('jira.board')}</span>
              <Select
                block
                options={boardOptions}
                value={boardId}
                onChange={(e) => onBoardChange(e.target.value)}
                disabled={!projectKey || boards.length === 0}
              />
              {projectKey && !busy && boards.length === 0 && (
                <Hint>{t('jira.noBoards')}</Hint>
              )}
            </Field>

            {boardId && sprints.length > 0 && (
              <Field>
                <span className="label">{t('jira.source')}</span>
                <Select
                  block
                  options={sprintOptions}
                  value={sprintId}
                  onChange={(e) => setSprintId(e.target.value)}
                />
              </Field>
            )}

            <Toggle type="button" onClick={() => setManual((m) => !m)}>
              {t('jira.manualJql')}
            </Toggle>
            {manual && (
              <Input
                label={t('jira.jql')}
                iconLeft={<Filter size={17} />}
                placeholder="project = ABC ORDER BY created DESC"
                value={jql}
                onChange={setJql}
                hint={t('jira.manualJqlHint')}
                autoComplete="off"
              />
            )}

            <FieldsBox>
              <span className="title">{t('jira.fieldsToUpdate')}</span>
              <label>
                <input
                  type="checkbox"
                  checked={writeSP}
                  onChange={(e) => {
                    setWriteSP(e.target.checked);
                    jira.updateWriteFlags(e.target.checked, writeOE);
                  }}
                />
                {t('jira.fieldStoryPoints')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={writeOE}
                  onChange={(e) => {
                    setWriteOE(e.target.checked);
                    jira.updateWriteFlags(writeSP, e.target.checked);
                  }}
                />
                {t('jira.fieldOriginalEstimate')}
              </label>
            </FieldsBox>
            {error && <ErrorText>{error}</ErrorText>}
          </Body>
        )}

        <Foot>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('jira.cancel')}
          </Button>
          {step === 'creds' ? (
            <Button
              variant="primary"
              onClick={submitCreds}
              disabled={!credsReady || busy}
            >
              {busy ? t('jira.validating') : t('jira.continue')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={doSync}
              disabled={!syncReady || busy}
            >
              {busy ? t('jira.syncing') : t('jira.sync')}
            </Button>
          )}
        </Foot>
      </Dialog>
    </Overlay>
  );
};

export default JiraConnectModal;
