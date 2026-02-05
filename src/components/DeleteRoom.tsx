import styled from 'styled-components';
import DeleteIcon from '../assets/images/trash.svg?react';
import useRoom from '../hooks/useRoom';
import { useModal } from './Modal';
import { useTranslation } from 'react-i18n-lite';

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

interface DeleteRoomProps {
  roomId: string;
  onDelete?: () => void;
  label?: string;
  btnSize?: string;
}

const DeleteRoom = ({ roomId, label, onDelete }: DeleteRoomProps) => {
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
    <>
      <Button
        data-bs-toggle="modal"
        onClick={() => handleDeleteRoom(roomId)}
        title={t('rooms.deleteRoom')}
      >
        {label && `${label} `}
        <DeleteIcon />
      </Button>
    </>
  );
};

export default DeleteRoom;
