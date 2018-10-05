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
import { fbMe } from './store/userReducer';
import { connect } from 'react-redux';

const WelcomePage = props => {
  const { container, countViewStyle, image } = styles;

  return (
    <View style={container}>
      <Text>You are now in Fortune Cookie,</Text>
      <Text>WELCOME</Text>
      <Image style={image} source={require('../assets/002.png')} />

      <Button
        small
        title="~fortune favors the brave~"
        onPress={() => {
          //props.handleSubmit();
          props.navigation.navigate('SingleUser');
        }}
      />
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    // handleSubmit() {
    //   dispatch(fbMe());
    // },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(WelcomePage);

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
