import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig  = {
  // config
};

const firebaseApp = firebase.initializeApp(firebaseConfig );

export default firebaseApp.firestore();
