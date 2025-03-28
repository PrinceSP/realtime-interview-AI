import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDg4iB_TOs7flC6VBybPLNuivJVdkgS_RQ",
  authDomain: "realtime-interview-28ac2.firebaseapp.com",
  projectId: "realtime-interview-28ac2",
  storageBucket: "realtime-interview-28ac2.firebasestorage.app",
  messagingSenderId: "94924276726",
  appId: "1:94924276726:web:a2b17382167d7adaadbdd7",
  measurementId: "G-3N7Y22WWK8"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)