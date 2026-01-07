import React from 'react';
import { useTranslation } from 'react-i18n-lite';
import Avatar from '../Avatar';
import { VotingStatus } from '../../util';
import { Participant } from '../../hooks/useParticipants';
import { VotingSystemType } from '../../types/votingSystems';
import {
  TableContainer,
  Table,
  CenterContent,
  AverageValue,
  Seat,
  PlayerName,
  CardBack,
  VoteValue,
} from './PokerTable.styles';

interface PokerTableProps {
  votingStatus: VotingStatus;
  isShowVotes: boolean;
  users: Participant[];
  votingSystemType: VotingSystemType;
}

const PokerTable: React.FC<PokerTableProps> = ({
  votingStatus,
  isShowVotes,
  users,
  votingSystemType,
}) => {
  const { t } = useTranslation();

  // For non-numeric systems (like T-shirt), show most common value instead of average
  const isNumericSystem = votingSystemType !== 't-shirt';
  const displayValue = isNumericSystem
    ? votingStatus.average.toFixed(1)
    : votingStatus.mostCommon || '-';

  // Combine users with their voting status
  // We need to map the full list of users to see who is online/offline and their vote
  const seatedUsers = users.map((user) => {
    // Check if user has voted
    const votedUser = votingStatus.hasVoted.find((v) => v.uid === user.uid);
    const hasVoted = !!votedUser;
    const voteValue = votedUser?.vote?.voteValue;

    return {
      ...user,
      hasVoted,
      voteValue,
    };
  });

  const totalUsers = seatedUsers.length;
  // Radius for positioning seats. Table is roughly 80% of 600px container width?
  // Let's estimate a good distance. Container height 600px. Table height 60% = 360px.
  // Radius should be around 200px horizontal, 150px vertical?
  // For simplicity, let's use a fixed distance for now, or maybe an oval calculation.
  // Let's try a simple circle first, or an ellipse.

  return (
    <TableContainer>
      <Table>
        <CenterContent>
          {isShowVotes ? (
            <>
              <div>
                {isNumericSystem
                  ? t('pokerRoom.average')
                  : t('pokerRoom.mostCommon')}
              </div>
              <AverageValue>{displayValue}</AverageValue>
            </>
          ) : (
            <div style={{ opacity: 0.7 }}>{t('pokerRoom.waitingForVote')}</div>
          )}
        </CenterContent>
      </Table>

      {seatedUsers.map((user, index) => {
        // Calculate position
        const angle = (index / totalUsers) * 360;
        // Convert angle to radians for trig functions
        const angleRad = (angle * Math.PI) / 180;

        // Ellipse parametric equation
        // x = a * cos(t)
        // y = b * sin(t)
        // We need to adjust because our Seat component uses rotation and translation which is for circles.
        // To do an ellipse with the current styled-component approach (rotate -> translate -> rotate back) is tricky because the distance varies.
        // Instead, let's calculate top/left percentages or pixels directly.

        // Let's override the Seat component style for direct positioning if we want an ellipse,
        // OR just use the circle approach with the styled component I wrote.
        // The styled component uses `transform: rotate... translate...`. This creates a circle.
        // To make it look like they are sitting at the oval table, we might need a different approach or just accept a circle layout around an oval table (might look okay).
        // Let's try to pass a variable distance?
        // For an ellipse, distance from center r = ab / sqrt((b*cos(theta))^2 + (a*sin(theta))^2)

        // Responsive radii based on viewport
        const baseA = Math.min(window.innerWidth * 0.25, 260); // Horizontal radius
        const baseB = Math.min(window.innerHeight * 0.2, 170); // Vertical radius
        const distance =
          (baseA * baseB) /
          Math.sqrt(
            Math.pow(baseB * Math.cos(angleRad), 2) +
              Math.pow(baseA * Math.sin(angleRad), 2),
          );

        return (
          <Seat key={user.uid} $angle={angle} $distance={distance}>
            <div style={{ position: 'relative' }}>
              <Avatar {...user} />
            </div>
            <PlayerName>{user.displayName}</PlayerName>

            {user.hasVoted && !isShowVotes && <CardBack />}

            {user.hasVoted && isShowVotes && (
              <VoteValue>{user.voteValue}</VoteValue>
            )}
          </Seat>
        );
      })}
    </TableContainer>
  );
};

export default PokerTable;
