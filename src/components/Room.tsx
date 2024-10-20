import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CreateRoomButton = styled.button`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 350px;
`;

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
    <div className="container">
      <div className="mt-3 d-flex flex-column align-items-center justify-content-center gap-3">
        <CreateRoomButton onClick={createRoom} className="btn btn-dark btn-lg">
          Create a Room
        </CreateRoomButton>
      </div>
    </div>
  );
};

export default Room;
