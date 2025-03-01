import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js';
import { getStorage, ref as storageRef, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

// Your Firebase configuration and initialization code here
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