import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

interface CheckRoomProps {
  roomId?: string;
}

interface Room {
  createdAt: string;
  createdBy: string;
  id: string;
  participants: string[];
  showVotes: boolean;
}

const useRoom = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentRoomOwner, setCurrentRoomOwner] = useState<string>();

  const checkRoom = useCallback(
    async ({ roomId }: CheckRoomProps) => {
      if (!roomId) return;

      const roomRef = doc(firestore, "rooms", roomId);

      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        navigate("/");
        return;
      }

      const data = roomSnapshot.data();
      setCurrentRoomOwner(data.createdBy);
    },
    [navigate]
  );

  const deleteRoom = useCallback(async ({ roomId }: CheckRoomProps) => {
    if (!roomId) return;
    const roomRef = doc(firestore, "rooms", roomId);
    await deleteDoc(roomRef);
  }, []);

  const getRoomsByUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const roomsRef = collection(firestore, "rooms");
      const q = query(
        roomsRef,
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const rooms = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData & Omit<Room, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });
      setRooms(rooms);
      setLoading(false);
    } catch (error) {
      console.error("Error getting rooms", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkRoom,
    deleteRoom,
    getRoomsByUser,
    rooms,
    setRooms,
    loading,
    currentRoomOwner
  };
};

export default useRoom;
