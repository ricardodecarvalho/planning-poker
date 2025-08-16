import styled from "styled-components";
import { useTranslation } from "react-i18n-lite";

import Avatar from "./Avatar";
import { VotingStatus } from "../util";

const Container = styled.div`
  max-height: 350px;
  overflow-y: auto;

  @media (min-width: 768px) {
    max-height: 600px;
  }
`;

interface UserListProps {
  votingStatus: VotingStatus;
  isShowVotes: boolean;
}

const UserList = ({ votingStatus, isShowVotes }: UserListProps) => {
  const { t } = useTranslation();
  
  const hasNotVoted = (votingStatus?.hasNotVoted.length ?? 0) > 0;
  const hasVoted = (votingStatus?.hasVoted?.length ?? 0) > 0;

  return (
    <Container>
      {hasNotVoted && (
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="fw-bold">{t("pokerRoom.waitingForVote")}</div>
          </li>
          {votingStatus?.hasNotVoted.map((participant) => {
            return (
              <li key={participant.uid} className={`list-group-item`}>
                <div className="d-flex align-items-center">
                  <Avatar {...participant} />
                  {participant.displayName}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasVoted && (
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="fw-bold">{t("pokerRoom.voted")}</div>
          </li>
          {votingStatus?.hasVoted.map((participant) => {
            return (
              <li
                key={participant.uid}
                className={`list-group-item d-flex justify-content-between align-items-center`}
              >
                <div className="d-flex align-items-center">
                  <Avatar {...participant} />
                  {participant.displayName}
                </div>
                {isShowVotes && (
                  <span
                    className="d-flex justify-content-center align-items-center rounded-2 text-bg-light fs-6"
                    style={{ width: "32px", height: "32px" }}
                  >
                    {participant.vote.voteValue}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
};

export default UserList;
