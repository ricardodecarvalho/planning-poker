import styled from "styled-components";
import DeleteIcon from "../assets/images/trash.svg?react";
import useRoom from "../hooks/useRoom";
import { useModal } from "./Modal";

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

const DeleteRoom = ({
  roomId,
  label,
  onDelete
}: DeleteRoomProps) => {
  const { showModal } = useModal();

  const { deleteRoom } = useRoom();

  const handleConfirm = (roomId: string) => {
    deleteRoom({ roomId });
    onDelete?.();
  };

  const handleDeleteRoom = async (roomId: string) => {
    showModal({
      title: "Delete Room",
      message: "Are you sure you want to delete this room?",
      onConfirm: () => handleConfirm(roomId),
      onConfirmButtonClass: "btn-danger",
      onCloseButtonText: "Cancel",
    });
  };

  return (
    <>
      <Button data-bs-toggle="modal" onClick={() => handleDeleteRoom(roomId)} title="Delete room">
        {label && `${label} `}
        <DeleteIcon />
      </Button>
    </>
  );
};

export default DeleteRoom;
