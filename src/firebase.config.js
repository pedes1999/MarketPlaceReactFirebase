// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVpksBKvffBH3OJUOJe-z2ZymIPwqEUVs",
  authDomain: "house-marketplace-965a9.firebaseapp.com",
  projectId: "house-marketplace-965a9",
  storageBucket: "house-marketplace-965a9.appspot.com",
  messagingSenderId: "537960185263",
  appId: "1:537960185263:web:b5dacad1d5c8296b83435a",
  measurementId: "G-9B8C46YDS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()