// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgZCBJyOTFNcOAqJjlFqmbiAtcNURWCwk",
    authDomain: "cabinet-faten.firebaseapp.com",
    projectId: "cabinet-faten",
    storageBucket: "cabinet-faten.firebasestorage.app",
    messagingSenderId: "418656104314",
    appId: "1:418656104314:web:2b22965f10ce1659dbf0c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;