import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKeGwAXxvC_39GbeVQUC09JRBA7eRLEVY",
  authDomain: "nestora-1c777.firebaseapp.com",
  projectId: "nestora-1c777",
  storageBucket: "nestora-1c777.firebasestorage.app",
  messagingSenderId: "248766091970",
  appId: "1:248766091970:web:738b941e4ebce3dc6fa15b"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;