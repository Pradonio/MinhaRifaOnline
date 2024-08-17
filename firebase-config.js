// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu9XKdaOTjFyQLm7ZyCaOuShNtsH8xNco",
  authDomain: "rifafinal-cbc64.firebaseapp.com",
  projectId: "rifafinal-cbc64",
  storageBucket: "rifafinal-cbc64.appspot.com",
  messagingSenderId: "333309588498",
  appId: "1:333309588498:web:4406d24e19d7e1e0aa14cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }; // Exporta app e db para uso em outros módulos
