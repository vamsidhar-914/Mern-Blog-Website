import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY || "mock_key",
  authDomain: "blog-50862.firebaseapp.com",
  projectId: "blog-50862",
  storageBucket: "blog-50862.appspot.com",
  messagingSenderId: "719071742010",
  appId: "1:719071742010:web:33e5c3e1e9b1b52c460d03",
  measurementId: "G-XF8EEQDBZD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
