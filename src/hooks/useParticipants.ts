import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { User } from "firebase/auth";

const useParticipants = (roomId?: string) => {
  const [participants, setParticipants] = useState<string[]>([]);

  // Observar os participantes em tempo real
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, "rooms", roomId);

    const unsubscribeRoom = onSnapshot(roomRef, (docSnapshot) => {
      const roomData = docSnapshot.data();
      if (roomData?.participants && roomData.participants.length > 0) {
        setParticipants(roomData.participants);
      }
    });

    // Adicionar o participante atual à sala
    const addParticipantToRoom = async () => {
      await updateDoc(roomRef, {
        participants: arrayUnion(auth.currentUser?.uid),
      });
    };
    addParticipantToRoom();

    return () => unsubscribeRoom();
  }, [roomId]);

  // Solução para mais de 10 Participantes
  const fetchUsersByParticipants = useCallback(
    async (participants: string[]) => {
      try {
        const usersRef = collection(firestore, "users");

        // Dividir a lista de participants em chunks de no máximo 10
        const chunkedParticipants = [];
        for (let i = 0; i < participants.length; i += 10) {
          chunkedParticipants.push(participants.slice(i, i + 10));
        }

        const users: User[] = [];

        // Executar uma consulta para cada chunk de até 10 participantes
        for (const chunk of chunkedParticipants) {
          const usersQuery = query(usersRef, where("uid", "in", chunk));
          const querySnapshot = await getDocs(usersQuery);

          querySnapshot.docs.forEach((doc) => {
            const userData = doc.data() as User;
            users.push(userData);
          });
        }

        return users;
      } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
      }
    },
    []
  );

  return {
    participants,
    fetchUsersByParticipants
  };
};

export default useParticipants;
