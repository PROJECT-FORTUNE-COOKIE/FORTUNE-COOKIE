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
const GET_ACCEPTED_MATCHES = 'GET_ACCEPTED_MATCHES';
const FETCH_DEPOSIT = 'FETCH DEPOSIT';
const UPDATE_DEPOSIT = 'UPDATE_DEPOSIT';
const UPDATE_USER_LOCATION = 'UPDATE_USER_LOCATION';
const FETCH_LOCATION = 'FETCH_LOCATION';

const UPDATE_BLURB = 'UPDATE_BLURB';
const UPDATE_BIRTHDAY = 'UPDATE_BIRTHDAY';
const UPDATE_NEIGHBORHOOD = 'UPDATE_NEIGHBORHOOD';
const MAP_OTHER_INFO_TO_STATE = 'MAP_OTHER_INFO_TO_STATE';
const UPDATE_IDENTIFY_AS = 'UPDATE_IDENTIFY_AS';
const UPDATE_SEEKING = 'UPDATE_SEEKING';
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

const changeIcon = user => ({
  type: CHANGE_ICON,
  user,
});

const fetchDeposit = deposit => ({
  type: FETCH_DEPOSIT,
  deposit,
});

const updateDeposit = deposit => ({
  type: UPDATE_DEPOSIT,
  deposit,
});

const getAcceptedMatches = matchIds => ({
  type: GET_ACCEPTED_MATCHES,
  matchIds,
});
const addMatchToAccepted = content => ({
  type: ADD_MATCH_TO_ACCEPTED,
  content,
});

const updatingBlurb = blurb => ({
  type: UPDATE_BLURB,
  blurb,
});

const updatingBirthday = birthday => ({
  type: UPDATE_BIRTHDAY,
  birthday,
});

const updatingNeighborhood = neighborhood => ({
  type: UPDATE_NEIGHBORHOOD,
  neighborhood,
});

const mappingOtherInfoToState = (blurb, birthday, neighborhood) => ({
  type: MAP_OTHER_INFO_TO_STATE,
  blurb,
  birthday,
  neighborhood,
});

const updatingIdentifyAs = identifyAs => ({
  type: UPDATE_IDENTIFY_AS,
  identifyAs,
});
const updateSeeking = seeking => ({
  type: UPDATE_SEEKING,
  seeking,
});
const fetchLocation = location => ({
  type: FETCH_LOCATION,
  location,
});
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
                deposit: 5,
                acceptedMatches: [],
                pendingMatches: [],
                rejectedMatches: [],
                birthday: '',
                identifyAs: '',
                seeking: '',
              });
          }
        });
        let userObj = {};
        docRef.get().then(doc => {
          userObj = doc.data();
          dispatch(gotUser(data));
          dispatch(updateDeposit(data.deposit));
        });
      }
    } catch (err) {
      console.error(err);
    }
    fetchDeposit;
  };
};

export const fetchCurrentUser = () => {
  return dispatch => {
    dispatch(fetchingCurrentUser());
    dispatch(fetchDeposit(5));
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
      console.log('------------BACK END MATCH ID-------', matchId);

      let allUsers = await db.collection('Users').doc(id);
      let updated = await allUsers.update({
        acceptedMatches: firebase.firestore.FieldValue.arrayUnion(matchId),
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
        });
    };
  } catch (err) {
    console.log('##Error getting messages in reducer##', err);
  }
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
        });
    };
  } catch (err) {
    console.log('##Error getting messages in reducer##', err);
  }
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
    try {
      const docRef = await db.collection('Users').doc(user.id);
      await docRef.update({ deposit: 0 });
      dispatch(fetchDeposit(docRef.deposit));
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

export const changingBlurb = (blurb, userId) => {
  return async dispatch => {
    try {
      const docRef = db.collection('Users').doc(userId);
      await docRef.update({
        blurb,
      });
      dispatch(updatingBlurb(blurb));
    } catch (err) {
      console.error(err);
    }
  };
};

export const changingBirthday = (birthday, userId) => {
  return async dispatch => {
    try {
      const docRef = db.collection('Users').doc(userId);
      await docRef.update({
        birthday,
      });
      dispatch(updatingBirthday(birthday));
    } catch (err) {
      console.error(err);
    }
  };
};

export const changingNeighborhood = (neighborhood, userId) => {
  return async dispatch => {
    try {
      const docRef = db.collection('Users').doc(userId);
      await docRef.update({
        neighborhood,
      });
      dispatch(updatingNeighborhood(neighborhood));
    } catch (err) {
      console.error(err);
    }
  };
};

export const fetchingOtherInfo = userId => {
  return async dispatch => {
    try {
      const docRef = await db
        .collection('Users')
        .doc(userId)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            console.log('Document data:', doc.data());
            const obj = doc.data();
            const { blurb, birthday, neighborhood } = obj;
            dispatch(mappingOtherInfoToState(blurb, birthday, neighborhood));
          }
        });
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateIdentifyAs = (userId, checkValue, gender) => {
  return async dispatch => {
    try {
    } catch (err) {
      console.error(err);
    }
  };
};
export const updateUserLocation = data => {
  try {
    return async dispatch => {
      let userId = data.userId.id;
      let latitude = data.lat;
      let longitude = data.long;

      let user = db.collection('Users').doc(userId);
      let query = await user.update({
        geolocation: new firebase.firestore.GeoPoint(latitude, longitude),
      });
      // dispatch(fetchLocation(userObj));
    };
  } catch (err) {
    console.error(err);
  }
};

//---------------------- INITIAL STATE -----------------------
const initialState = {
  //current: {},
  matches: [],
  selectedMatch: {},
  messagesToMatch: [],
  messagesToUser: [],
  all: [],
  current: {},
  selectedMessages: [],
  newMatchData: { userId: '', matchId: '' },
  deposit: '',
  blurb: '',
  birthday: '',
  neighborhood: '',

  identifyAs: '',
  seeking: '',
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
    case UPDATE_BLURB:
      return {
        ...state,
        blurb: action.blurb,
      };

    case UPDATE_BIRTHDAY:
      return {
        ...state,
        birthday: action.birthday,
      };

    case UPDATE_NEIGHBORHOOD:
      return {
        ...state,
        neighborhood: action.neighborhood,
      };
    case MAP_OTHER_INFO_TO_STATE:
      return {
        ...state,
        blurb: action.blurb,
        birthday: action.birthday,
        neighborhood: action.neighborhood,
      };
    case FETCH_LOCATION:
      return {
        ...state,
        current: action.location,
      };
    default:
      return state;
  }
}
