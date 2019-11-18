import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig  = {
  apiKey: "AIzaSyBcXtYjKuidN-m9Ga_sOCH13LTyBPeBY1c",
  authDomain: "hitit-3753e.firebaseapp.com",
  databaseURL: "https://hitit-3753e.firebaseio.com",
  projectId: "hitit-3753e",
  storageBucket: "hitit-3753e.appspot.com",
  messagingSenderId: "165635458969",
  appId: "1:165635458969:web:0311ee72bd56854aee7508"
};

const firebaseApp = firebase.initializeApp(firebaseConfig );

export default firebaseApp.firestore();
