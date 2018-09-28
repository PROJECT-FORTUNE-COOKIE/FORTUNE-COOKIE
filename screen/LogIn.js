import React, { Component } from 'react';
import { SocialIcon, Button } from 'react-native-elements';
import { AppRegistry, StyleSheet, Text, TextInput, View } from 'react-native';

export default class LogIn extends Component {
  render() {
    const { container, countViewStyle, welcome } = styles;
    return (
      <View style={container}>
        <TextInput style={{ width: 200, height: 40, borderWidth: 1 }} />
        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          // onChangeText={this.onChangeText}
          // value={this.state.count.toString()}
        />
        <View style={countViewStyle}>
          <Button
            title="LogIn"
            raised
            icon={{ name: 'fingerprint', type: 'materialicon' }}
            onPress={() => this.props.navigation.navigate('SingleUser')}
          />
          <Button
            title="SignUp"
            raised
            icon={{ name: 'create', type: 'materialicon' }}
            onPress={() => this.props.navigation.navigate('SignUp')}
          />
        </View>
        <SocialIcon title="Use My Facebook " raised button type="facebook" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  countViewStyle: {
    flexDirection: 'row'
  }
});
