import { CSSProperties, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18n-lite';
import { Check, Eye, EyeOff, Link2, RotateCcw } from 'lucide-react';

import useRoom from '../../hooks/useRoom';
import useVotes from '../../hooks/useVotes';
import useParticipants, { Participant } from '../../hooks/useParticipants';
import { getUniqueDisplayNames, getVotingStatus } from '../../util';
import useUserConnection from '../../hooks/useUserConnection';
import { auth, firestore } from '../../firebase';
import Avatar from '../Avatar';
import Button from '../ui/Button';
import { useIsMobile } from '../../hooks/useIsMobile';
import * as S from './PokerRoom.styles';

const votingSystem: (number | string)[] = [
  0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕',
];

const seatStyle = (i: number, n: number): CSSProperties => {
  const ang = ((90 + i * (360 / n)) * Math.PI) / 180;
  const x = 50 + 44 * Math.cos(ang);
  const y = 50 + 43 * Math.sin(ang);
  return {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: 3,
  };
};

const stripeDesktop: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'repeating-linear-gradient(45deg, rgba(18,168,75,.24) 0 4px, transparent 4px 9px)',
};
const stripeMobile: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'repeating-linear-gradient(45deg, rgba(18,168,75,.22) 0 3px, transparent 3px 7px)',
};

interface Seat {
  key: string;
  name: string;
  state?: string;
  you: boolean;
  voteText: string;
  voted: boolean;
  hidden: boolean;
  shown: boolean;
}

const PokerRoom = () => {
  const { roomId } = useParams();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { checkRoom, currentRoomOwner } = useRoom();
  const { isShowVotes, votes, clearVotes, handleShowVotes, handleVote } =
    useVotes(roomId);
  const { participants, fetchUsersByParticipants } = useParticipants(roomId);

  const [users, setUsers] = useState<Participant[]>([]);
  const [copied, setCopied] = useState(false);

  const { enterRoom } = useUserConnection();
  const userId = auth.currentUser?.uid;

  // monitorar a presença do usuário
  useEffect(() => {
    if (!userId) return;

    const usersRef = collection(firestore, 'users');

    const unsubscribe = onSnapshot(usersRef, (docSnapshot) => {
      docSnapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const modifiedUser = change.doc.data();

          const userExists = users.map((user) =>
            user.uid === modifiedUser.uid
              ? (modifiedUser as Participant)
              : user,
          );

          setUsers(getUniqueDisplayNames(userExists));
        }
      });
    });

    const updateUser = async () => {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, { state: 'online' });
    };
    updateUser();

    return () => unsubscribe();
  }, [userId, users]);

  useEffect(() => {
    if (!roomId || !userId) return;
    enterRoom(roomId, userId);
  }, [enterRoom, roomId, userId]);

  useEffect(() => {
    if (!roomId) return;
    checkRoom({ roomId });
  }, [checkRoom, roomId]);

  useEffect(() => {
    if (participants.length === 0) return;

    fetchUsersByParticipants(participants, roomId).then((users) => {
      setUsers(getUniqueDisplayNames(users));
    });
  }, [fetchUsersByParticipants, participants, roomId]);

  const votingStatus = getVotingStatus(users, votes);
  const isRoomOwner = auth.currentUser?.uid === currentRoomOwner;

  const toggleReveal = () => handleShowVotes(!isShowVotes);
  const newRound = () => clearVotes(roomId);

  const copyLink = () => {
    if (!roomId) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/room/${roomId}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // ----- derived vote data -----
  const voteMap = new Map<string, number | string>(
    votes.map((v) => [v.userId, v.voteValue]),
  );
  const myVoteValue = userId ? voteMap.get(userId) : undefined;

  const seats: Seat[] = users.map((u) => {
    const raw = u.uid ? voteMap.get(u.uid) : undefined;
    const voted = raw !== undefined;
    return {
      key: u.uid || u.displayName || Math.random().toString(),
      name: u.displayName || '',
      state: u.state,
      you: !!userId && u.uid === userId,
      voteText: voted ? String(raw) : '',
      voted,
      hidden: voted && !isShowVotes,
      shown: voted && isShowVotes,
    };
  });

  const total = users.length;
  const votedCount = seats.filter((s) => s.voted).length;
  const votedFraction = `${votedCount}/${total}`;

  const numericVotes = votingStatus.hasVoted.filter(
    (u) => typeof u.vote.voteValue === 'number',
  );
  const hasNumeric = numericVotes.length > 0;
  const avgText = hasNumeric ? votingStatus.average.toFixed(2) : '—';
  const consensus =
    hasNumeric &&
    new Set(numericVotes.map((u) => u.vote.voteValue)).size === 1;
  const consensusText = hasNumeric
    ? consensus
      ? t('pokerRoom.consensus')
      : `${numericVotes.length} ${t('pokerRoom.validVotesSuffix')}`
    : t('pokerRoom.noNumericVotes');

  const distribution = Object.entries(votingStatus.votesGrouped)
    .map(([value, arr]) => ({ value, count: arr.length }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  // ----- seat card renderers -----
  const desktopSeatCard = (seat: Seat) => {
    if (seat.shown) {
      return (
        <div
          style={{
            width: 46,
            height: 64,
            borderRadius: 8,
            background: '#fff',
            border: '1px solid rgba(0,0,0,.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#151A18',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 24,
            boxShadow: '0 6px 14px rgba(0,0,0,.28)',
            animation: 'ppRise var(--duration-base) var(--ease-out)',
          }}
        >
          {seat.voteText}
        </div>
      );
    }
    if (seat.hidden) {
      return (
        <div
          style={{
            width: 46,
            height: 64,
            borderRadius: 8,
            background: '#0C100F',
            border: '2px solid var(--green-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,.3)',
          }}
        >
          <div style={stripeDesktop} />
          <span
            style={{
              position: 'relative',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--green-400)',
            }}
          >
            S
          </span>
        </div>
      );
    }
    return (
      <div
        style={{
          width: 46,
          height: 64,
          borderRadius: 8,
          border: '2px dashed rgba(255,255,255,.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,.55)',
          fontSize: 18,
        }}
      >
        ·
      </div>
    );
  };

  const mobileSeatCard = (seat: Seat) => {
    if (seat.shown) {
      return (
        <div
          style={{
            width: 34,
            height: 48,
            borderRadius: 6,
            background: 'var(--surface-base)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--text-primary)',
          }}
        >
          {seat.voteText}
        </div>
      );
    }
    if (seat.hidden) {
      return (
        <div
          style={{
            width: 34,
            height: 48,
            borderRadius: 6,
            background: '#0C100F',
            border: '1.5px solid var(--green-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={stripeMobile} />
          <span
            style={{
              position: 'relative',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 16,
              color: 'var(--green-400)',
            }}
          >
            S
          </span>
        </div>
      );
    }
    return (
      <div
        style={{
          width: 34,
          height: 48,
          borderRadius: 6,
          border: '2px dashed var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 15,
        }}
      >
        ·
      </div>
    );
  };

  return (
    <S.Content>
      {/* toolbar */}
      <S.Toolbar>
        <div style={{ minWidth: 0 }}>
          <h1>{roomId}</h1>
          <S.CopyButton onClick={copyLink} title={t('rooms.copyRoomUrl')}>
            {copied ? <Check size={15} /> : <Link2 size={15} />}
            <span>
              {copied ? t('pokerRoom.linkCopied') : t('pokerRoom.copyLink')}
            </span>
          </S.CopyButton>
        </div>
        {isRoomOwner && (
          <S.ToolbarActions>
            <Button
              variant="ghost"
              onClick={newRound}
              iconLeft={<RotateCcw size={17} />}
            >
              {t('pokerRoom.newRound')}
            </Button>
            <Button
              variant="primary"
              onClick={toggleReveal}
              iconLeft={
                isShowVotes ? <EyeOff size={17} /> : <Eye size={17} />
              }
            >
              {isShowVotes ? t('pokerRoom.hideVotes') : t('pokerRoom.showVotes')}
            </Button>
          </S.ToolbarActions>
        )}
      </S.Toolbar>

      {/* ---------- DESKTOP ---------- */}
      {!isMobile && (
        <S.TableStage>
          <S.TableWrap>
            <S.Felt>
              <S.CenterPot>
                {isShowVotes ? (
                  <S.PotRevealed>
                    <span className="label">{t('pokerRoom.average')}</span>
                    <span className="value">{avgText}</span>
                    <span className="sub">{consensusText}</span>
                  </S.PotRevealed>
                ) : (
                  <S.PotHidden>
                    <span className="value">{votedFraction}</span>
                    <span className="sub">
                      {t('pokerRoom.votedCount')}
                      <br />
                      {t('pokerRoom.revealHint')}
                    </span>
                  </S.PotHidden>
                )}
              </S.CenterPot>

              {seats.map((seat, i) => (
                <div key={seat.key} style={seatStyle(i, seats.length)}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    {desktopSeatCard(seat)}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 10px 3px 3px',
                        borderRadius: 'var(--radius-full)',
                        background: seat.you
                          ? 'rgba(18,168,75,.9)'
                          : 'rgba(0,0,0,.35)',
                      }}
                    >
                      <Avatar
                        displayName={seat.name}
                        state={seat.state}
                        size={30}
                      />
                      <S.SeatName>{seat.name}</S.SeatName>
                    </div>
                  </div>
                </div>
              ))}
            </S.Felt>
          </S.TableWrap>

          {/* distribution */}
          {isShowVotes && distribution.length > 0 && (
            <S.Distribution>
              <span className="caption">{t('pokerRoom.distribution')}</span>
              {distribution.map((d) => (
                <S.DistChip key={d.value}>
                  <span className="value">{d.value}</span>
                  <span className="count">{d.count}</span>
                </S.DistChip>
              ))}
            </S.Distribution>
          )}

          {/* hand */}
          <S.HandSection>
            <S.Eyebrow>{t('pokerRoom.yourHand')}</S.Eyebrow>
            <S.Hand className="pp-scroll">
              {votingSystem.map((value) => (
                <S.HandCard
                  key={String(value)}
                  $selected={value === myVoteValue && !isShowVotes}
                  disabled={isShowVotes}
                  onClick={() => handleVote(value)}
                >
                  <span className="corner tl">{value}</span>
                  {value}
                  <span className="corner br">{value}</span>
                </S.HandCard>
              ))}
            </S.Hand>
          </S.HandSection>
        </S.TableStage>
      )}

      {/* ---------- MOBILE ---------- */}
      {isMobile && (
        <S.MobileWrap>
          {/* participant strip */}
          <div>
            <S.StripHeader>
              <S.Eyebrow>{t('rooms.participants')}</S.Eyebrow>
              <span className="count">
                {votedFraction} {t('pokerRoom.votedCount')}
              </span>
            </S.StripHeader>
            <S.Strip className="pp-scroll">
              {seats.map((seat) => (
                <S.StripCard key={seat.key}>
                  {mobileSeatCard(seat)}
                  <Avatar
                    displayName={seat.name}
                    state={seat.state}
                    size={28}
                  />
                  <span className="name">{seat.name}</span>
                </S.StripCard>
              ))}
            </S.Strip>
          </div>

          {/* status card */}
          {isShowVotes ? (
            <S.StatusCard>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span className="avg-label">{t('pokerRoom.average')}</span>
                <span className="avg-value">{avgText}</span>
                <span className="avg-sub">{consensusText}</span>
              </div>
              {distribution.length > 0 && (
                <>
                  <div className="hr" />
                  <div className="bars">
                    {distribution.map((d) => (
                      <S.DistRow key={d.value}>
                        <span className="value">{d.value}</span>
                        <div className="track">
                          <div
                            className="fill"
                            style={{ width: `${(d.count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="count">{d.count}</span>
                      </S.DistRow>
                    ))}
                  </div>
                </>
              )}
            </S.StatusCard>
          ) : (
            <S.StatusWaiting>
              <span className="value">{votedFraction}</span>
              <span className="sub">
                {t('pokerRoom.votedCount')} — {t('pokerRoom.revealHintTeam')}
              </span>
            </S.StatusWaiting>
          )}

          {/* card grid */}
          <div>
            <S.Eyebrow style={{ display: 'block', marginBottom: 10 }}>
              {t('pokerRoom.yourVote')}
            </S.Eyebrow>
            <S.CardGrid>
              {votingSystem.map((value) => (
                <S.MobileCard
                  key={String(value)}
                  $selected={value === myVoteValue && !isShowVotes}
                  disabled={isShowVotes}
                  onClick={() => handleVote(value)}
                >
                  {value}
                </S.MobileCard>
              ))}
            </S.CardGrid>
          </div>
        </S.MobileWrap>
      )}
    </S.Content>
  );
};

export default PokerRoom;
