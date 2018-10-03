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
const GET_MESSAGES_FROM_SELETED_MATCH = 'GET_MESSAGES_FROM_SELETED_MATCH';
const SET_SELECTED_MATCH_ON_STATE = 'SET_SELECTED_MATCH_ON_STATE';
const ADD_MATCH_TO_PENDING = 'ADD_MATCH_TO_PENDING';
const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';

//---------------------- ACTION CREATORS -----------------------

const gotUser = user => ({ type: GOT_USER, user });
const gotAllUsers = users => ({ type: GOT_ALL_USERS, users });
const getAllMatchesForUser = matches => ({ type: GET_MATCHES, matches });
const getAllMessagesForSelectedMatch = messages => ({
  type: GET_MESSAGES_FOR_SELETED_MATCH,
  messages,
});
const getAllMessagesFromSelectedMatch = messages => ({
  type: GET_MESSAGES_FROM_SELETED_MATCH,
  messages,
});

const settingSelectedMatchOnState = match => ({
  type: SET_SELECTED_MATCH_ON_STATE,
  match,
});

const addNewMessageToServer = message => ({
  type: ADD_NEW_MESSAGE,
  message,
});

const addUserToPending = (user, owner) => ({
  type: ADD_MATCH_TO_PENDING,
  user,
  owner,
});

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

export const fetchAllMatches = userId => {
  return dispatch => {
    let allUsers = db.collection('Users');
    let query = allUsers
      .where('acceptedMatches', 'array-contains', userId)
      .get()
      .then(snapShot => {
        let datas = [];
        snapShot.forEach(doc => {
          matchWithId = doc.data();
          matchWithId.id = doc.id;
          datas.push(matchWithId);
        });
        dispatch(getAllMatchesForUser(datas));
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  };
};

export const getSelectedMatch = matchId => {
  return dispatch => {
    try {
      dispatch(settingSelectedMatchOnState({ id: matchId }));
    } catch (err) {
      console.log(err);
    }
  };
};

export const fetchingMatchMessages = (userId, matchId) => {
  return dispatch => {
    let allMessages = db.collection('Messages');
    let query = allMessages
      .where('recipientId', '==', matchId)
      .where('user._id', '==', userId)
      .get()
      .then(snapShot => {
        let data = [];
        snapShot.forEach(doc => {
          data.push(doc.data());
        });
        dispatch(getAllMessagesForSelectedMatch(data));
      })
      .catch(err => {
        console.log('##Error getting messages in reducer##', err);
      });
  };
};

export const fetchingUserMessages = (userId, matchId) => {
  return dispatch => {
    let allMessages = db.collection('Messages');
    let query = allMessages
      .where('recipientId', '==', userId)
      .where('user._id', '==', matchId)
      .get()
      .then(snapShot => {
        let data = [];
        snapShot.forEach(doc => {
          data.push(doc.data());
        });
        dispatch(getAllMessagesFromSelectedMatch(data));
      })
      .catch(err => {
        console.log('##Error getting messages in reducer##', err);
      });
  };
};

export const addingNewMessageToServer = (
  message,
  userId,
  matchId,
  userName
) => {
  return dispatch => {
    let newMessageId = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 10; i++) {
      newMessageId += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
      //return newMessageId;
    }
    let allMessages = db.collection('Messages');
    const docRef = allMessages.doc(newMessageId);

    console.log('+++++++++_+++++++++MESSAGE:', message);

    docRef.get().then(function(doc) {
      if (!doc.exists) {
        allMessages.doc(newMessageId).set({
          _id: newMessageId,
          createdAt: message[0].createdAt,
          recipientId: matchId,
          text: message[0].text,
          user: {
            _id: userId,
            name: userName,
            avatar:
              'https://www.wikihow.com/images/thumb/6/65/Draw-a-Simple-Pig-Step-2.jpg/aid1169069-v4-728px-Draw-a-Simple-Pig-Step-2.jpg',
          },
        });
        dispatch(
          addNewMessageToServer({
            _id: newMessageId,
            createdAt: message[0].createdAt,
            recipientId: matchId,
            text: message[0].text,
            user: {
              _id: userId,
              name: userName,
              avatar:
                'https://www.wikihow.com/images/thumb/6/65/Draw-a-Simple-Pig-Step-2.jpg/aid1169069-v4-728px-Draw-a-Simple-Pig-Step-2.jpg',
            },
          })
        );
      }
    });
  };
};


//---------------------- INITIAL STATE -----------------------
const initialState = {
  current: { name: 'Siri McClean', id: '10156095729989412' },
  matches: [],
  selectedMatch: {},
  messagesToMatch: [],
  messagesToUser: [],
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
    case SET_SELECTED_MATCH_ON_STATE:
      return {
        ...state,
        selectedMatch: action.match,
      };
    case GET_MESSAGES_FOR_SELETED_MATCH:
      return {
        ...state,
        messagesToMatch: action.messages,
      };
    case GET_MESSAGES_FROM_SELETED_MATCH:
      return {
        ...state,
        messagesToUser: action.messages,
      };
    case ADD_NEW_MESSAGE:
      return {
        ...state,
        messagesToMatch: [...state.messagesToMatch, action.message],
      };
    default:
      return state;
  }
}
