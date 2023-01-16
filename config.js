import firebase from "firebase/app";
//require("@firebase/firestore");
import 'firebase/auth'
import "firebase/firestore"
 
const firebaseConfig = {
    apiKey: "AIzaSyD0W-A4cyJmzpQfXIJWJ0kCi5z-DRnQc_4",
    authDomain: "livro-caa94.firebaseapp.com",
    projectId: "livro-caa94",
    storageBucket: "livro-caa94.appspot.com",
    messagingSenderId: "1067702947531",
    appId: "1:1067702947531:web:ea374fb1481a235cb9554e"
  };
 
firebase.initializeApp(firebaseConfig);
 
export default firebase.firestore();
