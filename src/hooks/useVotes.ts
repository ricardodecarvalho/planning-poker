import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

type Votes = { [key: string]: number };

const useVotes = (roomId: string | undefined) => {
  const [votes, setVotes] = useState<Votes>({});

  useEffect(() => {
    if (!roomId) return;

    const votesRef = collection(firestore, `rooms/${roomId}/votes`);

    const unsubscribe = onSnapshot(votesRef, (snapshot) => {
      const newVotes = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().vote;
        return acc;
      }, {} as { [key: string]: number });
      setVotes(newVotes);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { votes };
};

export default useVotes;
