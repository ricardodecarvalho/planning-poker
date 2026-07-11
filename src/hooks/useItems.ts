import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../firebase';

export interface Item {
  id: string;
  summary: string;
  source: 'manual' | 'jira';
  key?: string;
  type?: string;
  jiraId?: string;
  status?: string;
  statusCategory?: string;
  browseUrl?: string;
  estimated?: boolean;
  points?: number | string;
  order?: number;
  createdAt: string;
}

/**
 * Backlog of votable items for a room plus the id of the item currently being
 * estimated (`activeItemId`, stored on the room doc). Only the room owner is
 * allowed to mutate the backlog (enforced in firestore.rules); non-owners just
 * observe. New fields are optional so existing rooms without a backlog keep
 * working unchanged.
 */
const useItems = (roomId?: string) => {
  const [items, setItems] = useState<Item[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | undefined>();

  // Observar os itens do backlog em tempo real
  useEffect(() => {
    if (!roomId) return;

    const itemsRef = query(
      collection(firestore, `rooms/${roomId}/items`),
      orderBy('order', 'asc'),
    );

    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      setItems(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Item, 'id'>),
        })),
      );
    });

    return () => unsubscribe();
  }, [roomId]);

  // Observar o item ativo (campo activeItemId na sala) em tempo real
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, 'rooms', roomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      setActiveItemId(snapshot.data()?.activeItemId as string | undefined);
    });

    return () => unsubscribe();
  }, [roomId]);

  const addItem = async (summary: string) => {
    if (!roomId) return;
    const trimmed = summary.trim();
    if (!trimmed) return;

    await addDoc(collection(firestore, `rooms/${roomId}/items`), {
      summary: trimmed,
      source: 'manual',
      estimated: false,
      order: items.length,
      createdAt: new Date().toISOString(),
    });
  };

  const deleteItem = async (itemId: string) => {
    if (!roomId) return;
    await deleteDoc(doc(firestore, `rooms/${roomId}/items`, itemId));

    // Se o item removido era o ativo, limpa a referência na sala.
    if (activeItemId === itemId) {
      await updateDoc(doc(firestore, 'rooms', roomId), {
        activeItemId: deleteField(),
      });
    }
  };

  const setActiveItem = async (itemId?: string) => {
    if (!roomId) return;
    await updateDoc(doc(firestore, 'rooms', roomId), {
      activeItemId: itemId ?? deleteField(),
    });
  };

  const markEstimated = async (itemId: string, points: number | string) => {
    if (!roomId) return;
    await updateDoc(doc(firestore, `rooms/${roomId}/items`, itemId), {
      estimated: true,
      points,
    });
  };

  return {
    items,
    activeItemId,
    addItem,
    deleteItem,
    setActiveItem,
    markEstimated,
  };
};

export default useItems;
