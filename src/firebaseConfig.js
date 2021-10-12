import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';




// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyCj2hgcB34XAvPKos-vuYMcYY5vJsjEC3I",
  authDomain: "hrnet-825ae.firebaseapp.com",
  projectId: "hrnet-825ae",
  storageBucket: "hrnet-825ae.appspot.com",
  messagingSenderId: "982864176588",
  appId: "1:982864176588:web:7f891562dbbeac43e66969"
};

// Initialize Firebase
firebase.initializeApp(config);
const db = firebase.firestore();

export default db ;