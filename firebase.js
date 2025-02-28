// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcPmTtJiyM2rwbQe7nM0IfiDgKiYtulrA",
  authDomain: "sahaya-5186f.firebaseapp.com",
  projectId: "sahaya-5186f",
  storageBucket: "sahaya-5186f.firebasestorage.app",
  messagingSenderId: "935864818975",
  appId: "1:935864818975:web:e130458e90f592c58ee42a",
  measurementId: "G-D1B19JBT2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);