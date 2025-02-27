import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


/*const firebaseConfig = {
  apiKey: "AIzaSyBD6dvTxgAUymfFpuWQirMi2PvY-uYkXqA",
  authDomain: "edulink-4b013.firebaseapp.com",
  projectId: "edulink-4b013",
  storageBucket: "edulink-4b013.firebasestorage.app",
  messagingSenderId: "987278684191",
  appId: "1:987278684191:web:01fc174f0d41854ad7a52a",
  measurementId: "G-RVP1EW7DWT",
};*/


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, db };