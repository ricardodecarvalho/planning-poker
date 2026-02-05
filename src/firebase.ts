import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Evita problemas de COOP em alguns ambientes
auth.config.stopNextCheck = true; 

export const firestore = getFirestore(app);
export const database = getDatabase(); // Realtime Database
export const storage = getStorage(app);

export let functions: Functions;

const REGION = 'us-central1';

if (import.meta.env.DEV) {
  functions = getFunctions(app);

  connectAuthEmulator(auth, 'http://127.0.0.1:5005');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectDatabaseEmulator(database, 'localhost', 9000);
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001);

  // Habilita o App Check Debug Token localmente
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
} else {
  functions = getFunctions(app, REGION);
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  ),
  isTokenAutoRefreshEnabled: true,
});
