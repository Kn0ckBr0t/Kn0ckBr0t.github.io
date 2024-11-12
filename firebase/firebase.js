import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js'
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js'

const firebaseConfig = {
  apiKey: "AIzaSyBBEzqy88OLnj6rcIX2Igwd_vNpLwoNwm4",
  authDomain: "workwaybrasil.firebaseapp.com",
  projectId: "workwaybrasil",
  storageBucket: "workwaybrasil.firebasestorage.app",
  messagingSenderId: "70002311813",
  appId: "1:70002311813:web:2cca01406d999c3513dfec"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };