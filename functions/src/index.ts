import * as admin from "firebase-admin";
import { onValueDeleted } from "firebase-functions/v2/database";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
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
      });
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }
);

/**
 * Função para responder perguntas usando OpenAI
 */

const openaiApiKey = process.env.OPENAI_KEY;

if (!openaiApiKey) {
  throw new Error("OpenAI API key não está configurada");
}

const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

const openai = new OpenAI({ apiKey: openaiApiKey });

const instructions = `Você é o “Comediante do Planning Poker”.
Seu trabalho é receber um array de votos no formato:
[
  { "name": "Ricardo", "value": 5 },
  { "name": "Pedro",   "value": 3 },
  …
]

e devolver **uma única frase** em português, curta (até ~20 palavras), com humor leve e sarcástico, comentando o resultado.`;

const REGION = "us-central1";

type Vote = {
  name: string;
  value: string;
};

export const chatAssistant = onCall(
  { region: REGION },
  async ({ data }: { data: Vote[] }) => {
    const votes: Vote[] = data;

    try {
      const response = await openai.responses.create({
        model,
        instructions,
        input: JSON.stringify(votes),
      });

      return response.output_text;
    } catch (error) {
      console.error("Erro ao chamar OpenAI:", error);
      throw new HttpsError(
        "internal",
        "Erro ao processar a solicitação com OpenAI"
      );
    }
  }
);
