import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const createRoom = async () => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    const userId = auth.currentUser.uid;

    const roomData = {
      createdAt: new Date().toISOString(),
      createdBy: userId,
      showVotes: false,
      participants: [userId],
    };

    console.log("Creating room with data: ", roomData);

    const roomRef = await addDoc(collection(firestore, "rooms"), roomData);

    console.log("Room created with ID: ", roomRef.id);

    navigate(`/room/${roomRef.id}`);
  };
  return (
    <div>
      <h2>Room</h2>
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default Room;
