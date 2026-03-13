import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVAQzvbpZG5LON8mY1cRQy_vCbYPespl4",
  authDomain: "house-sell-55342.firebaseapp.com",
  projectId: "house-sell-55342",
  storageBucket: "house-sell-55342.firebasestorage.app",
  messagingSenderId: "429723997944",
  appId: "1:429723997944:web:91a465057a30b6d73ecd0d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
