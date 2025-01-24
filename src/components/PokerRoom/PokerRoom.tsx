import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Share from "./../Share";
import { Card, HorizontalContainer } from "./PokerRoom.styles";
import useRoom from "../../hooks/useRoom";
import useVotes from "../../hooks/useVotes";
import useParticipants, { Participant } from "../../hooks/useParticipants";
import UserList from "../UserList";
import { getUniqueDisplayNames, getVotingStatus } from "../../util";
import useUserConnection from "../../hooks/useUserConnection";
import { auth, firestore } from "../../firebase";
import Avatar from "../Avatar";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

const PokerRoom = () => {
  const { roomId } = useParams();

  const { checkRoom, currentRoomOwner } = useRoom();
  const { isShowVotes, votes, vote, clearVotes, handleShowVotes, handleVote } =
    useVotes(roomId);

  const { participants, fetchUsersByParticipants } = useParticipants(roomId);

  const [users, setUsers] = useState<Participant[]>([]);

  const votingSystem = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?", "☕"];

  const { enterRoom } = useUserConnection();

  const userId = auth.currentUser?.uid;

  // monitorar a presença do usuário
  useEffect(() => {
    if (!userId) return;

    const usersRef = collection(firestore, "users");

    const unsubscribe = onSnapshot(usersRef, (docSnapshot) => {
      docSnapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const modifiedUser = change.doc.data();

          const userExists = users.map((user) =>
            user.uid === modifiedUser.uid ? (modifiedUser as Participant) : user
          );

          setUsers(getUniqueDisplayNames(userExists));
        }
      });
    });

    const updateUser = async () => {
      const userDocRef = doc(firestore, "users", userId);
      const userData = {
        state: "online",
      };

      await updateDoc(userDocRef, userData);
    };
    updateUser();

    return () => unsubscribe();
  }, [userId, users]);

  useEffect(() => {
    if (!roomId || !userId) return;
    enterRoom(roomId, userId);
  }, [enterRoom, roomId, userId]);

  // Verificar se é uma sala válida
  useEffect(() => {
    if (!roomId) return;
    checkRoom({ roomId });
  }, [checkRoom, roomId]);

  // Buscar os usuários pelos IDs dos participantes
  useEffect(() => {
    if (participants.length === 0) return;

    fetchUsersByParticipants(participants, roomId).then((users) => {
      setUsers(getUniqueDisplayNames(users));
    });
  }, [fetchUsersByParticipants, participants, roomId]);

  const votingStatus = getVotingStatus(users, votes);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-2">
          <Share {...{ roomId }} message="Copy room URL" />
        </div>
      </div>

      <div className="row">
        {auth.currentUser?.uid === currentRoomOwner && (
          <div className="col-md-12 col-lg-3 order-lg-3 order-1 mb-4">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                className="btn btn-primary"
                onClick={() => handleShowVotes(!isShowVotes)}
              >
                {`${isShowVotes ? "Hide votes" : "Show votes"}`}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => clearVotes(roomId)}
              >
                Clear votes
              </button>
            </div>
          </div>
        )}

        <div className="col-md-4 col-lg-3 order-md-1 order-2 mt-1 mt-md-3">
          <UserList {...{ votingStatus, isShowVotes }} />
        </div>

        <div className="col-md-8 col-lg-6 order-md-2 order-1 mt-md-5">
          {isShowVotes && (
            <div className="d-flex justify-content-center align-items-center flex-column">
              <h5>Average</h5>
              <div
                style={{ width: "150px", height: "150px" }}
                className="d-flex justify-content-center align-items-center border border-4 rounded-circle border-dark-subtle"
              >
                <p className="fw-bolder fs-2 m-0">
                  {votingStatus.average.toFixed(2)}
                </p>
              </div>

              <div className="mt-3 mt-md-3">
                <ul className="list-group list-group-flush">
                  {Object.keys(votingStatus.votesGrouped).map((vote) => (
                    <li key={vote} className="list-group-item ps-5 pe-5">
                      <div className="d-flex justify-content-end align-items-center">
                        {votingStatus.votesGrouped[vote].map((participant) => (
                          <div
                            key={participant.uid}
                            style={{ marginLeft: "-15px" }}
                          >
                            <Avatar {...participant} />
                          </div>
                        ))}
                        <span
                          className="d-flex justify-content-center align-items-center rounded-2 text-bg-light fs-6 mb-0 border border-secondary"
                          style={{ width: "32px", height: "32px" }}
                        >
                          {vote}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="mt-5">
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
