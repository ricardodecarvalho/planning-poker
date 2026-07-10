import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { History as HistoryIcon, Inbox, X } from 'lucide-react';

import { HistoryEntry } from '../../hooks/useHistory';

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
    width: 420px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
  border-bottom: 1px solid var(--border-subtle);

  .title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
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
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Empty = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: var(--text-muted);

  p {
    margin: 0;
    font-size: 14px;
    max-width: 28ch;
    line-height: 1.5;
  }
`;

const RoundCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  padding: 14px 16px;

  .info {
    flex: 1;
    min-width: 0;
  }
  .key {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--brand-primary);
    font-weight: 600;
  }
  .summary {
    margin-top: 3px;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 14.5px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    color: var(--text-muted);
    font-size: 12px;
    font-family: var(--font-mono);
  }
  .points {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .points .value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 26px;
    line-height: 1;
    color: var(--brand-primary);
  }
  .points .label {
    font-size: 10px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

const HistoryDrawer = ({ open, onClose, history }: HistoryDrawerProps) => {
  const { t, language } = useTranslation();

  if (!open) return null;

  const formatWhen = (iso: string) =>
    new Date(iso).toLocaleString(language, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Overlay>
      <Scrim onClick={onClose} />
      <Panel>
        <Header>
          <div className="title">
            <HistoryIcon size={20} />
            <h2>{t('history.title')}</h2>
          </div>
          <IconButton
            onClick={onClose}
            title={t('modal.cancel')}
            aria-label="Close"
          >
            <X size={20} />
          </IconButton>
        </Header>

        <Body className="pp-scroll">
          {history.length === 0 ? (
            <Empty>
              <Inbox size={34} color="var(--text-muted)" />
              <p>{t('history.empty')}</p>
            </Empty>
          ) : (
            history.map((round) => {
              const hasAvg = typeof round.average === 'number';
              return (
                <RoundCard key={round.id}>
                  <div className="info">
                    {round.itemKey && (
                      <span className="key">{round.itemKey}</span>
                    )}
                    <div className="summary">
                      {round.itemSummary || t('history.untitled')}
                    </div>
                    <div className="meta">
                      <span>
                        {t('history.votes').replace(
                          '{count}',
                          String(round.votes?.length ?? 0),
                        )}
                      </span>
                      {hasAvg && (
                        <>
                          <span>·</span>
                          <span>~{round.average?.toFixed(1)}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{formatWhen(round.createdAt)}</span>
                    </div>
                  </div>
                  <div className="points">
                    <span className="value">
                      {round.points !== undefined ? round.points : '—'}
                    </span>
                    <span className="label">{t('history.pts')}</span>
                  </div>
                </RoundCard>
              );
            })
          )}
        </Body>
      </Panel>
    </Overlay>
  );
};

export default HistoryDrawer;
