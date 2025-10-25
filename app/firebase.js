// app/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // Pastikan nilai-nilai ini diapit tanda kutip
    apiKey: "AIzaSyCQDsDgY89zq7KZdY-AzoOh9r9EDI5e0xY", 
    
    // 💡 INI SANGAT KRUSIAL untuk Autentikasi
    authDomain: "gloria-carrer.firebaseapp.com",
    
    projectId: "gloria-carrer",
    storageBucket: "gloria-carrer.firebasestorage.app",
    messagingSenderId: 60728723029, 
    appId: "1:60728723029:android:2915f76980e8ad6a57b6dc", 
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
// 💡 Pastikan getAuth(app) dipanggil dengan benar
const auth = getAuth(app); 
const db = getFirestore(app);

// Export modul
export { app, auth, db };
export default app;