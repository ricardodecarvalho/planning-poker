import { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { useParams } from "react-router-dom";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "firebase/auth";

interface Vote {
  userId: string;
  voteValue: number;
  votedAt: string;
  roomId: string;
}

const PokerRoom = () => {
  const { roomId } = useParams();

  const [vote, setVote] = useState<number | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showVotes, setShowVotes] = useState(false);

  // Observar showVotes em tempo real
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, "rooms", roomId);

    const unsubscribeRoom = onSnapshot(roomRef, (docSnapshot) => {
      const roomData = docSnapshot.data();
      if (roomData?.showVotes !== undefined) {
        setShowVotes(roomData.showVotes);
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
    });

    // Limpar o listener quando o componente desmontar
    return () => unsubscribeVotes();
  }, [roomId]);

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

    // Limpar o listener quando o componente desmontar
    return () => unsubscribeRoom();
  }, [roomId]);

  // Buscar os usuários pelos IDs dos participantes
  useEffect(() => {
    if (participants.length === 0) return;

    if (participants.length > 10) {
      console.error("Too many participants to fetch at once");
      return;
    }

    const fetchUsersByParticipants = async (participants: string[]) => {
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
    };

    fetchUsersByParticipants(participants).then((users) => {
      setUsers(users);
    });
  }, [participants]);

  // Submeter um voto
  const handleVote = async (voteValue: number) => {
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
    }
  };

  const clearVotes = async (roomId: string | undefined) => {
    if (!roomId) {
      console.error("No room ID provided");
      return;
    }

    try {
      // Referência à subcoleção "votes" dentro da sala
      const votesRef = collection(firestore, `rooms/${roomId}/votes`);

      // Obter todos os documentos de votos
      const votesSnapshot = await getDocs(votesRef);

      // Deletar cada documento encontrado
      const deletePromises = votesSnapshot.docs.map((doc) => {
        return deleteDoc(doc.ref); // Deleta o documento de voto
      });

      // Esperar todas as promessas de deleção serem concluídas
      await Promise.all(deletePromises);

      console.log(`All votes cleared for room: ${roomId}`);
    } catch (error) {
      console.error("Error clearing votes: ", error);
    }
  };

  const handleShowVotes = async () => {
    if (!roomId) return;

    try {
      const roomRef = doc(firestore, "rooms", roomId);

      await updateDoc(roomRef, {
        showVotes: !showVotes,
      });
      setShowVotes(!showVotes);
    } catch (error) {
      console.error("Error updating room: ", error);
    }
  };

  const usersMap = users.reduce((acc, user) => {
    acc[user.uid] = user;
    return acc;
  }, {} as Record<string, User>);

  const votesMap = votes.map((vote) => {
    const user = usersMap[vote.userId];
    return {
      ...vote,
      user: {
        displayName: user?.displayName || user?.email,
      },
    };
  });

  // calcular a media dos votos
  const votesValues = votesMap.map((vote) => vote.voteValue);
  const average =
    votesValues.reduce((acc, value) => acc + value, 0) / votesValues.length;

  return (
    <div>
      <button onClick={() => auth.signOut()}>Sign out</button>
      <h2>Planning Poker</h2>

      {/* Lista de Participantes */}
      <div>
        <h3>Participants:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.uid}>{user.displayName || user.email}</li>
          ))}
        </ul>
      </div>

      {/* Votar */}
      <div>
        <h3>Your vote: {vote !== null ? vote : "No vote yet"}</h3>
        {[1, 2, 3, 5, 8, 13].map((value) => (
          <button
            key={value}
            disabled={showVotes}
            onClick={() => handleVote(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Mostrar os votos */}
      <div>
        <h3>Votes:</h3>
        <button onClick={handleShowVotes}>{`${
          showVotes ? "Hide votes" : "Show votes"
        }`}</button>
        <button onClick={() => clearVotes(roomId)}>Clean votes</button>
        <ul>
          {votesMap.map((vote) => (
            <li key={vote.userId}>
              {vote.user.displayName}: {showVotes ? vote.voteValue : "x"}
            </li>
          ))}
        </ul>
        {showVotes && votesValues.length > 0 && (
          <p>Average: {average.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default PokerRoom;
