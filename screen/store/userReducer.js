const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');
import { db } from './firestoreAuth';
import { Facebook } from 'expo';
import { fbAppId } from '../../secret';

//---------------------- ACTION TYPES -----------------------

const GOT_USER = 'GOT_USER';
const GOT_ALL_USERS = 'GOT_ALL_USERS';

//---------------------- ACTION CREATORS -----------------------

const gotUser = user => ({ type: GOT_USER, user });
const gotAllUsers = users => ({ type: GOT_ALL_USERS, users });

//---------------------- INITIAL STATE -----------------------
const initialState = {
  current: {},
  all: []
};

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
                name: data.name
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

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_USER:
      return {
        ...state,
        current: action.user
      };
    case GOT_ALL_USERS:
      return {
        ...state,
        all: action.users
      };
    default:
      return state;
  }
}
