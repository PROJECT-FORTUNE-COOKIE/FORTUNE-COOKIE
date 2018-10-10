import { db } from './firestoreAuth';
import { Facebook } from 'expo';
import { fbAppId } from '../../secret';
const firebase = require('firebase');
// Required for side-effects
const firestore = require('firebase/firestore');
//---------------------- ACTION TYPES -----------------------

const CHECK_IF_NEW_USER = 'CHECK_IF_NEW_USER';
const GOT_USER = 'GOT_USER';
const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
const GOT_ALL_USERS = 'GOT_ALL_USERS';
const GET_MATCHES = 'GET_MATCHES';
const GET_MESSAGES_FOR_SELETED_MATCH = 'GET_MESSAGES_FOR_SELETED_MATCH';
const GET_MESSAGES_FROM_SELETED_MATCH = 'GET_MESSAGES_FROM_SELETED_MATCH';
const SET_SELECTED_MATCH_ON_STATE = 'SET_SELECTED_MATCH_ON_STATE';
const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const CHANGE_ICON = 'CHANGE_ICON';
const ADD_MATCH_TO_ACCEPTED = 'ADD_MATCH_TO_ACCEPTED';
const GET_ACCEPTED_MATCHES = 'GET_ACCEPTED_MATCHES';
const FETCH_DEPOSIT = 'FETCH DEPOSIT';
const UPDATE_DEPOSIT = 'UPDATE_DEPOSIT';
const UPDATE_USER_LOCATION = 'UPDATE_USER_LOCATION';
const FETCH_LOCATION = 'FETCH_LOCATION';

const MAP_OTHER_INFO_TO_STATE = 'MAP_OTHER_INFO_TO_STATE';
const UPDATE_IDENTIFY_AS_AND_SEEKING = 'UPDATE_IDENTIFY_AS_AND_SEEKING';

const CREATE_NEARBY_MATCHES_ARRAY = 'CREATE_NEARBY_MATCHES_ARRAY';

//---------------------- ACTION CREATORS -----------------------

const checkIfNewUser = bool => ({
  type: CHECK_IF_NEW_USER,
  bool,
});

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
const addMatchToAccepted = match => ({
  type: ADD_MATCH_TO_ACCEPTED,
  match,
});

const mappingOtherInfoToState = (blurb, birthday, neighborhood, age) => ({
  type: MAP_OTHER_INFO_TO_STATE,
  blurb,
  birthday,
  neighborhood,
  age,
});

const updatingIdentifyAsAndSeeking = (
  blurb,
  neighborhood,
  birthday,
  identifyAs,
  seeking,
  age
) => ({
  type: UPDATE_IDENTIFY_AS_AND_SEEKING,
  blurb,
  neighborhood,
  birthday,
  identifyAs,
  seeking,
  age,
});

const fetchLocation = location => ({
  type: FETCH_LOCATION,
  location,
});

const createNearbyMatchesArray = matchesArray => ({
  type: CREATE_NEARBY_MATCHES_ARRAY,
  matchesArray,
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
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        let data = await response.json();
        const docRef = db.collection('Users').doc(data.id);

        await docRef.get().then(function(doc) {
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
                age: '',
                geolocation: '',
              });
            dispatch(checkIfNewUser(true));
          }
        });
        let userObj = {};
        docRef.get().then(doc => {
          userObj = doc.data();
          dispatch(gotUser(userObj));
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
            const { blurb, birthday, neighborhood, age } = obj;
            dispatch(
              mappingOtherInfoToState(blurb, birthday, neighborhood, age)
            );
          }
        });
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateIdentifySeeking = (
  userId,
  blurb,
  neighborhood,
  birthday,
  identifyAs,
  seeking
) => {
  return async dispatch => {
    try {
      function _calculateAge(birthday) {
        // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      }

      const docRef = db.collection('Users').doc(userId);
      const age = _calculateAge(new Date(birthday));
      await docRef.update({
        blurb,
        neighborhood,
        birthday,
        identifyAs,
        seeking,
        age,
      });
      dispatch(
        updatingIdentifyAsAndSeeking(
          blurb,
          neighborhood,
          birthday,
          identifyAs,
          seeking,
          age
        )
      );
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
    };
  } catch (err) {
    console.error(err);
  }
};

export const creatingMatchesArray = (userId, location) => {
  //try{
  return async dispatch => {
    let matchArr = [];
    //let allUsers = db.collection('Users');

    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    // ~1 mile of lat and lon in degrees
    let lat = 0.0144927536231884;
    let lon = 0.0181818181818182;

    let lowerLat = latitude - lat;
    let lowerLon = longitude - lon;

    let greaterLat = latitude + lat;
    let greaterLon = longitude + lon;

    let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
    let greaterGeopoint = new firebase.firestore.GeoPoint(
      greaterLat,
      greaterLon
    );

    let allUsers = db.collection('Users');
    let query = allUsers
      .where('geolocation', '<=', greaterGeopoint)
      .where('geolocation', '>=', lesserGeopoint)
      .onSnapshot(snapshot => {
        //let data = [];
        snapshot.forEach(doc => {
          matchArr.push(doc.data());
        });
        dispatch(createNearbyMatchesArray(matchArr));
      });
  };
};

export const updateAcceptedMatch = (current, likedUser) => {
  return async dispatch => {
    try {
      let likedId = likedUser.id;
      let currentId = current.id;

      let user = await db.collection('Users').doc(currentId);
      await user.update({
        acceptedMatches: firebase.firestore.FieldValue.arrayUnion(likedId),
      });
      let luckyUser = await db.collection('Users').doc(likedId);
      await luckyUser.update({
        acceptedMatches: firebase.firestore.FieldValue.arrayUnion(currentId),
      });
      dispatch(addMatchToAccepted(likedUser));
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateRejectMatch = (current, dislikedUser) => {
  return async dispatch => {
    try {
      let dislikedId = dislikedUser.id;
      let currentId = current.id;

      let user = await db.collection('Users').doc(currentId);
      await user.update({
        rejectedMatches: firebase.firestore.FieldValue.arrayUnion(dislikedId),
      });
      let unluckyUser = await db.collection('Users').doc(dislikedId);
      await unluckyUser.update({
        rejectedMatches: firebase.firestore.FieldValue.arrayUnion(currentId),
      });
    } catch (err) {
      console.error(err);
    }
  };
};

//---------------------- INITIAL STATE -----------------------
const initialState = {
  newUser: '',
  matches: [],
  selectedMatch: {},
  messagesToMatch: [],
  messagesToUser: [],
  all: [],
  current: {},
  selectedMessages: [],
  deposit: '',
  blurb: '',
  birthday: '',
  neighborhood: '',
  identifyAs: '',
  seeking: '',
  nearbyMatchesArr: [],
  age: '',
};

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    case CHECK_IF_NEW_USER:
      return {
        ...state,
        newUser: action.bool,
      };
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
        matches: [...state.matches, action.match],
      };
    case MAP_OTHER_INFO_TO_STATE:
      return {
        ...state,
        blurb: action.blurb,
        birthday: action.birthday,
        neighborhood: action.neighborhood,
        age: action.age,
      };

    case UPDATE_IDENTIFY_AS_AND_SEEKING:
      return {
        ...state,
        blurb: action.blurb,
        neighborhood: action.neighborhood,
        birthday: action.birthday,
        identifyAs: action.identifyAs,
        seeking: action.seeking,
        age: action.age,
      };
    case FETCH_LOCATION:
      return {
        ...state,
        current: action.location,
      };
    case CREATE_NEARBY_MATCHES_ARRAY:
      return {
        ...state,
        nearbyMatchesArr: action.matchesArray,
      };
    default:
      return state;
  }
}
