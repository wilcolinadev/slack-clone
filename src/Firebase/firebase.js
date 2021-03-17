import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyDLdTF84Icj4RqJemLAjqUShBgnd-DPP-w",
    authDomain: "react-slack-clone-b9ef4.firebaseapp.com",
    projectId: "react-slack-clone-b9ef4",
    storageBucket: "react-slack-clone-b9ef4.appspot.com",
    messagingSenderId: "315054062814",
    appId: "1:315054062814:web:1a09153f2f51b1ece2564f",
    measurementId: "G-PPZ4M3BT64"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;