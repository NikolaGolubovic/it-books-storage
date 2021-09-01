import firebase from "firebase";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyBcAqLBcEMBEQ46ekuMWMHIfU5ZWzpTrJY",
  authDomain: "auth-production-d23b4.firebaseapp.com",
  databaseURL: "https://auth-production-d23b4.firebaseio.com",
  projectId: "auth-production-d23b4",
  storageBucket: "auth-production-d23b4.appspot.com",
  messagingSenderId: "567473840342",
  appId: "1:567473840342:web:c2fa9094d2d8de1688e977",
});

export const auth = app.auth();
export const db = app.firestore();
export default app;
