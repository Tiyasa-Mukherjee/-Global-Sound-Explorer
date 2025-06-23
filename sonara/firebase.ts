import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8QsNEtCzz1KdGlsCUtP0hFUoJj1DkmDA",
  authDomain: "sonara-b3506.firebaseapp.com",
  projectId: "sonara-b3506",
  storageBucket: "sonara-b3506.firebasestorage.app",
  messagingSenderId: "445714983087",
  appId: "1:445714983087:web:ff81e9c029cf6575440c5a",
  measurementId: "G-JM7T549SGE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
