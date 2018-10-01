import { firebaseConfig } from '../../secret';
const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');
// const firebaseApp = require('firebase/app');
// require('firebase/auth');
firebase.initializeApp(firebaseConfig);

export var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export var fbProvider = new firebase.auth.FacebookAuthProvider();
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
  } else {
    console.log('error');
  }
});
