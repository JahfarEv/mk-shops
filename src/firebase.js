
import { initializeApp } from "firebase/app";
import { getAuth,  setPersistence,
  browserLocalPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAM8oPKKJ-dIKANGOzjpRSkvqoQfZevAM0",
  authDomain: "mk-fasion.firebaseapp.com",
  databaseURL: "https://mk-fasion-default-rtdb.firebaseio.com",
  projectId: "mk-fasion",
  storageBucket: "mk-fasion.firebasestorage.app",
  messagingSenderId: "9900303904",
  appId: "1:9900303904:web:09083a183ca3930651be45",
  measurementId: "G-H3P60Z7ER3"
};
const app = initializeApp(firebaseConfig);

// Auth & Database
export const auth = getAuth(app);
export const rtdb = getDatabase(app);

// 🔐 IMPORTANT: Persist login (Android + iOS + PWA)
setPersistence(auth, browserLocalPersistence);

// Secondary auth (for shop creation)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);