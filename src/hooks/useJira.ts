import { httpsCallable } from 'firebase/functions';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18n-lite';
import { firestore, functions } from '../firebase';
import { Item } from './useItems';

export interface JiraCreds {
  domain: string;
  email: string;
  token: string;
  fieldId?: string;
}

export interface JiraSelection {
  mode: 'board' | 'sprint' | 'project' | 'jql';
  projectKey?: string;
  projectName?: string;
  boardId?: number;
  boardName?: string;
  boardType?: string;
  sprintId?: number;
  sprintName?: string;
  jql?: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraBoard {
  id: number;
  name: string;
  type: string;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
}

interface JiraIssue {
  jiraId: string;
  key: string;
  summary: string;
  type: string;
  points: number | string | null;
}

interface IssuesResult {
  issues: JiraIssue[];
  storyPointsFieldId: string | null;
}

// Credentials are GLOBAL (saved once per browser and reused in every room).
// The selection (project/board/JQL) is per-room, so each room can estimate a
// different backlog. The token lives only here — never on the server.
const CREDS_KEY = 'pp:jira:creds';
const selectionKey = (roomId?: string) => `pp:jira:sel:${roomId}`;

const call = <T>(name: string, data: unknown): Promise<T> =>
  httpsCallable<unknown, T>(functions, name)(data).then((r) => r.data);

const useJira = (roomId: string | undefined, isOwner: boolean) => {
  const { t } = useTranslation();
  const [creds, setCreds] = useState<JiraCreds | null>(null);
  const [selection, setSelection] = useState<JiraSelection | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Credenciais globais (só o dono usa; nunca vão para o servidor).
  useEffect(() => {
    if (!isOwner) {
      setCreds(null);
      return;
    }
    const stored = localStorage.getItem(CREDS_KEY);
    setCreds(stored ? (JSON.parse(stored) as JiraCreds) : null);
  }, [isOwner]);

  // Seleção (projeto/board/JQL) por sala.
  useEffect(() => {
    if (!roomId || !isOwner) {
      setSelection(null);
      return;
    }
    const stored = localStorage.getItem(selectionKey(roomId));
    setSelection(stored ? (JSON.parse(stored) as JiraSelection) : null);
  }, [roomId, isOwner]);

  const persistCreds = useCallback((next: JiraCreds | null) => {
    if (next) localStorage.setItem(CREDS_KEY, JSON.stringify(next));
    else localStorage.removeItem(CREDS_KEY);
    setCreds(next);
  }, []);

  const persistSelection = useCallback(
    (next: JiraSelection | null) => {
      if (!roomId) return;
      if (next)
        localStorage.setItem(selectionKey(roomId), JSON.stringify(next));
      else localStorage.removeItem(selectionKey(roomId));
      setSelection(next);
    },
    [roomId],
  );

  // Valida as credenciais buscando os projetos; só salva se der certo.
  const saveCreds = useCallback(
    async (next: JiraCreds): Promise<JiraProject[]> => {
      const { projects } = await call<{ projects: JiraProject[] }>(
        'jiraProjects',
        next,
      );
      persistCreds(next);
      return projects;
    },
    [persistCreds],
  );

  const listProjects = useCallback(async (): Promise<JiraProject[]> => {
    if (!creds) return [];
    const { projects } = await call<{ projects: JiraProject[] }>(
      'jiraProjects',
      creds,
    );
    return projects;
  }, [creds]);

  const listBoards = useCallback(
    async (projectKeyOrId: string): Promise<JiraBoard[]> => {
      if (!creds) return [];
      const { boards } = await call<{ boards: JiraBoard[] }>('jiraBoards', {
        ...creds,
        projectKeyOrId,
      });
      return boards;
    },
    [creds],
  );

  const listSprints = useCallback(
    async (boardId: number): Promise<JiraSprint[]> => {
      if (!creds) return [];
      const { sprints } = await call<{ sprints: JiraSprint[] }>('jiraSprints', {
        ...creds,
        boardId,
      });
      return sprints;
    },
    [creds],
  );

  const writeIssues = useCallback(
    async (result: IssuesResult) => {
      if (!roomId || !creds) return;
      // Guarda o campo de story points detectado para o write-back.
      if (
        result.storyPointsFieldId &&
        result.storyPointsFieldId !== creds.fieldId
      ) {
        persistCreds({ ...creds, fieldId: result.storyPointsFieldId });
      }
      const newIds = new Set(result.issues.map((issue) => issue.jiraId));

      await Promise.all(
        result.issues.map((issue, index) => {
          const snapshot: Record<string, unknown> = {
            summary: issue.summary,
            source: 'jira',
            key: issue.key,
            type: issue.type,
            jiraId: issue.jiraId,
            order: index,
            createdAt: new Date().toISOString(),
          };
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

      // Reconcilia: remove itens do Jira que não estão mais no backlog
      // escolhido (ao trocar de board/projeto) — mantém os itens manuais.
      const existing = await getDocs(
        query(
          collection(firestore, `rooms/${roomId}/items`),
          where('source', '==', 'jira'),
        ),
      );
      await Promise.all(
        existing.docs
          .filter((d) => !newIds.has(d.id))
          .map((d) => deleteDoc(d.ref)),
      );
    },
    [roomId, creds, persistCreds],
  );

  // Busca as issues conforme a seleção e grava os snapshots de item.
  const syncSelection = useCallback(
    async (sel: JiraSelection) => {
      if (!roomId || !creds) return;
      setSyncing(true);
      try {
        let result: IssuesResult;
        if (sel.mode === 'sprint' && sel.boardId && sel.sprintId) {
          result = await call<IssuesResult>('jiraBoardIssues', {
            ...creds,
            boardId: sel.boardId,
            sprintId: sel.sprintId,
          });
        } else if (sel.mode === 'board' && sel.boardId) {
          result = await call<IssuesResult>('jiraBoardIssues', {
            ...creds,
            boardId: sel.boardId,
          });
        } else if (sel.mode === 'project' && sel.projectKey) {
          result = await call<IssuesResult>('jiraSearch', {
            ...creds,
            jql: `project = "${sel.projectKey}" AND statusCategory != Done ORDER BY created DESC`,
          });
        } else {
          result = await call<IssuesResult>('jiraSearch', {
            ...creds,
            jql: sel.jql,
          });
        }
        await writeIssues(result);
        persistSelection(sel);
      } catch (error) {
        console.error('Jira sync error:', error);
        toast.error(t('jira.syncError'));
        throw error;
      } finally {
        setSyncing(false);
      }
    },
    [roomId, creds, writeIssues, persistSelection, t],
  );

  // Re-sincroniza usando a seleção já salva desta sala.
  const sync = useCallback(
    () => (selection ? syncSelection(selection) : Promise.resolve()),
    [selection, syncSelection],
  );

  const applyToJira = useCallback(
    async (item: Item, points: number) => {
      if (!creds || !item.jiraId || !creds.fieldId) return;
      try {
        await call('jiraSetEstimate', {
          domain: creds.domain,
          email: creds.email,
          token: creds.token,
          issueId: item.jiraId,
          points,
          fieldId: creds.fieldId,
        });
      } catch (error) {
        console.error('Jira apply error:', error);
        toast.error(t('jira.applyError'));
      }
    },
    [creds, t],
  );

  // "Trocar credenciais": limpa credenciais globais e a seleção da sala.
  const clearCreds = useCallback(() => {
    persistCreds(null);
    persistSelection(null);
  }, [persistCreds, persistSelection]);

  return {
    connected: !!creds,
    creds,
    selection,
    syncing,
    saveCreds,
    listProjects,
    listBoards,
    listSprints,
    syncSelection,
    sync,
    applyToJira,
    clearCreds,
  };
};

export default useJira;
