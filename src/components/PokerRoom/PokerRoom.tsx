import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { User } from "firebase/auth";

import Share from "./../Share";
import {
  Card,
  HorizontalContainer,
  Results,
  VoteBadge,
} from "./PokerRoom.styles";
import useRoom from "../../hooks/useRoom";
import useVotes from "../../hooks/useVotes";
import useParticipants from "../../hooks/useParticipants";
import UserList from "../UserList";
import { getUniqueDisplayNames } from "../../util";
import useUserConnection from "../../hooks/useUserConnection";
import { auth } from "../../firebase";

const PokerRoom = () => {
  const { roomId } = useParams();

  const { checkRoom } = useRoom();
  const { isShowVotes, votes, vote, clearVotes, handleShowVotes, handleVote } =
    useVotes(roomId);

  const { participants, fetchUsersByParticipants } = useParticipants(roomId);

  const [users, setUsers] = useState<User[]>([]);

  const votingSystem = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?", "☕"];

  const { enterRoom } = useUserConnection();

  useEffect(() => {
    if (!roomId) return;
    const userId = auth.currentUser?.uid || "";
    enterRoom(roomId, userId);
  }, [enterRoom, roomId]);

  // Verificar se é uma sala válida
  useEffect(() => {
    if (!roomId) return;
    checkRoom({ roomId });
  }, [checkRoom, roomId]);

  // Buscar os usuários pelos IDs dos participantes
  useEffect(() => {
    if (participants.length === 0) return;

    fetchUsersByParticipants(participants).then((users) => {
      setUsers(getUniqueDisplayNames(users));
    });
  }, [fetchUsersByParticipants, participants]);

  // Mapeando os usuários por uid
  const usersMap = new Map(users.map((user) => [user.uid, user]));

  // Mapeando os votos e associando o displayName apropriado
  const votesMap = votes.map((vote) => {
    const user = usersMap.get(vote.userId);
    return {
      ...vote,
      user: {
        displayName: user?.displayName,
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
          <UserList {...{ users, votes }} />
        </HorizontalContainer>
      </div>

      {/* Mostrar os votos */}
      <Results className="card mt-2">
        <div className="card-body">
          <h5 className="card-title">Results</h5>

          {isShowVotes && (
            <h6 className="card-subtitle mb-2 text-body-secondary">
              Average: {average.toFixed(2)}
            </h6>
          )}

          <ul className="list-group list-group-flush">
            {votesMap.map((vote) => (
              <li className="list-group-item" key={vote.userId}>
                <VoteBadge className="badge text-bg-dark me-2 position-relative">
                  {isShowVotes ? (
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
                onClick={() => handleShowVotes(!isShowVotes)}
              >
                {`${isShowVotes ? "Hide votes" : "Show votes"}`}
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => clearVotes(roomId)}
              >
                Clear votes
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
              disabled={isShowVotes}
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
