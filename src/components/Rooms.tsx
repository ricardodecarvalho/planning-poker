import { useEffect } from "react";
import { auth, firestore } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Share from "./Share";
import DeleteRoom from "./DeleteRoom";
import styled from "styled-components";
import useRoom from "../hooks/useRoom";
import LoadingSpinner from "./LoadingSpinner";
import { useIsMobile } from "../hooks/useIsMobile";
import useThemeContext from "../context/useThemeContext";

const CreateRoomButton = styled.button`
  width: 100%;

  @media (min-width: 768px) {
    max-width: 350px;
`;

const Rooms = () => {
  const isMobile = useIsMobile();

  const userId = auth?.currentUser?.uid;

  const navigate = useNavigate();

  const { theme } = useThemeContext();

  const { getRoomsByUser, rooms, setRooms, loading } = useRoom();

  useEffect(() => {
    if (!userId) return;

    getRoomsByUser(userId);
  }, [getRoomsByUser, userId]);

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

    const roomRef = await addDoc(collection(firestore, "rooms"), roomData);

    navigate(`/room/${roomRef.id}`);
  };

  const handleDeleteRoom = async (roomId: string) => {
    setRooms((prevRooms) => {
      return prevRooms.filter((room) => room.id !== roomId);
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h2>Recent Rooms</h2>
        </div>
        <div className="col-md-6 text-end">
          <CreateRoomButton
            onClick={createRoom}
            className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-lg`}
          >
            Create a Room
          </CreateRoomButton>
        </div>
      </div>

      <div className="mt-3 d-flex flex-column align-items-center justify-content-center gap-3"></div>

      {loading && <LoadingSpinner />}

      {!loading && rooms && rooms?.length === 0 && (
        <div className="alert alert-primary" role="alert">
          Create your first room.
        </div>
      )}

      {!loading && !isMobile && rooms && rooms?.length > 0 && (
        <div className="table-responsive mt-3">
          <table className="table table-hover table-sm align-middle">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Participants</th>
                <th>Created At</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {rooms?.map((room) => (
                <tr key={room.id}>
                  <td>
                    <Link to={`/room/${room.id}`} title="Enter room">
                      {room.id}
                    </Link>
                  </td>
                  <td>
                    {room.participants.length}
                  </td>
                  <td>
                    {new Date(room.createdAt).toLocaleDateString(undefined, {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Share roomId={room.id} message="" />
                      <DeleteRoom
                        roomId={room.id}
                        onDelete={() => handleDeleteRoom(room.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && isMobile && rooms && rooms?.length > 0 && (
        <>
          {rooms.map((room) => (
            <div key={room.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">
                  Created At:{" "}
                  {new Date(room.createdAt).toLocaleDateString(undefined, {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h5>

                <h6 className="card-subtitle mb-2 text-body-secondary">
                  Room ID:{" "}
                  <Link to={`/room/${room.id}`} title="Enter room">
                    {room.id}
                  </Link>
                </h6>
                <p>Participants: {room.participants.length}</p>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <Link
                    to={`/room/${room.id}`}
                    className="btn btn-secondary"
                    title="Enter room"
                  >
                    Enter room
                  </Link>
                  <Share roomId={room.id} message="" label="Copy" />
                  <DeleteRoom
                    roomId={room.id}
                    onDelete={() => handleDeleteRoom(room.id)}
                    label="Delete"
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Rooms;
