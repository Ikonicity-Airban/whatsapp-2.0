import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA8brsByD1MJIdTm83MWxt9vYL-WK49P80",
  authDomain: "wisdom-internet-services.firebaseapp.com",
  projectId: "wisdom-internet-services",
  storageBucket: "wisdom-internet-services.appspot.com",
  messagingSenderId: "932740119108",
  appId: "1:932740119108:web:db049a5ca3600839755a11"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
