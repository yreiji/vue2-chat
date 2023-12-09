  // Import the functions you need from the SDKs you need
  import firebase from 'firebase'
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAudIVNGxiJM7LsIQ2qmtg0FJe-NSsBfdI",
    authDomain: "vue2-chat-9728d.firebaseapp.com",
    projectId: "vue2-chat-9728d",
    storageBucket: "vue2-chat-9728d.appspot.com",
    messagingSenderId: "1065836530893",
    appId: "1:1065836530893:web:f13f55ef3ba4ace038ad84"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


export default firebase;