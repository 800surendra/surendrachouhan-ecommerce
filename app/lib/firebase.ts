// firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsi54MqDAm0OpCDc0FQuI3TMxAfdIqmJA",
  authDomain: "surendra-bookstore.firebaseapp.com",
  projectId: "surendra-bookstore",
  storageBucket: "surendra-bookstore.appspot.com", // ✅ FIXED
  messagingSenderId: "361711510609",
  appId: "1:361711510609:web:8e6a055e01146686f68470",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);