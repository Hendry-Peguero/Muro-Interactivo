// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8Mr-XwtzX_VxlYJ-BvWwMrWx6i7UWWN0",
  authDomain: "basefinal-97dd1.firebaseapp.com",
  projectId: "basefinal-97dd1",
  storageBucket: "basefinal-97dd1.appspot.com",
  messagingSenderId: "93291841794",
  appId: "1:93291841794:web:f6523ce24251884f2a1a1b"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;