import { Vote } from "../hooks/useVotes";
import styled from "styled-components";
import { Participant } from "../hooks/useParticipants";

const List = styled.li<{ $hasVoted: boolean }>`
  ${({ $hasVoted }) =>
    $hasVoted &&
    `
    background: repeating-linear-gradient(
      45deg,
      #cccccc,
      #cccccc 10px,
      #e1e1e1 10px,
      #e1e1e1 20px
    );

    color: #666;
  `};
`;

interface UserListProps {
  users: Participant[];
  votes: Vote[];
}

const UserList = ({ users, votes }: UserListProps) => {
  return (
    <ul className="list-group list-group-horizontal">
      {users.map((user) => {
        const userVote = votes.find((vote) => vote.userId === user.uid);
        const hasVotedClass = !!userVote;
        return (
          <List
            key={user.uid}
            className={`list-group-item`}
            $hasVoted={hasVotedClass}
          >
            {user.displayName}
          </List>
        );
      })}
    </ul>
  );
};

export default UserList;
