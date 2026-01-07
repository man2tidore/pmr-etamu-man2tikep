import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBwSs6aHzeZEkkplh-YSNatoysGSIVROpo",
    authDomain: "e-tamu-pmr-man2tikep.firebaseapp.com",
    projectId: "e-tamu-pmr-man2tikep",
    storageBucket: "e-tamu-pmr-man2tikep.firebasestorage.app",
    messagingSenderId: "880003916968",
    appId: "1:880003916968:web:7fe210cf793b1c8196ce9d",
    measurementId: "G-48NPXNCYFK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
