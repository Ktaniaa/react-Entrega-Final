// Importa las funciones necesarias desde Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCreJE65UPg_B3yGjg29Vq8gk3eJfg9fiA",
    authDomain: "proyecto-final-react-a6827.firebaseapp.com",
    databaseURL: "https://proyecto-final-react-a6827-default-rtdb.firebaseio.com",
    projectId: "proyecto-final-react-a6827",
    storageBucket: "proyecto-final-react-a6827.appspot.com",
    messagingSenderId: "330558463345",
    appId: "1:330558463345:web:865014254abc66ed566ad0",
    measurementId: "G-RRCKW3SR8Q"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Exporta `db` para poder usarlo en otros archivos
export { db };
