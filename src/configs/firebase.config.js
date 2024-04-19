
import { initializeApp } from "firebase/app";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const firebase = require('firebase');
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyAGQWHdS-lTCXmu5Vz4UWsxaQcaYgLuDUM',
  authDomain: "blue-linx-api.firebaseapp.com",
  projectId: "blue-linx-api",
  storageBucket: "blue-linx-api.appspot.com",
  messagingSenderId: "1083879476864",
  appId: "1:1083879476864:web:d984d750434ea680a12065",
  measurementId: "G-DJK1RGZ7BS"
};

  // Initialize Firebase
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const app = 
initializeApp(firebaseConfig);

const db = firebase.firestore();
const Users = db.collection("Users");

module.exports = Users;
// const analytics = getAnalytics(app);