import {
  onDisconnect,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { database } from "../firebase";

const useUserConnection = () => {
  function enterRoom(roomId: string, userId: string) {
    const userStatusDatabaseRef = ref(database, `presence/${roomId}/${userId}`);

    set(userStatusDatabaseRef, {
      state: "online",
      last_changed: serverTimestamp(),
    });

    onDisconnect(userStatusDatabaseRef).remove();
  }

  return {
    enterRoom
  };
};

export default useUserConnection;
