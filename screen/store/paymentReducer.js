const firebase = require('firebase');
//const stripe = require("stripe")(stripeAPIkey)

// Required for side-effects
require('firebase/firestore');

import { db } from './firestoreAuth';
import { stripeAPIkey } from '../../secret';
//const stripe = require('stripe')(stripeAPIkey);

//---------------------- ACTION TYPES -----------------------
const FETCH_INITIAL_PAYMENT_STATE = 'FETCH_INITIAL_PAYMENT_STATE';
const UPDATE_EMAIL = 'UPDATE_EMAIL';
const UPDATE_CCNUMBER = 'UPDATE_CCNUMBER';
const UPDATE_EXPMONTH = 'UPDATE_EXPMONTH';
const UPDATE_EXPYEAR = 'UPDATE_EXPYEAR';
const UPDATE_CVC = 'UPDATE_CVC';
const CREATE_TOKEN = 'CREATE_TOKEN';
//-----
const CHARGE_CUSTOMER = 'CHARGE_CUSTOMER';

//---------------------- ACTION CREATORS -----------------------
export const fetchInitialPaymentState = () => ({
  type: FETCH_INITIAL_PAYMENT_STATE,
});

const updateEmail = email => ({
  type: UPDATE_EMAIL,
  email,
});

const updateCCNumber = number => ({
  type: UPDATE_CCNUMBER,
  number,
});

const updateExpMonth = month => ({
  type: UPDATE_EXPMONTH,
  month,
});

const updateExpYear = year => ({
  type: UPDATE_EXPYEAR,
  year,
});

const updateCVC = cvc => ({
  type: UPDATE_CVC,
  cvc,
});

const createToken = token => ({
  type: CREATE_TOKEN,
  token,
});

const chargeCustomer = approval => ({
  type: CHARGE_CUSTOMER,
  approval,
});

//---------------------- THUNK CREATOR -----------------------

export const updatingPaymentEmail = email => {
  return dispatch => {
    dispatch(updateEmail(email));
    try {
    } catch (err) {
      console.error(err);
    }
  };
};

export const updatingCCNumber = number => {
  return dispatch => {
    dispatch(updateCCNumber(number));
    try {
    } catch (err) {
      console.error(err);
    }
  };
};

export const updatingExpMonth = month => {
  return dispatch => {
    dispatch(updateExpMonth(month));
    try {
    } catch (err) {
      console.error(err);
    }
  };
};

export const updatingExpYear = year => {
  return dispatch => {
    dispatch(updateExpYear(year));
    try {
    } catch (err) {
      console.error(err);
    }
  };
};

export const updatingCVC = cvc => {
  return dispatch => {
    dispatch(updateCVC(cvc));
    try {
    } catch (err) {
      console.error(err);
    }
  };
};

export const creatingToken = token => {
  return dispatch => {
    dispatch(createToken(token));
    try {
    } catch (err) {
      console.error(err);
    }
  };
};

export const chargingCustomerThroughStripe = token => {
  return async dispatch => {
    try {
    } catch (err) {
      console.error('ERROR WITH CHARGING CUSTOMER: ', err);
    }
  };
};

//---------------------- INITIAL STATE -----------------------
const initialState = {
  token: '',
  paymentApproved: '',
  email: '',
  number: '',
  expmonth: '',
  expyear: '',
  cvc: '',
};

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_INITIAL_PAYMENT_STATE:
      return state;
    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case UPDATE_CCNUMBER:
      return {
        ...state,
        number: action.number,
      };
    case UPDATE_EXPMONTH:
      return {
        ...state,
        expmonth: action.month,
      };
    case UPDATE_EXPYEAR:
      return {
        ...state,
        expyear: action.year,
      };
    case UPDATE_CVC:
      return {
        ...state,
        cvc: action.cvc,
      };
    case CREATE_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
}
