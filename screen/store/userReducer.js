import { firebaseConfig } from '../../secret';
const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

//---------------------- ACTION TYPES -----------------------

const GOT_ALL_USERS = 'GOT_ALL_USERS';

//---------------------- ACTION CREATORS -----------------------

const gotAllUsers = users => ({ type: GOT_ALL_USERS, users });

//---------------------- INITIAL STATE -----------------------
const initialState = {
  current: {},
  all: []
};

//---------------------- THUNK CREATOR -----------------------

export const fetchAllUsers = () => {
  return dispatch => {
    try {
      db.collection('Users')
        .get()
        .then(querySnapshot => {
          let datas = [];
          querySnapshot.forEach(doc => {
            datas.push(doc.data());
          });
          dispatch(gotAllUsers(datas));
        });
    } catch (err) {
      console.error(err);
    }
  };
};

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_ALL_USERS:
      return {
        ...state,
        all: action.users
      };
    default:
      return state;
  }
}
