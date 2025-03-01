// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcPmTtJiyM2rwbQe7nM0IfiDgKiYtulrA",
  authDomain: "sahaya-5186f.firebaseapp.com",
  projectId: "sahaya-5186f",
  storageBucket: "sahaya-5186f.appspot.com",
  messagingSenderId: "935864818975",
  appId: "1:935864818975:web:e130458e90f592c58ee42a",
  measurementId: "G-D1B19JBT2Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { database, storage, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };