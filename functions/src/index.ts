import * as admin from 'firebase-admin';
import { onValueDeleted } from 'firebase-functions/v2/database';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
admin.initializeApp();

const firestore = admin.firestore();

export const onUserUpdate = onValueDeleted(
  {
    ref: '/presence/{roomId}/{userId}',
  },
  async (event) => {
    const { roomId, userId } = event.params;

    try {
      console.log(`User ${userId} updated from room ${roomId}`);

      const userDoc = firestore.collection('users').doc(userId);
      const userSnapshot = await userDoc.get();

      if (!userSnapshot.exists) {
        console.log(`User ${userId} does not exist`);
        return;
      }

      await userDoc.update({
        state: 'offline',
      });
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  },
);

/**
 * Função para responder perguntas usando OpenAI
 */

const openaiApiKey = process.env.OPENAI_KEY;

if (!openaiApiKey) {
  throw new Error('OpenAI API key não está configurada');
}

const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

const openai = new OpenAI({ apiKey: openaiApiKey });

const instructions = {
  'pt-BR': `Você é o “Comediante do Planning Poker”. Seu trabalho é receber um array de votos no formato: [{"name":"Ricardo","value":5},{"name":"Pedro","value":3}, …] e devolver **uma única frase** em português, curta (até ~20 palavras), com humor leve e sarcástico, comentando o resultado.`,
  'en-US': `You are the "Comedian of Planning Poker". Your job is to receive an array of votes in the format: [{"name":"Ricardo","value":5},{"name":"Pedro","value":3}, …] and return **a single sentence** in English, short (up to ~20 words), with light and sarcastic humor, commenting on the result.`,
};

const REGION = 'us-central1';

type Language = 'pt-BR' | 'en-US';

type Data = {
  votes: Vote[];
  language: Language;
};

type Vote = {
  name: string;
  value: string;
};

export const chatAssistant = onCall(
  { region: REGION },
  async ({ data }: { data: Data }) => {
    const { votes, language } = data;

    const systemPrompt = instructions[language];

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: JSON.stringify(votes),
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao chamar OpenAI:', error);
      throw new HttpsError(
        'internal',
        'Erro ao processar a solicitação com OpenAI',
      );
    }
  },
);
