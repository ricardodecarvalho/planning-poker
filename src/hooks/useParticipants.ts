import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { auth, database, firestore } from "../firebase";
import { User } from "firebase/auth";
import { child, get, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

interface ParticipantStatus {
  [userId: string]: boolean;
}

export interface Participant extends User {
  state: string;
  createdAt: string;
  colorScheme: {
    bg: string;
    text: string;
  };
}

const useParticipants = (roomId?: string) => {
  const [participants, setParticipants] = useState<string[]>([]);

  const navigate = useNavigate();

  const checkRoomCapacity = async (roomId: string) => {
    if (!roomId) return;

    const roomRef = doc(firestore, "rooms", roomId);

    const roomSnapshot = await getDoc(roomRef);

    // Definir a capacidade máxima da sala
    const maxParticipants = 2;

    console.log("roomSnapshot: ", roomSnapshot);

    const roomData = roomSnapshot.data();

    if (roomData?.participants.length >= maxParticipants) {
      navigate("/full-room");
      return;
    }
  };

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
        participants: arrayUnion(auth.currentUser?.uid)
      });
    };
    addParticipantToRoom();

    return () => unsubscribeRoom();
  }, [navigate, participants.length, roomId]);

  const fetchParticipantStatus = useCallback(async (roomId: string) => {
    const dbRef = ref(database);
    const parsedData: ParticipantStatus = {};

    try {
      const snapshot = await get(child(dbRef, `presence/${roomId}`));
      if (snapshot.exists()) {
        const data = snapshot.val() || {};
        Object.keys(data).forEach((userId) => {
          parsedData[userId] = data[userId].state === "online";
        });
      }
    } catch (error) {
      console.error("Error fetching participant status: ", error);
    }

    return parsedData;
  }, []);

  // Solução para mais de 10 Participantes
  const fetchUsersByParticipants = useCallback(
    async (participants: string[], roomId: string | undefined) => {
      try {
        const usersRef = collection(firestore, "users");

        // Dividir a lista de participants em chunks de no máximo 10
        const chunkedParticipants = [];
        for (let i = 0; i < participants.length; i += 10) {
          chunkedParticipants.push(participants.slice(i, i + 10));
        }

        const users: Participant[] = [];

        // Executar uma consulta para cada chunk de até 10 participantes
        for (const chunk of chunkedParticipants) {
          const usersQuery = query(usersRef, where("uid", "in", chunk));
          const querySnapshot = await getDocs(usersQuery);

          querySnapshot.docs.forEach((doc) => {
            const userData = doc.data() as Participant;
            users.push(userData);
          });
        }

        if (!roomId) return users;

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
    fetchUsersByParticipants,
    fetchParticipantStatus,
    checkRoomCapacity,
  };
};

export default useParticipants;
