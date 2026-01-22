
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuration with fallbacks to the provided keys
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBoozmBosTzAXt9wQKKnkNAvo6nCMTWzZU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "kajoogram-app.firebaseapp.com",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://kajoogram-app-default-rtdb.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "kajoogram-app",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "kajoogram-app.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "668946268098",
  appId: process.env.FIREBASE_APP_ID || "1:668946268098:web:eb0cc1d4dd41ae746ce05b",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-9V4411R7ZP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
