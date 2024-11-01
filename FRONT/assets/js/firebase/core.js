// Importação dos SDKs necessários do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiWrmYubcF77BGt7sGFmIGy4qjF-VdNRg",
  authDomain: "massuh-imoveis.firebaseapp.com",
  projectId: "massuh-imoveis",
  storageBucket: "massuh-imoveis.appspot.com",
  messagingSenderId: "417540600761",
  appId: "1:417540600761:web:b1d5b8f0f40e04a9cfbc68",
  measurementId: "G-514YQSN2TP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
