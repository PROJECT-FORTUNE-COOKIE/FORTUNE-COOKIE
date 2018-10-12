import React, { Component } from 'react';
import {
  AlertIOS,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import Stripe from 'react-native-stripe-api';
import { connect } from 'react-redux';
import {
  fetchInitialPaymentState,
  updatingPaymentEmail,
  updatingCCNumber,
  updatingExpMonth,
  updatingExpYear,
  updatingCVC,
  creatingToken,
} from './store/paymentReducer';
import { fetchingInititalDeposit } from './store/userReducer';

const BG_IMAGE = require('../assets/backgroundIMG.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class PayDeposit extends Component {
  constructor() {
    super();
    this.payNow = this.payNow.bind(this);
  }

  componentDidMount() {
    this.props.fetchInitialState();
    const user = this.props.current;
    console.log('const user = this.props.current: ', user);
  }

  async payNow() {
    AlertIOS.alert(
      'Payment Completed',
      'Thanks, you now have a $5 deposit in your accout!',
      [
        {
          text: 'yay! continue on...',
          onPress: () => this.props.navigation.navigate('EditDetail'),
        },
      ]
    );

    try {
      const apiKey = 'pk_test_ocAH4aPzpCRUQYoPZWPcmngV';
      const client = new Stripe(apiKey);
      console.log('client: ', client);
      const card = this.props.payment;
      console.log('THIS>PROPS.payment: ', this.props.payment);
      console.log('THIS>PROPS.current: ', this.props.current);

      // Create a Stripe token with new card info
      const token = await client.createToken({
        number: card.number,
        exp_month: card.expmonth,
        exp_year: card.expyear,
        cvc: card.cvc,
      });
      //console.log('token: ', token);
      this.props.createdToken(token);

      //unable to create customer, charge, etc
      //this npm react-native-stripe-api does not (yet) support these features
    } catch (err) {
      console.log('error with stripe card payment token: ', err);
    }
  }

  render() {
    const { rowContainer, container, txt, headText } = styles;
    return (
      <View style={container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage} />
        {/* <View style={{ flex: 1, alignItems: 'center' }}> */}
        <View style={txt}>
          <Text style={headText}>Deposit Payment Form</Text>

          <FormLabel>email</FormLabel>
          <FormInput
            placeholder="fortune@cookie.com"
            onChangeText={email => this.props.changeEmail(email)}
            //value={'4242424242424242'}
          />

          <FormLabel>credit card number</FormLabel>
          <FormInput
            placeholder="4242424242424242"
            onChangeText={number => this.props.changeCCNumber(number)}
            //value={'4242424242424242'}
          />

          <FormLabel>expiration month</FormLabel>
          <FormInput
            placeholder="12"
            onChangeText={expmonth => this.props.changeExpMonth(expmonth)}
            //value={'12'}
          />

          <FormLabel>expiration year</FormLabel>
          <FormInput
            placeholder="18"
            onChangeText={expyear => this.props.changeExpYear(expyear)}
            //value={'18'}
          />

          <FormLabel>cvc</FormLabel>
          <FormInput
            placeholder="111"
            onChangeText={cvc => this.props.changeCVC(cvc)}
            //value={'111'}
          />

          <Button onPress={() => this.payNow()} title="PAY" />
        </View>
      </View>
    );
  }
}

//export default PayDeposit;

const mapStateToProps = state => {
  return {
    current: state.users.current,
    payment: state.payment,
    deposit: state.users.deposit,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchInitialState: () => dispatch(fetchInitialPaymentState()),
    fetchInitialDeposit: userId => dispatch(fetchingInititalDeposit(userId)),
    changeEmail: email => dispatch(updatingPaymentEmail(email)),
    changeCCNumber: number => dispatch(updatingCCNumber(number)),
    changeExpMonth: month => dispatch(updatingExpMonth(month)),
    changeExpYear: year => dispatch(updatingExpYear(year)),
    changeCVC: cvc => dispatch(updatingCVC(cvc)),
    createdToken: token => dispatch(creatingToken(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayDeposit);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    width: 350,
    position: 'absolute',
    top: 35,
    height: 250,
    zIndex: 1,
  },
  headText: {
    fontFamily: 'Arial Rounded MT Bold',
    fontSize: 17,
    left: 70,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
