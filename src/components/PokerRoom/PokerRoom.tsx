import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18n-lite";

import Share from "./../Share";
import { Card, CardContainer, HorizontalContainer, PokerTableContainer } from "./PokerRoom.styles";
import useRoom from "../../hooks/useRoom";
import useVotes from "../../hooks/useVotes";
import useParticipants, { Participant } from "../../hooks/useParticipants";
import UserList from "../UserList";
import { getUniqueDisplayNames, getVotingStatus } from "../../util";
import useUserConnection from "../../hooks/useUserConnection";
import { auth, firestore } from "../../firebase";
import Avatar from "../Avatar";
import PokerTable from "../PokerTable/PokerTable";
// import ZeClipado from "./ZeClipado/ZeClipado";
import { useIsMobile } from "../../hooks/useIsMobile";
import { VOTING_SYSTEMS, VotingSystemType } from "../../types/votingSystems";
import VotingSystemSelector from "../VotingSystemSelector";
import { useViewPreference } from "../../hooks/useViewPreference";
import ViewToggle from "../ViewToggle";

const PokerRoom = () => {
  const { roomId } = useParams();
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const { checkRoom, currentRoomOwner } = useRoom();
  const { isShowVotes, votes, vote, clearVotes, handleShowVotes, handleVote } =
    useVotes(roomId);

  const { participants, fetchUsersByParticipants } = useParticipants(roomId);

  const [users, setUsers] = useState<Participant[]>([]);
  const [votingSystemType, setVotingSystemType] = useState<VotingSystemType>("fibonacci");

  const votingSystem = VOTING_SYSTEMS[votingSystemType].values;

  const { viewType, toggleView } = useViewPreference();

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

  // Sincronizar o sistema de votação em tempo real
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(firestore, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
      const roomData = docSnapshot.data();
      if (roomData?.votingSystem) {
        setVotingSystemType(roomData.votingSystem as VotingSystemType);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // Buscar os usuários pelos IDs dos participantes
  useEffect(() => {
    if (participants.length === 0) return;

    fetchUsersByParticipants(participants, roomId).then((users) => {
      setUsers(getUniqueDisplayNames(users));
    });
  }, [fetchUsersByParticipants, participants, roomId]);

  const votingStatus = getVotingStatus(users, votes);

  const isRoomOwner = auth.currentUser?.uid === currentRoomOwner;

  const handleAfterShowVotes = (action: boolean) => {
    handleShowVotes(action);

    if (!action || isMobile) {
      return;
    }
  };

  const handleClearVotes = (roomId: string | undefined) => {
    clearVotes(roomId);
  };

  // const votesArray = votingStatus.hasVoted.map((vote) => ({
  //   name: vote.displayName || "",
  //   value: vote.vote.voteValue.toString(),
  // }));

  return (
    <div className="container" style={{ paddingBottom: "150px" }}>
      <div className="row">
        <div className="col-12 mb-2">
          <Share {...{ roomId }} message={t("rooms.copyRoomUrl")} />
        </div>
      </div>

      <div className="row">
        {isRoomOwner && (
          <div className="col-md-12 col-lg-3 order-lg-3 order-1 mb-4">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <VotingSystemSelector
                roomId={roomId || ""}
                currentSystem={votingSystemType}
                hasActiveVotes={votes.length > 0}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleAfterShowVotes(!isShowVotes)}
              >
                {`${isShowVotes ? t("pokerRoom.hideVotes") : t("pokerRoom.showVotes")}`}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleClearVotes(roomId)}
              >
                {t("pokerRoom.clearVotes")}
              </button>
            </div>
          </div>
        )}

        <div className="col-md-4 col-lg-3 order-md-1 order-2 mt-1 mt-md-3">
          <div className="mb-3">
            <ViewToggle viewType={viewType} onToggle={toggleView} />
          </div>
          <UserList {...{ votingStatus, isShowVotes }} />
        </div>

        <PokerTableContainer className="col-md-8 col-lg-6 order-md-2 order-1 mt-md-5">
          {viewType === "table" ? (
            <PokerTable
              votingStatus={votingStatus}
              isShowVotes={isShowVotes}
              users={users}
              votingSystemType={votingSystemType}
            />
          ) : (
            isShowVotes && (
              <div className="d-flex justify-content-center align-items-center flex-column mt-4">
                <h5>{votingSystemType !== "t-shirt" ? t("pokerRoom.average") : t("pokerRoom.mostCommon")}</h5>
                <div
                  style={{ width: "150px", height: "150px" }}
                  className="d-flex justify-content-center align-items-center border border-4 rounded-circle border-dark-subtle"
                >
                  <p className="fw-bolder fs-2 m-0">
                    {votingSystemType !== "t-shirt"
                      ? votingStatus.average.toFixed(2)
                      : (votingStatus.mostCommon || "-")}
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
            )
          )}
        </PokerTableContainer>
      </div>

      {/* Cards */}
      <CardContainer>
        <HorizontalContainer>
          {votingSystem.map((value) => (
            <Card
              key={value}
              className="card"
              checked={vote === value}
              onClick={() => handleVote(value)}
              disabled={isShowVotes}
            >
              <span className="corner-top-left">{value}</span>
              {value}
              <span className="corner-bottom-right">{value}</span>
            </Card>
          ))}
        </HorizontalContainer>
      </CardContainer>

      {/* {isRoomOwner && <ZeClipado votes={votesArray} isShowVotes={isShowVotes} />} */}
    </div>
  );
};

export default PokerRoom;
