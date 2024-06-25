// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "@firebase/auth";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0EvkzCzIH2UUFC9x_57EPqx6YRmYGPNI",
  authDomain: "carapp-c49a2.firebaseapp.com",
  projectId: "carapp-c49a2",
  storageBucket: "carapp-c49a2.appspot.com",
  messagingSenderId: "102489546288",
  appId: "1:102489546288:web:3225749efbb69454dc97f5"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and set up persistence
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Correctly export the app, auth, and firestore instances
export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB };
