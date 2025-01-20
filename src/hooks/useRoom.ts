import { doc, getDoc } from "firebase/firestore";
import { useCallback } from "react";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

interface CheckRoomProps {
  roomId?: string;
}

const useRoom = () => {
  const navigate = useNavigate();

  const checkRoom = useCallback(
    async ({ roomId }: CheckRoomProps) => {
      if (!roomId) return;

      const roomRef = doc(firestore, "rooms", roomId);

      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        navigate("/");
        return;
      }
    },
    [navigate]
  );

  return {
    checkRoom
  };
};

export default useRoom;
