import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { onValueDeleted } from "firebase-functions/v2/database";

// Inicialize o Firebase Admin SDK
admin.initializeApp();

const firestore = admin.firestore();

export const onUserDisconnect = onValueDeleted(
  {
    ref: "/presence/{roomId}/{userId}", // Caminho monitorado no Realtime Database
  },
  async (event) => {
    const { roomId, userId } = event.params;

    try {
      console.log(`User ${userId} disconnected from room ${roomId}`);

      // Obtenha o documento da sala no Firestore
      const roomDoc = firestore.collection("rooms").doc(roomId);
      const roomSnapshot = await roomDoc.get();

      if (!roomSnapshot.exists) {
        console.log(`Room ${roomId} does not exist`);
        return;
      }

      // Remova o usuário do array de participantes
      await roomDoc.update({
        participants: FieldValue.arrayRemove(userId),
      });

      // remove user vote
      const voteRef = firestore.collection(`rooms/${roomId}/votes`).doc(userId);
      await voteRef.delete();

      console.log(`User ${userId} removed from room ${roomId}`);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
);
