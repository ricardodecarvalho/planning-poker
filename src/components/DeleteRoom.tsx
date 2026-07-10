import styled from 'styled-components';
import { Trash2 } from 'lucide-react';
import useRoom from '../hooks/useRoom';
import { useModal } from './Modal';
import { useTranslation } from 'react-i18n-lite';

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
    background: var(--danger-bg);
    color: var(--danger);
  }
`;

interface DeleteRoomProps {
  roomId: string;
  onDelete?: () => void;
}

const DeleteRoom = ({ roomId, onDelete }: DeleteRoomProps) => {
  const { showModal } = useModal();
  const { t } = useTranslation();
  const { deleteRoom } = useRoom();

  const handleConfirm = (roomId: string) => {
    deleteRoom({ roomId });
    onDelete?.();
  };

  const handleDeleteRoom = async (roomId: string) => {
    showModal({
      title: t('rooms.deleteRoom'),
      message: t('rooms.deleteRoomMessage'),
      onConfirm: () => handleConfirm(roomId),
      onConfirmButtonClass: 'btn-danger',
      onCloseButtonText: t('modal.cancel'),
      onConfirmButtonText: t('modal.confirm'),
    });
  };

  return (
    <IconButton
      onClick={() => handleDeleteRoom(roomId)}
      title={t('rooms.deleteRoom')}
    >
      <Trash2 size={17} />
    </IconButton>
  );
};

export default DeleteRoom;
