import { onDisconnect, onValue, ref, set } from "firebase/database";
import { auth, database, firestore } from "../firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

const useUserConnection = () => {
  const monitorUserConnection = async (roomId: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    // Referência para o status de conexão do Firebase Realtime Database
    const userStatusDatabaseRef = ref(database, `/status/${userId}`);

    // Referência para o documento da sala no Firestore
    const roomRef = doc(firestore, `rooms/${roomId}`);

    // Verifica a conexão no Realtime Database
    const connectedRef = ref(database, ".info/connected");

    let isOnline = false; 

    // Ouvir o status de conexão
    onValue(connectedRef, async (snapshot) => {
      const isConnected = snapshot.val();

      if (isConnected && !isOnline) {
        // Usuário conectou
        isOnline = true;

        // Usuário está online, definir status como "online" no Realtime Database
        await set(userStatusDatabaseRef, { state: "online", roomId: roomId });

        onDisconnect(userStatusDatabaseRef)
          .set(() => ({
            state: "offline",
          }))
          .then(async () => {
            // Atualizar a lista de participantes da sala
            await updateDoc(roomRef, {
              participants: arrayRemove(userId),
            });
            console.log(
              `Participant ${userId} removed from room ${roomId} on disconnect`
            );
          });
      } else {
        console.log("User is disconnected or connection lost");
      }
    });
  };

  return {
    monitorUserConnection,
  };
};

export default useUserConnection;
