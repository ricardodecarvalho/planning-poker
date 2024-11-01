import { User } from "firebase/auth";
import { Vote } from "../hooks/useVotes";
import styled from "styled-components";

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

const UserList = ({ users, votes }: { users: User[]; votes: Vote[] }) => {
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
