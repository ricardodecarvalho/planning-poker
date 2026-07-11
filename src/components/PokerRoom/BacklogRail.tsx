import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import {
  FileText,
  Info,
  Layers,
  PlugZap,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import StatusPill from './StatusPill';
import { Item } from '../../hooks/useItems';

// To do -> In progress -> Done (Jira statusCategory keys).
const STATUS_ORDER: Record<string, number> = {
  new: 0,
  indeterminate: 1,
  done: 2,
};

const Aside = styled.aside<{ $mobile?: boolean }>`
  ${({ $mobile }) =>
    $mobile ? `width:100%;` : `flex:none;width:322px;max-height:664px;`}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const RailHeader = styled.div`
  padding: 15px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 14.5px;
    letter-spacing: -0.01em;
  }
  .count {
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: var(--radius-full);
    background: var(--surface-sunken);
    border: 1px solid var(--border-subtle);
    color: var(--text-secondary);
    font-size: 11.5px;
    font-weight: 700;
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const List = styled.div<{ $mobile?: boolean }>`
  ${({ $mobile }) => (!$mobile ? `flex:1;min-height:0;overflow-y:auto;` : '')}
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EmptyState = styled.div`
  padding: 32px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: var(--text-secondary);

  .badge {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    background: var(--success-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    max-width: 30ch;
  }
`;

const Row = styled.div<{ $active: boolean; $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 9px 10px;
  border-radius: var(--radius-md);
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--brand-primary)' : 'transparent')};
  background: ${({ $active }) =>
    $active ? 'var(--success-bg)' : 'transparent'};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: var(--transition-colors);
  text-align: left;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'var(--success-bg)' : 'var(--fill-hover)'};
  }
  &:hover .delete,
  &:hover .iconbtn {
    opacity: 1;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
  }
  .key {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--text-muted);
    font-weight: 600;
  }
  a.key:hover {
    color: var(--brand-primary);
    text-decoration: underline;
  }
  .spacer {
    flex: 1;
  }
  .points {
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: var(--radius-full);
    background: var(--brand-primary);
    color: var(--brand-on-primary);
    font-size: 11.5px;
    font-weight: 700;
    font-family: var(--font-display);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .summary {
    font-size: 13px;
    line-height: 1.35;
    color: var(--text-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .delete {
    flex: none;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-sm);
    border: none;
    background: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition:
      opacity var(--duration-fast),
      var(--transition-colors);
  }
  .delete:hover {
    background: var(--danger-bg);
    color: var(--danger);
  }
  .iconbtn {
    flex: none;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-sm);
    border: none;
    background: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition:
      opacity var(--duration-fast),
      var(--transition-colors);
  }
  .iconbtn:hover {
    background: var(--fill-hover);
    color: var(--brand-primary);
  }
`;

const SectionLabel = styled.span`
  padding: 8px 8px 4px;
  font-size: 10.5px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const AddRow = styled.form`
  padding: 10px 12px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    flex: 1;
    min-width: 0;
    height: 34px;
    padding: 0 10px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface-base);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 13px;
  }
  input:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: var(--shadow-focus);
  }
  button {
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-md);
    border: none;
    background: var(--brand-primary);
    color: var(--brand-on-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-colors);
  }
  button:hover:not(:disabled) {
    background: var(--brand-primary-hover);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const JiraBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border-subtle);

  button {
    flex: 1;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: none;
    color: var(--text-secondary);
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-colors);
  }
  button:hover:not(:disabled) {
    background: var(--fill-hover);
  }
  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .spin {
    animation: ppSpin 0.8s linear infinite;
  }
`;

const ConnectedDot = styled.span`
  flex: none;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 3px var(--success-bg);
`;

export interface BacklogJira {
  connected: boolean;
  syncing: boolean;
  onOpenConnect: () => void;
  onSync: () => void;
}

interface BacklogRailProps {
  items: Item[];
  activeItemId?: string;
  isOwner: boolean;
  onSelect: (id: string) => void;
  onAdd: (summary: string) => void;
  onDelete: (id: string) => void;
  onDetails: (item: Item) => void;
  jira?: BacklogJira;
  mobile?: boolean;
}

const BacklogRail = ({
  items,
  activeItemId,
  isOwner,
  onSelect,
  onAdd,
  onDelete,
  onDetails,
  jira,
  mobile,
}: BacklogRailProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft('');
  };

  // Tasks do Jira (ordenadas por status) e itens avulsos, em seções separadas.
  const jiraItems = items
    .filter((i) => i.source === 'jira')
    .sort(
      (a, b) =>
        (STATUS_ORDER[a.statusCategory ?? ''] ?? 0) -
        (STATUS_ORDER[b.statusCategory ?? ''] ?? 0),
    );
  const manualItems = items.filter((i) => i.source !== 'jira');
  const showSections = jiraItems.length > 0 && manualItems.length > 0;

  const renderRow = (item: Item, idx: number) => (
    <Row
      key={item.id}
      $active={item.id === activeItemId}
      $clickable={isOwner}
      onClick={isOwner ? () => onSelect(item.id) : undefined}
    >
      <div className="top">
        <FileText size={14} color="var(--text-muted)" />
        {item.browseUrl ? (
          <a
            className="key"
            href={item.browseUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {item.key}
          </a>
        ) : (
          <span className="key">{item.key || `#${idx + 1}`}</span>
        )}
        {item.status && (
          <StatusPill status={item.status} category={item.statusCategory} />
        )}
        <span className="spacer" />
        {item.estimated && item.points !== undefined && (
          <span className="points">{item.points}</span>
        )}
        {isOwner && item.source === 'jira' && (
          <button
            type="button"
            className="iconbtn"
            title={t('jira.details')}
            onClick={(e) => {
              e.stopPropagation();
              onDetails(item);
            }}
          >
            <Info size={14} />
          </button>
        )}
        {isOwner && item.source !== 'jira' && (
          <button
            type="button"
            className="delete"
            title={t('backlog.delete')}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <span className="summary">{item.summary}</span>
    </Row>
  );

  return (
    <Aside $mobile={mobile}>
      <RailHeader>
        <span className="title">{t('backlog.title')}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {jira?.connected && <ConnectedDot title={t('jira.connected')} />}
          {items.length > 0 && <span className="count">{items.length}</span>}
        </span>
      </RailHeader>

      {items.length === 0 ? (
        <EmptyState>
          <div className="badge">
            <Layers size={24} color="var(--brand-primary)" />
          </div>
          <p>{isOwner ? t('backlog.emptyOwner') : t('backlog.empty')}</p>
        </EmptyState>
      ) : (
        <List $mobile={mobile}>
          {showSections && jiraItems.length > 0 && (
            <SectionLabel>{t('backlog.jiraSection')}</SectionLabel>
          )}
          {jiraItems.map((item, index) => renderRow(item, index))}
          {showSections && manualItems.length > 0 && (
            <SectionLabel>{t('backlog.manualSection')}</SectionLabel>
          )}
          {manualItems.map((item, index) => renderRow(item, index))}
        </List>
      )}

      {isOwner && (
        <AddRow onSubmit={submit}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('backlog.addPlaceholder')}
            aria-label={t('backlog.addItem')}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            title={t('backlog.addItem')}
          >
            <Plus size={18} />
          </button>
        </AddRow>
      )}

      {isOwner && jira && (
        <JiraBar>
          <button type="button" onClick={jira.onOpenConnect}>
            <PlugZap size={15} />
            {jira.connected ? t('jira.adjustConnection') : t('jira.connect')}
          </button>
          {jira.connected && (
            <button
              type="button"
              onClick={jira.onSync}
              disabled={jira.syncing}
              title={t('jira.sync')}
            >
              <RefreshCw
                size={15}
                className={jira.syncing ? 'spin' : undefined}
              />
              {jira.syncing ? t('jira.syncing') : t('jira.sync')}
            </button>
          )}
        </JiraBar>
      )}
    </Aside>
  );
};

export default BacklogRail;
