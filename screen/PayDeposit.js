import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Slider,
  Icon,
  List,
  ListItem,
  FormLabel,
  FormInput,
  CheckBox,
  FormValidationMessage,
  Button,
} from 'react-native-elements';
import Stripe from 'react-native-stripe-api';

class PayDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      expmonth: '',
      expyear: '',
      cvc: '',
    };
    this.payNow = this.payNow.bind(this);
  }

  async payNow() {
    alert('fortune favors the bold!');
    const apiKey = 'pk_test_ocAH4aPzpCRUQYoPZWPcmngV';
    const client = new Stripe(apiKey);
    console.log('client: ', client);

    // Create a Stripe token with new card infos
    const token = await client.createToken({
      number: this.state.number,
      exp_month: this.state.expmonth,
      exp_year: this.state.expyear,
      cvc: this.state.cvc,
    });
    console.log('token: ', token);
  }

  render() {
    const { rowContainer } = styles;

    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>Deposit Payment Form</Text>
        </View>

        <FormLabel>credit card number</FormLabel>
        <FormInput
          placeholder="4242424242424242"
          onChangeText={number => this.setState({ number })}
          value={'4242424242424242'}
        />

        <FormLabel>expiration month</FormLabel>
        <FormInput
          placeholder="12"
          onChangeText={expmonth => this.setState({ expmonth })}
          value={'12'}
        />

        <FormLabel>expiration year</FormLabel>
        <FormInput
          placeholder="18"
          onChangeText={expyear => this.setState({ expyear })}
          value={'18'}
        />

        <FormLabel>cvc</FormLabel>
        <FormInput
          placeholder="111"
          onChangeText={cvc => this.setState({ cvc })}
          value={'111'}
        />

        <Button onPress={() => this.payNow()} title="PAY" />
      </ScrollView>
    );
  }
}

export default PayDeposit;

// const mapState = state => {
//   return {
//     current: state.users.current,
//     userCard: {
//       number: '',
//       expmonth: '',
//       expyear: '',
//       cvc: '',
//     },
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {};
// };

// export default connect(
//   mapState,
//   mapDispatchToProps
// )(PayDeposit);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
  },
});
