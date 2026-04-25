import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqQUi-K8uRE0RrgMwjHmzBxGnVey46Ilk",
  authDomain: "iota-backend-sa.firebaseapp.com",
  projectId: "iota-backend-sa",
  storageBucket: "iota-backend-sa.firebasestorage.app",
  messagingSenderId: "925013735036",
  appId: "1:925013735036:web:f23fd1c2aa5996ee99bbf9",
  measurementId: "G-GD6Z8L0WCZ"
};

// Initialize Firebase safely in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
