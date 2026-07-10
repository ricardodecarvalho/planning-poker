import { useEffect, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18n-lite';
import { Check, Clock, Layers, Link2, Plus, Users } from 'lucide-react';

import { auth, firestore } from '../firebase';
import useRoom from '../hooks/useRoom';
import LoadingSpinner from './LoadingSpinner';
import DeleteRoom from './DeleteRoom';
import Button from './ui/Button';

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px clamp(16px, 4vw, 28px) 96px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 26px;

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(26px, 3vw, 34px);
    letter-spacing: -0.02em;
  }
  p {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-size: 15px;
  }
`;

const EmptyState = styled.div`
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  padding: 56px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;

  .badge {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    background: var(--success-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }
  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 19px;
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14.5px;
    max-width: 38ch;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
`;

const RoomCard = styled.div`
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }
  h3 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 17px;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .when {
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
    font-size: 12.5px;
    font-family: var(--font-mono);
  }
  .id {
    flex: none;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    background: var(--surface-sunken);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-full);
    padding: 4px 9px;
  }
  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }
  .count {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text-secondary);
    font-size: 13px;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const IconButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-colors);

  &:hover {
    background: var(--fill-hover);
    color: var(--text-primary);
  }
  &.copied {
    color: var(--success);
  }
`;

const EnterButton = styled.button`
  height: 34px;
  padding: 0 14px;
  margin-left: 4px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--brand-primary);
  color: var(--brand-on-primary);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition-colors);

  &:hover {
    background: var(--brand-primary-hover);
  }
`;

interface CopyLinkButtonProps {
  roomId: string;
  title: string;
}

const CopyLinkButton = ({ roomId, title }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/room/${roomId}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <IconButton
      className={copied ? 'copied' : ''}
      onClick={copy}
      title={title}
    >
      {copied ? <Check size={17} /> : <Link2 size={17} />}
    </IconButton>
  );
};

const Rooms = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const userId = auth?.currentUser?.uid;

  const { getRoomsByUser, rooms, setRooms, loading } = useRoom();

  useEffect(() => {
    if (!userId) return;
    getRoomsByUser(userId);
  }, [getRoomsByUser, userId]);

  const createRoom = async () => {
    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }

    const roomData = {
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid,
      showVotes: false,
      participants: [auth.currentUser.uid],
    };

    const roomRef = await addDoc(collection(firestore, 'rooms'), roomData);
    navigate(`/room/${roomRef.id}`);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(language, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const isEmpty = !loading && rooms && rooms.length === 0;
  const hasRooms = !loading && rooms && rooms.length > 0;

  return (
    <Content>
      <Toolbar>
        <div>
          <h1>{t('rooms.recentRooms')}</h1>
          <p>{t('rooms.recentRoomsSubtitle')}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          iconLeft={<Plus size={18} />}
          onClick={createRoom}
          title={t('rooms.createRoom')}
        >
          {t('rooms.createRoom')}
        </Button>
      </Toolbar>

      {loading && <LoadingSpinner />}

      {isEmpty && (
        <EmptyState>
          <div className="badge">
            <Layers size={30} color="var(--brand-primary)" />
          </div>
          <h3>{t('rooms.emptyTitle')}</h3>
          <p>{t('rooms.emptyDescription')}</p>
          <div style={{ marginTop: 14 }}>
            <Button
              variant="primary"
              iconLeft={<Plus size={18} />}
              onClick={createRoom}
            >
              {t('rooms.createFirstRoom')}
            </Button>
          </div>
        </EmptyState>
      )}

      {hasRooms && (
        <Grid>
          {rooms.map((room) => (
            <RoomCard key={room.id}>
              <div className="top">
                <div style={{ minWidth: 0 }}>
                  <h3>{room.name?.trim() || t('rooms.untitledRoom')}</h3>
                  <div className="when">
                    <Clock size={13} />
                    <span>{formatDate(room.createdAt)}</span>
                  </div>
                </div>
                <span className="id">{room.id.slice(0, 6)}</span>
              </div>
              <div className="foot">
                <div className="count">
                  <Users size={15} />
                  <span>
                    {room.participants.length} {t('rooms.participants')}
                  </span>
                </div>
                <div className="actions">
                  <CopyLinkButton
                    roomId={room.id}
                    title={t('rooms.copyRoomUrl')}
                  />
                  <DeleteRoom
                    roomId={room.id}
                    onDelete={() => handleDeleteRoom(room.id)}
                  />
                  <EnterButton
                    onClick={() => navigate(`/room/${room.id}`)}
                    title={t('rooms.enterRoom')}
                  >
                    {t('rooms.enter')}
                  </EnterButton>
                </div>
              </div>
            </RoomCard>
          ))}
        </Grid>
      )}
    </Content>
  );
};

export default Rooms;
