const firebase = require('firebase');
//const stripe = require("stripe")(stripeAPIkey)

// Required for side-effects
require('firebase/firestore');

import { db } from './firestoreAuth';
import { stripeAPIkey } from '../../secret';
//const stripe = require('stripe')(stripeAPIkey);

//---------------------- ACTION TYPES -----------------------
const CHARGE_CUSTOMER = 'CHARGE_CUSTOMER';

//---------------------- ACTION CREATORS -----------------------
const chargeCustomer = approval => {
  type: CHARGE_CUSTOMER, approval;
};

//---------------------- THUNK CREATOR -----------------------

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
};

//---------------------- REDUCER -----------------------
export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
