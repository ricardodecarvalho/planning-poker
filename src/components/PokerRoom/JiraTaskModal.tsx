import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { ExternalLink, Paperclip, User, X } from 'lucide-react';

import StatusPill from './StatusPill';
import { Item } from '../../hooks/useItems';
import { JiraIssueDetails } from '../../hooks/useJira';
import useThemeContext from '../../context/useThemeContext';

// Resolve a CSS custom property to a concrete color so it can be inlined into
// the sandboxed iframe (which doesn't inherit the app's CSS variables).
const readCssColor = (name: string, fallback: string) => {
  try {
    const probe = document.createElement('span');
    probe.style.cssText = `color:var(${name});position:absolute;visibility:hidden`;
    document.body.appendChild(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value || fallback;
  } catch {
    return fallback;
  }
};

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
  max-width: 680px;
  height: min(90vh, 820px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: ppRise var(--duration-base) var(--ease-out);
  overflow: hidden;
`;

const Head = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .meta {
    flex: 1;
    min-width: 0;
  }
  .top {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .key {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--brand-primary);
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .type {
    font-size: 12px;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  h2 {
    margin: 8px 0 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
    line-height: 1.25;
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
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13px;
`;

const Section = styled.div<{ $grow?: boolean }>`
  ${({ $grow }) =>
    $grow && 'flex:1;min-height:0;display:flex;flex-direction:column;'}

  .label {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }
  iframe {
    width: 100%;
    flex: 1;
    min-height: 240px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--surface-card);
  }
  .empty {
    color: var(--text-muted);
    font-size: 13.5px;
  }
`;

const AttachmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 168px;
  overflow-y: auto;
`;

const Attachment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 13.5px;

  .name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .size {
    flex: none;
    color: var(--text-muted);
    font-size: 12px;
    font-family: var(--font-mono);
  }
`;

const Foot = styled.div`
  padding: 14px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;

  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: var(--control-md);
    padding: 0 15px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface-card);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-weight: var(--weight-semibold);
    font-size: 14px;
    transition: var(--transition-colors);
  }
  a:hover {
    background: var(--fill-hover);
    text-decoration: none;
    color: var(--text-primary);
  }
`;

const formatBytes = (bytes: number) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
};

interface JiraTaskModalProps {
  item: Item | null;
  onClose: () => void;
  fetchDetails: (item: Item) => Promise<JiraIssueDetails | null>;
}

const JiraTaskModal = ({ item, onClose, fetchDetails }: JiraTaskModalProps) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const [details, setDetails] = useState<JiraIssueDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Theme-aware colors resolved from the current tokens, inlined into the
  // sandboxed iframe so the rendered description follows light/dark.
  const descHtml = useMemo(() => {
    if (!details?.descriptionHtml) return '';
    const bg = readCssColor('--surface-card', '#fff');
    const text = readCssColor('--text-primary', '#111');
    const muted = readCssColor('--text-secondary', '#666');
    const link = readCssColor('--brand-primary', '#12a84b');
    const border = readCssColor('--border-subtle', '#e2e2e2');
    const sunken = readCssColor('--surface-sunken', '#f4f4f4');
    return `<!doctype html><meta charset="utf-8"><style>
      html,body{background:${bg};color:${text};margin:0}
      body{font:14px/1.55 system-ui,-apple-system,sans-serif;padding:12px;word-wrap:break-word;overflow-wrap:anywhere}
      a{color:${link}}
      img{max-width:100%;height:auto}
      hr{border:none;border-top:1px solid ${border}}
      blockquote{margin:8px 0;padding-left:12px;border-left:3px solid ${border};color:${muted}}
      code,pre{background:${sunken};border-radius:4px}
      code{padding:1px 4px}
      pre{padding:10px;overflow:auto}
      table{border-collapse:collapse}
      td,th{border:1px solid ${border};padding:4px 8px}
    </style>${details.descriptionHtml}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details?.descriptionHtml, theme]);

  useEffect(() => {
    if (!item) return;
    setDetails(null);
    setError(false);
    setLoading(true);
    fetchDetails(item)
      .then((d) => setDetails(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  if (!item) return null;

  return (
    <Overlay>
      <Scrim onClick={onClose} />
      <Dialog>
        <Head>
          <div className="meta">
            <div className="top">
              {item.browseUrl ? (
                <a
                  className="key"
                  href={item.browseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.key} <ExternalLink size={12} />
                </a>
              ) : (
                <span className="key">{item.key}</span>
              )}
              {(details?.type || item.type) && (
                <span className="type">{details?.type || item.type}</span>
              )}
              <StatusPill
                status={details?.status ?? item.status}
                category={details?.statusCategory ?? item.statusCategory}
              />
            </div>
            <h2>{details?.summary || item.summary}</h2>
          </div>
          <CloseButton
            onClick={onClose}
            title={t('jira.cancel')}
            aria-label="Close"
          >
            <X size={20} />
          </CloseButton>
        </Head>

        <Body>
          {details?.assignee && (
            <Meta>
              <User size={15} />
              <span>{details.assignee}</span>
            </Meta>
          )}

          <Section $grow>
            <span className="label">{t('jira.description')}</span>
            {loading ? (
              <span className="empty">{t('jira.loadingDetails')}</span>
            ) : error ? (
              <span className="empty">{t('jira.detailsError')}</span>
            ) : descHtml ? (
              <iframe
                sandbox=""
                title={t('jira.description')}
                srcDoc={descHtml}
              />
            ) : (
              <span className="empty">{t('jira.noDescription')}</span>
            )}
          </Section>

          {details && details.attachments.length > 0 && (
            <Section>
              <span className="label">
                {t('jira.attachments')} ({details.attachments.length})
              </span>
              <AttachmentList className="pp-scroll">
                {details.attachments.map((a) => (
                  <Attachment key={a.id}>
                    <Paperclip size={15} color="var(--text-muted)" />
                    <span className="name">{a.filename}</span>
                    <span className="size">{formatBytes(a.size)}</span>
                  </Attachment>
                ))}
              </AttachmentList>
            </Section>
          )}
        </Body>

        {item.browseUrl && (
          <Foot>
            <a href={item.browseUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              {t('jira.openInJira')}
            </a>
          </Foot>
        )}
      </Dialog>
    </Overlay>
  );
};

export default JiraTaskModal;
