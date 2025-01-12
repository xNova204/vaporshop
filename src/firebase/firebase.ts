// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration object from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDI33_yM-owmUQAAuDjJmYMA9E5YfZdR0g",
    authDomain: "vaporshop-73d02.firebaseapp.com",
    projectId: "vaporshop-73d02",
    storageBucket: "vaporshop-73d02.firebasestorage.app",
    messagingSenderId: "221757540564",
    appId: "1:221757540564:web:bd95089f4a6a080da11341",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);