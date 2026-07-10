import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';

export interface HistoryVote {
  name: string;
  value: number | string;
}

export interface HistoryEntry {
  id: string;
  itemKey?: string | null;
  itemSummary?: string | null;
  source?: string;
  votes: HistoryVote[];
  average?: number;
  points?: number | string;
  createdAt: string;
  createdBy: string;
}

/**
 * Immutable history of completed voting rounds for a room. Each entry is a
 * self-contained snapshot (item key/summary + the votes at reveal time) so the
 * history survives even if the backlog item or its Jira issue is later removed.
 * Only the room owner may create entries (enforced in firestore.rules).
 */
const useHistory = (roomId?: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const historyRef = query(
      collection(firestore, `rooms/${roomId}/history`),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(historyRef, (snapshot) => {
      setHistory(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<HistoryEntry, 'id'>),
        })),
      );
    });

    return () => unsubscribe();
  }, [roomId]);

  const saveRound = async (
    entry: Omit<HistoryEntry, 'id' | 'createdAt' | 'createdBy'>,
  ) => {
    if (!roomId) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    await addDoc(collection(firestore, `rooms/${roomId}/history`), {
      ...entry,
      createdAt: new Date().toISOString(),
      createdBy: uid,
    });
  };

  return { history, historyCount: history.length, saveRound };
};

export default useHistory;
