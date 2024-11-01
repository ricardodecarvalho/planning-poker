import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { toast } from "react-toastify";

export interface Vote {
  userId: string;
  voteValue: number;
  votedAt: string;
  roomId: string;
}

const useVotes = (roomId: string | undefined) => {
  const [isShowVotes, setIsShowVotes] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [vote, setVote] = useState<number | string | null>(null);

  // Observar showVotes em tempo real
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, "rooms", roomId);

    const unsubscribeRoom = onSnapshot(roomRef, (docSnapshot) => {
      const roomData = docSnapshot.data();
      if (roomData?.showVotes !== undefined) {
        setIsShowVotes(roomData.showVotes);
      }
    });

    return () => unsubscribeRoom();
  }, [roomId]);

  // Observar votos em tempo real
  useEffect(() => {
    if (!roomId) return;

    const votesRef = collection(firestore, `rooms/${roomId}/votes`);

    // Escutar as mudanças em tempo real na subcoleção "votes"
    const unsubscribeVotes = onSnapshot(votesRef, (snapshot) => {
      const allVotes = snapshot.docs.map((doc) => doc.data() as Vote);
      setVotes(allVotes);
      if (allVotes.length === 0) {
        setVote(null);
      }
    });

    return () => unsubscribeVotes();
  }, [roomId]);

  const clearVotes = async (roomId: string | undefined) => {
    if (!roomId) {
      console.error("No room ID provided");
      toast.error("Error clearing votes, no room ID provided");
      return;
    }

    try {
      const votesRef = collection(firestore, `rooms/${roomId}/votes`);
      const votesSnapshot = await getDocs(votesRef);

      const deletePromises = votesSnapshot.docs.map((doc) => {
        return deleteDoc(doc.ref);
      });

      await Promise.all(deletePromises);

      setVote(null);
      handleShowVotes(false);
    } catch (error) {
      console.error("Error clearing votes: ", error);
      toast.error("Error clearing votes");
    }
  };

  const handleShowVotes = async (action: boolean) => {
    if (!roomId) return;

    try {
      const roomRef = doc(firestore, "rooms", roomId);

      await updateDoc(roomRef, {
        showVotes: action,
      });
      setIsShowVotes(action);
    } catch (error) {
      console.error("Error updating room: ", error);
      toast.error("Error updating room");
    }
  };

  const handleVote = async (voteValue: number | string) => {
    try {
      const voteRef = doc(
        collection(firestore, `rooms/${roomId}/votes`),
        auth.currentUser?.uid
      );

      const voteData = {
        userId: auth.currentUser?.uid,
        voteValue: voteValue,
        votedAt: new Date().toISOString(),
        roomId: roomId,
      };

      await setDoc(voteRef, voteData);
      setVote(voteValue);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding vote");
    }
  };

  return {
    isShowVotes,
    setIsShowVotes,
    vote,
    votes,
    setVote,
    clearVotes,
    handleShowVotes,
    handleVote,
  };
};

export default useVotes;
