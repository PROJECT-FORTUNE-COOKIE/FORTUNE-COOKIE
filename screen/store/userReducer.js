const firebase = require('firebase');

// Required for side-effects
require('firebase/firestore');
// firebase.initializeApp(firebaseConfig);
// var db = firebase.firestore();
// db.settings({
//   timestampsInSnapshots: true,
// });
import { db } from './firestoreAuth';
import { Facebook } from 'expo';
import { fbAppId } from '../../secret';

//---------------------- ACTION TYPES -----------------------

const GOT_USER = 'GOT_USER';
const GOT_ALL_USERS = 'GOT_ALL_USERS';
const GET_MATCHES = 'GET_MATCHES';
const GET_MESSAGES_FOR_SELETED_MATCH = 'GET_MESSAGES_FOR_SELETED_MATCH';
const ADD_MATCH_TO_PENDING = 'ADD_MATCH_TO_PENDING';

//---------------------- ACTION CREATORS -----------------------

const gotUser = user => ({ type: GOT_USER, user });
const gotAllUsers = users => ({ type: GOT_ALL_USERS, users });
const getAllMatchesForUser = matches => ({ type: GET_MATCHES, matches });
const getAllMessagesForSelectedMatch = messages => ({
  type: GET_MESSAGES_FOR_SELETED_MATCH,
  messages,
});

const addUserToPending = (user, owner) => ({
  type: ADD_MATCH_TO_PENDING,
  user,
  owner
})

//---------------------- THUNK CREATOR -----------------------

export const fbMe = () => {
  return async dispatch => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        fbAppId,
        { permissions: ['public_profile'] }
      );
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        let data = await response.json();
        //-----------check if user exists --------
        const docRef = db.collection('Users').doc(data.id);

        docRef.get().then(function(doc) {
          if (!doc.exists) {
            db.collection('Users')
              .doc(data.id)
              .set({
                name: data.name,
              });
          }
        });
        dispatch(gotUser(data));
      }
    } catch (err) {
      console.error(err);
    }
  };
};

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

// add user to accepted
// export const addUserToPendingMatches = (user, owner) => {
//   return async dispatch => {
//     db.collection('Users')
//     .get()

//   }
// }

// export const fetchAllMatches = userId => async dispatch => {
//   try {
//     const res = await db.collection('Users').where(doc.id === userId)
//   } catch(err) {
//     console.log(err)
//   }
// }

// export const fetchAllMatches = userId => {
//   return dispatch => {
//     try {
//       db.collection('Users')
//         .get()
//         .then(querySnapshot => {
//           // let data = null;
//           querySnapshot.filter(doc => {
//             //console.log(doc);
//             // if (
//             doc.id === userId;
//             //) {
//             //   console.log(doc);
//             //   data = doc.matches.accepted();
//             // }
//           });
//           console.log('filtereduser: ', filtereduser);
//           dispatch(getAllMatchesForUser(data));
//         });
//     } catch (err) {
//       console.error(err);
//     }
//   };
// };

//---------------------- INITIAL STATE -----------------------
const initialState = {
  current: {},
  matches: [],
  selectedMatch: {},
  selectedMessages: [],
  all: [],
};

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_USER:
      return {
        ...state,
        current: action.user,
      };
    case GOT_ALL_USERS:
      return {
        ...state,
        all: action.users,
      };
    case GET_MATCHES:
      return {
        ...state,
        matches: action.matches,
      };
    default:
      return state;
  }
}
