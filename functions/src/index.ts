import * as admin from "firebase-admin";
import { onValueDeleted } from "firebase-functions/v2/database";

admin.initializeApp();

const firestore = admin.firestore();

export const onUserUpdate = onValueDeleted(
  {
    ref: "/presence/{roomId}/{userId}",
  },
  async (event) => {
    const { roomId, userId } = event.params;

    try {
      console.log(`User ${userId} updated from room ${roomId}`);

      const userDoc = firestore.collection("users").doc(userId);
      const userSnapshot = await userDoc.get();

      if (!userSnapshot.exists) {
        console.log(`User ${userId} does not exist`);
        return;
      }

      await userDoc.update({
        state: "offline",
      })

    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
);
