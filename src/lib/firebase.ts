// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "orderflow-lite-cp5g0",
  "appId": "1:1055443221205:web:4427e3496f3c73f8e8405c",
  "storageBucket": "orderflow-lite-cp5g0.firebasestorage.app",
  "apiKey": "AIzaSyBlSedRkFlcO7UGe18maEMgeaOWGewZSv4",
  "authDomain": "orderflow-lite-cp5g0.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1055443221205"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
