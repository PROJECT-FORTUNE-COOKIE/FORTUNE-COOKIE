import React, { Component } from 'react';
import { AlertIOS, ScrollView, View, StyleSheet, Text } from 'react-native';
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

class PayDeposit extends Component {
  constructor() {
    super();
    this.payNow = this.payNow.bind(this);
  }

  componentDidMount() {
    this.props.fetchInitialState();
  }

  async payNow() {
    // alert('Thanks, you now have a $5 deposit in your accout!');
    //console.log('THIS>PROPS.payment: ', this.props.payment);

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
    const { rowContainer } = styles;
    //console.log('********PAYMENT STATE************:', this.props);
    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>Deposit Payment Form</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>
            Fortune Cookie requires users to keep a deposit of $5 on their
            account. If you do not message at least 3 matches in a week, your $5
            will be given to charity and you will be required to make another
            deposit to continue on the app. If you decide to sign out, any
            deposit money will be return to you!
          </Text>
        </View>

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
      </ScrollView>
    );
  }
}

//export default PayDeposit;

const mapStateToProps = state => {
  return {
    current: state.users.current.name,
    payment: state.payment,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchInitialState: () => dispatch(fetchInitialPaymentState()),
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
});
