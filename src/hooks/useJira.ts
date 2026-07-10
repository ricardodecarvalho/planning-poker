import { httpsCallable } from 'firebase/functions';
import { doc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18n-lite';
import { firestore, functions } from '../firebase';
import { Item } from './useItems';

export interface JiraConfig {
  domain: string;
  email: string;
  token: string;
  jql?: string;
  fieldId?: string;
}

interface JiraIssue {
  jiraId: string;
  key: string;
  summary: string;
  type: string;
  points: number | string | null;
}

interface JiraSearchResult {
  issues: JiraIssue[];
  storyPointsFieldId: string | null;
}

const storageKey = (roomId?: string) => `pp:jira:${roomId}`;

/**
 * Jira connection for the room owner. The credentials (incl. the API token)
 * live ONLY in the owner's browser localStorage and are sent per-request to the
 * `jiraSearch` / `jiraSetEstimate` Cloud Function proxies — never persisted
 * server-side. Fetched issues are written to `rooms/{id}/items` as `source:jira`
 * snapshots so every participant sees the backlog without needing the token.
 */
const useJira = (roomId: string | undefined, isOwner: boolean) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<JiraConfig | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Só o dono carrega a conexão salva localmente (nunca no servidor).
  useEffect(() => {
    if (!roomId || !isOwner) {
      setConfig(null);
      return;
    }
    const stored = localStorage.getItem(storageKey(roomId));
    setConfig(stored ? (JSON.parse(stored) as JiraConfig) : null);
  }, [roomId, isOwner]);

  const persist = useCallback(
    (cfg: JiraConfig | null) => {
      if (!roomId) return;
      if (cfg) localStorage.setItem(storageKey(roomId), JSON.stringify(cfg));
      else localStorage.removeItem(storageKey(roomId));
      setConfig(cfg);
    },
    [roomId],
  );

  const sync = useCallback(
    async (cfg: JiraConfig) => {
      if (!roomId) return;
      setSyncing(true);
      try {
        const callable = httpsCallable<JiraConfig, JiraSearchResult>(
          functions,
          'jiraSearch',
        );
        const { data } = await callable(cfg);

        // Guarda o campo de story points detectado para o write-back.
        if (
          data.storyPointsFieldId &&
          data.storyPointsFieldId !== cfg.fieldId
        ) {
          persist({ ...cfg, fieldId: data.storyPointsFieldId });
        }

        // Escreve cada issue como snapshot de item (participantes leem sem token).
        await Promise.all(
          data.issues.map((issue, index) => {
            const snapshot: Record<string, unknown> = {
              summary: issue.summary,
              source: 'jira',
              key: issue.key,
              type: issue.type,
              jiraId: issue.jiraId,
              order: index,
              createdAt: new Date().toISOString(),
            };
            // Só marca como estimado quando o Jira já tem pontos — assim não
            // apagamos uma estimativa aplicada localmente.
            if (issue.points !== null && issue.points !== undefined) {
              snapshot.estimated = true;
              snapshot.points = issue.points;
            }
            return setDoc(
              doc(firestore, `rooms/${roomId}/items`, issue.jiraId),
              snapshot,
              { merge: true },
            );
          }),
        );
      } catch (error) {
        console.error('Jira sync error:', error);
        toast.error(t('jira.syncError'));
        throw error;
      } finally {
        setSyncing(false);
      }
    },
    [roomId, persist, t],
  );

  const connect = useCallback(
    async (cfg: JiraConfig) => {
      persist(cfg);
      await sync(cfg);
    },
    [persist, sync],
  );

  const applyToJira = useCallback(
    async (item: Item, points: number) => {
      if (!config || !item.jiraId || !config.fieldId) return;
      try {
        const callable = httpsCallable(functions, 'jiraSetEstimate');
        await callable({
          domain: config.domain,
          email: config.email,
          token: config.token,
          issueId: item.jiraId,
          points,
          fieldId: config.fieldId,
        });
      } catch (error) {
        console.error('Jira apply error:', error);
        toast.error(t('jira.applyError'));
      }
    },
    [config, t],
  );

  const disconnect = useCallback(() => persist(null), [persist]);

  return {
    connected: !!config,
    config,
    syncing,
    connect,
    sync: () => (config ? sync(config) : Promise.resolve()),
    applyToJira,
    disconnect,
  };
};

export default useJira;
