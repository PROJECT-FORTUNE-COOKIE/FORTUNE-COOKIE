import { db } from './firestoreAuth';
import { Facebook } from 'expo';
import { fbAppId } from '../../secret';
const firebase = require('firebase');
// Required for side-effects
const firestore = require('firebase/firestore');
//---------------------- ACTION TYPES -----------------------

const GOT_USER = 'GOT_USER';
const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
const GOT_ALL_USERS = 'GOT_ALL_USERS';
const GET_MATCHES = 'GET_MATCHES';
const GET_MESSAGES_FOR_SELETED_MATCH = 'GET_MESSAGES_FOR_SELETED_MATCH';
const GET_MESSAGES_FROM_SELETED_MATCH = 'GET_MESSAGES_FROM_SELETED_MATCH';
const SET_SELECTED_MATCH_ON_STATE = 'SET_SELECTED_MATCH_ON_STATE';
const ADD_MATCH_TO_PENDING = 'ADD_MATCH_TO_PENDING';
const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const CHANGE_ICON = 'CHANGE_ICON';
const ADD_MATCH_TO_ACCEPTED = 'ADD_MATCH_TO_ACCEPTED';
const ADD_USER_TO_STATE = 'ADD_USER_TO_STATE';
const GET_ACCEPTED_MATCHES = 'GET_ACCEPTED_MATCHES';
const FETCH_DEPOSIT = 'FETCH DEPOSIT';
const UPDATE_DEPOSIT = 'UPDATE_DEPOSIT';
const UPDATE_USER_LOCATION = 'UPDATE_USER_LOCATION';
const FETCH_LOCATION = 'FETCH_LOCATION'

//---------------------- ACTION CREATORS -----------------------

const gotUser = user => ({ type: GOT_USER, user });
const fetchingCurrentUser = () => ({
  type: FETCH_CURRENT_USER,
});
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

const changeIcon = user => ({
  type: CHANGE_ICON,
  user,
});

const fetchDeposit = deposit => ({
  type: FETCH_DEPOSIT,
  deposit,
});

const updateDeposit = deposit => {
  type: UPDATE_DEPOSIT, deposit;
};

const getAcceptedMatches = matchIds => ({
  type: GET_ACCEPTED_MATCHES,
  matchIds,
});
const addMatchToAccepted = content => ({
  type: ADD_MATCH_TO_ACCEPTED,
  content,
});

const fetchLocation = location => ({
  type: FETCH_LOCATION,
  location
})
// const updateUserLocation = locale => ({
//   type: UPDATE_USER_LOCATION,
//   locale,
// });

//---------------------- THUNK CREATOR -----------------------

export const fbMe = () => {
  return async dispatch => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        fbAppId,
        { permissions: ['public_profile'] }
      );
      if (type === 'success') {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        let data = await response.json();
        const docRef = db.collection('Users').doc(data.id);

        docRef.get().then(function(doc) {
          if (!doc.exists) {
            db.collection('Users')
              .doc(data.id)
              .set({
                id: data.id,
                name: data.name,
                icon: 'https://data.whicdn.com/images/106885273/large.jpg',
                deposit: 0,
              });
          }
        });
        let userObj = {};
        docRef.get().then(doc => {
          userObj = doc.data();
          dispatch(gotUser(userObj));
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export const fetchCurrentUser = () => {
  return dispatch => {
    dispatch(fetchingCurrentUser());
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

//add user to accepted
export const addUserToAcceptedMatches = (current, newMatch) => {
  return async dispatch => {
    try {
      const id = newMatch.userId;
      const matchId = newMatch.matchId;
      current = {
        ...current,
        acceptedMatches: [...current.acceptedMatches, matchId],
      };
      console.log('------------BACK END MATCH ID-------',
      matchId)


      let allUsers = await db.collection('Users').doc(id);
      let updated = await allUsers.update({
        acceptedMatches: firebase.firestore.FieldValue.arrayUnion(matchId)
        // acceptedMatches: current.acceptedMatches
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
        // console.log('Error getting documents', err);
      });
  };
};

export const getSelectedMatch = matchId => {
  return dispatch => {
    try {
      dispatch(settingSelectedMatchOnState({ id: matchId }));
    } catch (err) {
      // console.log(err);
    }
  };
};

export const fetchingMatchMessages = (userId, matchId) => {
  try {
  return dispatch => {
    let allMessages = db.collection('Messages');
    let query = allMessages
      .where('recipientId', '==', matchId)
      .where('user._id', '==', userId)
      .onSnapshot(snapShot => {
        let data = [];
        snapShot.forEach(doc => {
          data.push(doc.data());
        });
        dispatch(getAllMessagesForSelectedMatch(data));
      })
    }
  } catch(err) {
        console.log('##Error getting messages in reducer##', err);
      };
  };

export const fetchingUserMessages = (userId, matchId) => {
  try {
  return dispatch => {
    let allMessages = db.collection('Messages');
    let query = allMessages
      .where('recipientId', '==', userId)
      .where('user._id', '==', matchId)
      .onSnapshot(snapShot => {
        let data = [];
        snapShot.forEach(doc => {
          data.push(doc.data());
        });
        dispatch(getAllMessagesFromSelectedMatch(data));
      })
    }
  }catch(err) {
        console.log('##Error getting messages in reducer##', err);
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

    let newMessage = {
      _id: newMessageId,
      createdAt: message[0].createdAt.toISOString(),
      recipientId: matchId,
      text: message[0].text,
      user: {
        _id: userId,
        name: userName,
        avatar:
          'https://www.wikihow.com/images/thumb/6/65/Draw-a-Simple-Pig-Step-2.jpg/aid1169069-v4-728px-Draw-a-Simple-Pig-Step-2.jpg',
      },
    };
    docRef.get().then(function(doc) {
      if (!doc.exists) {
        allMessages.doc(newMessageId).set(newMessage);
        dispatch(addNewMessageToServer(newMessage));
      }
    });
  };
};

export const updateIcon = (user, newIcon) => {
  return async dispatch => {
    try {
      const docRef = db.collection('Users').doc(user.id);
      await docRef.update({
        icon: newIcon,
      });

      await docRef.get().then(doc => {
        userObj = doc.data();
        dispatch(changeIcon(userObj));
      });
    } catch (err) {
      console.error('error in update icon', err);
    }
  };
};

export const fetchingInititalDeposit = user => {
  return async dispatch => {
    const docRef = await db.collection('Users').doc(user.id);
    console.log('outside TRY *****DOC REF IN USER REDUCER:', docRef.deposit);
    try {
      const docRef = await db.collection('Users').doc(user.id);
      console.log('*****DOC REF IN USER REDUCER:', docRef.deposit);
      // if (!docRef.deposit) {
      //   const depositObj = {
      //     deposit: 0,
      //   };
      await docRef.update({ deposit: 0 });
      //   dispatch(fetchDeposit(depositObj.deposit));
      // } else {
      dispatch(fetchDeposit(docRef.deposit));
      // }
    } catch (err) {
      console.error(err);
    }
  };
};

export const updatingDeposit = (user, oldDeposit, newDeposit) => {
  return async dispatch => {
    try {
      const updatedDeposit = oldDeposit + newDeposit;
      const docRef = db.collection('Users').doc(user.id);
      await docRef.update({
        deposit: updatedDeposit,
      });
      dispatch(updateDeposit(updatedDeposit));
    } catch (err) {
      console.error('error in update deposit', err);
    }
  };
};

export const updateUserLocation = data => {
  try {
    return async dispatch => {

    let userId = data.userId.id;
    let latitude = data.lat;
    let longitude = data.long;

    let user = db.collection('Users').doc(userId)
    let query = await user.update({
        geolocation: new firebase.firestore.GeoPoint(latitude, longitude)
      })
      console.log('------------in the back end!----------')
        // dispatch(fetchLocation(userObj));
      }
      }
  catch(err){
    console.error(err)
        }
}

//---------------------- INITIAL STATE -----------------------
const initialState = {
  //current: {},
  matches: [],
  selectedMatch: {},
  messagesToMatch: [],
  messagesToUser: [],
  all: [],
  current: { name: '', id: '' },
  selectedMessages: [],
  newMatchData: { userId: '', matchId: '' },
  deposit: '',
};

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_USER:
      return {
        ...state,
        current: action.user,
      };
    case FETCH_CURRENT_USER:
      return state;
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
    case CHANGE_ICON:
      return {
        ...state,
        current: action.user,
      };
    case FETCH_DEPOSIT:
      return {
        ...state,
        deposit: action.deposit,
      };
    case UPDATE_DEPOSIT:
      return {
        ...state,
        deposit: action.deposit,
      };
    case ADD_MATCH_TO_ACCEPTED:
      return {
        ...state,
        newMatchData: action.content,
      };
      case FETCH_LOCATION:
      return {
        ...state,
        current: action.location
      }
    default:
      return state;
  }
}
