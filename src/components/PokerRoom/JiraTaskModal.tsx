import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { ExternalLink, Paperclip, User, X } from 'lucide-react';

import StatusPill from './StatusPill';
import { Item } from '../../hooks/useItems';
import { JiraIssueDetails } from '../../hooks/useJira';

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
  max-width: 620px;
  max-height: 88vh;
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
  overflow-y: auto;
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

const Section = styled.div`
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
    min-height: 120px;
    max-height: 320px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--surface-base);
  }
  .empty {
    color: var(--text-muted);
    font-size: 13.5px;
  }
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
  const [details, setDetails] = useState<JiraIssueDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

        <Body className="pp-scroll">
          {details?.assignee && (
            <Meta>
              <User size={15} />
              <span>{details.assignee}</span>
            </Meta>
          )}

          <Section>
            <span className="label">{t('jira.description')}</span>
            {loading ? (
              <span className="empty">{t('jira.loadingDetails')}</span>
            ) : error ? (
              <span className="empty">{t('jira.detailsError')}</span>
            ) : details?.descriptionHtml ? (
              <iframe
                sandbox=""
                title={t('jira.description')}
                srcDoc={`<!doctype html><meta charset="utf-8"><style>body{font:14px/1.55 system-ui,sans-serif;color:#111;margin:12px}img{max-width:100%}a{color:#12a84b}</style>${details.descriptionHtml}`}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {details.attachments.map((a) => (
                  <Attachment key={a.id}>
                    <Paperclip size={15} color="var(--text-muted)" />
                    <span className="name">{a.filename}</span>
                    <span className="size">{formatBytes(a.size)}</span>
                  </Attachment>
                ))}
              </div>
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
