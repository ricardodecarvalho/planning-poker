import DeleteIcon from "../assets/images/trash.svg";
import useRoom from "../hooks/useRoom";
import { useModal } from "./Modal";

interface DeleteRoomProps {
  roomId: string;
  onDelete?: () => void;
  label?: string;
}

const DeleteRoom = ({ roomId, label, onDelete }: DeleteRoomProps) => {
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
      <button
        className="btn btn-light"
        data-bs-toggle="modal"
        onClick={() => handleDeleteRoom(roomId)}
      >
        {label && `${label} `}
        <img src={DeleteIcon} alt="Delete icon" title="Delete room" />
      </button>
    </>
  );
};

export default DeleteRoom;
