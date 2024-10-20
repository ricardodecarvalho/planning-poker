import { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "firebase/auth";

import styled from "styled-components";
import Share from "./Share";
import { toast } from "react-toastify";

const HorizontalContainer = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  gap: 1rem;
  width: 100%;
`;

const Card = styled.button<{ checked: boolean }>`
  display: flex;
  font-size: 2rem;
  height: 8rem;
  min-width: 4.8rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  cursor: pointer;
  background-color: #fff;
  padding: 0.5rem;
  margin: 0;
  transition: all 0.1s linear;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #212529;
    color: #fff;
    border-color: #212529;
  }

  ${({ checked }) => checked && "background-color: #007bff; color: #fff;"}
`;

const VoteBadge = styled.span`
  width: 3rem;
`;

const Results = styled.div`
  min-height: 20rem;
`;

interface Vote {
  userId: string;
  voteValue: number;
  votedAt: string;
  roomId: string;
}

const PokerRoom = () => {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const [vote, setVote] = useState<number | string | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showVotes, setShowVotes] = useState(false);

  const votingSystem = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?", "☕"];

  // Verificar se é uma sala válida
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, "rooms", roomId);

    const checkRoom = async () => {
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        navigate("/");
        return;
      }
    };

    checkRoom();
  }, [navigate, roomId]);

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
      if (allVotes.length === 0) {
        setVote(null);
      }
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

    // Solução para mais de 10 Participantes
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

  const clearVotes = async (roomId: string | undefined) => {
    if (!roomId) {
      console.error("No room ID provided");
      toast.error("Error clearing votes, no room ID provided");
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

      setVote(null);
      handleShowVotes(false);

      console.log(`All votes cleared for room: ${roomId}`);
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
      setShowVotes(action);
    } catch (error) {
      console.error("Error updating room: ", error);
      toast.error("Error updating room");
    }
  };

  // Mapeando os usuários por uid
  const usersMap = new Map(users.map((user) => [user.uid, user]));

  // Mapeando os votos e associando o displayName apropriado
  const votesMap = votes.map((vote) => {
    const user = usersMap.get(vote.userId);
    return {
      ...vote,
      user: {
        displayName:
          user?.displayName?.split(" ")[0] || user?.email?.split("@")[0],
      },
    };
  });

  // Calcular a média dos votos válidos (apenas números)
  const validVotes = votesMap.filter(
    (vote) => typeof vote.voteValue === "number"
  );
  const totalVotes = validVotes.reduce(
    (acc, vote) => acc + (vote.voteValue || 0),
    0
  );
  const average = validVotes.length ? totalVotes / validVotes.length : 0;

  return (
    <div className="container">
      {/* Compartilhar */}
      <Share {...{ roomId }} />

      {/* Lista de Participantes */}
      <div className="mt-2">
        <h5>
          Participants{" "}
          <span className="badge text-bg-primary rounded-pill">
            {users.length}
          </span>
        </h5>
        <HorizontalContainer>
          <ul className="list-group list-group-horizontal">
            {users.map((user) => (
              <li key={user.uid} className="list-group-item">
                {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
              </li>
            ))}
          </ul>
        </HorizontalContainer>
      </div>

      {/* Mostrar os votos */}
      <Results className="card mt-2">
        <div className="card-body">
          <h5 className="card-title">Results</h5>

          {showVotes && (
            <h6 className="card-subtitle mb-2 text-body-secondary">
              Average: {average.toFixed(2)}
            </h6>
          )}

          <ul className="list-group list-group-flush">
            {votesMap.map((vote) => (
              <li className="list-group-item" key={vote.userId}>
                <VoteBadge className="badge text-bg-dark me-2 position-relative">
                  {showVotes ? (
                    vote.voteValue
                  ) : (
                    <span className="visually-hidden">?</span>
                  )}
                </VoteBadge>
                {vote.user.displayName}
              </li>
            ))}
          </ul>

          {votes.length > 0 && (
            <div className="mt-2 btn-group">
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleShowVotes(!showVotes)}
              >
                {`${showVotes ? "Hide votes" : "Show votes"}`}
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => clearVotes(roomId)}
              >
                Clean votes
              </button>
            </div>
          )}
        </div>
      </Results>

      {/* Cards */}
      <div className="mt-3">
        <HorizontalContainer>
          {votingSystem.map((value) => (
            <Card
              key={value}
              checked={vote === value}
              onClick={() => handleVote(value)}
            >
              {value}
            </Card>
          ))}
        </HorizontalContainer>
      </div>
    </div>
  );
};

export default PokerRoom;
