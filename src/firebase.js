import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0ICfCDziPGdycvPVbQvCqaXvkyOiZLlg",
  authDomain: "socialsurf-3d57c.firebaseapp.com",
  projectId: "socialsurf-3d57c",
  storageBucket: "socialsurf-3d57c.appspot.com",
  messagingSenderId: "937774423977",
  appId: "1:937774423977:web:713eedf818eeec02bbeeb8",
  measurementId: "G-QFT5K4LNX2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore(app);

export { auth, storage, db };
