// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // ✅ import auth

export const firebaseConfig = {
  apiKey: "AIzaSyC-FxJqisDdTqRIjsAvsrQZ5JA8c2ai4l0",
  authDomain: "ecommerce-6267b.firebaseapp.com",
  projectId: "ecommerce-6267b",
  storageBucket: "ecommerce-6267b.appspot.com",
  messagingSenderId: "265213722854",
  appId: "1:265213722854:web:985e6d578c6af5a3503b27",
  measurementId: "G-N3B7SJSSX5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ export auth
