import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Image, Text, View } from 'react-native';
import { fbMe } from './store/userReducer';
import { connect } from 'react-redux';

const LogIn = props => {
  const { container, countViewStyle, image } = styles;

  return (
    <View style={container}>
      <Image style={image} source={require('../assets/002.png')} />
      <Text>Welcome to Fortune Cookie</Text>
      <Text>~no cookie left behind~</Text>

      <View style={countViewStyle} />
      <Button
        raised
        icon={{ name: 'facebook', type: 'entypo' }}
        title="sign in with facebook  "
        onPress={() => {
          props.handleSubmit();
          props.navigation.navigate('WelcomePage');
        }}
      />
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    handleSubmit() {
      dispatch(fbMe());
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LogIn);

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
