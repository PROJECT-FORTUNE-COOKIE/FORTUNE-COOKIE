import React, { Component } from 'react';
import { SocialIcon, Button } from 'react-native-elements';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
} from 'react-native';

export default class LogIn extends Component {
  render() {
    const { container, countViewStyle, welcome, image } = styles;
    return (
      <View style={container}>
        <Image style={image} source={require('../assets/002.png')} />
        <Text>Welcome to Fortune Cookie</Text>
        <Text>~no cookie left behind~</Text>
        <Text> </Text>
        <View style={countViewStyle} />
        <Button
          raised
          icon={{ name: 'facebook', type: 'entypo' }}
          title="sign in with facebook  "
          onPress={() => this.props.navigation.navigate('SingleUser')}
        />
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
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  countViewStyle: {
    flexDirection: 'row',
    width: 450,
    height: 50,
  },
  image: {
    width: 200,
    height: 220,
    resizeMode: 'cover',
  },
});
