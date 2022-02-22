import {getDatabase} from "firebase/database";
import {initializeApp} from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyB3_V4obMmp-1t4T5yF1mP4hipDpCOrGVE",
    authDomain: "ischolar-ae472.firebaseapp.com",
    databaseURL: "https://ischolar-ae472.firebaseio.com",
    projectId: "ischolar",
    storageBucket: "ischolar.appspot.com",
    messagingSenderId: "732226969363",
    appId: "1:732226969363:web:124050a7ce4c9a007444e6"
};
export var firebase = initializeApp(firebaseConfig);
export var database = getDatabase(firebase);
