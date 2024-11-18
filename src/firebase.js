// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKeM_31AewScQCyyhgFvSmYeTFLn2qLUI",
  authDomain: "busquidy-26267.firebaseapp.com",
  projectId: "busquidy-26267",
  storageBucket: "busquidy-26267.firebasestorage.app",
  messagingSenderId: "710245773626",
  appId: "1:710245773626:web:8742159f5a6639526a2003",
  measurementId: "G-9V9S3M79T0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);