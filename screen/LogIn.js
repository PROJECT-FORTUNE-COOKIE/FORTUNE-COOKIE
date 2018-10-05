import React, { Component } from 'react';
import { SocialIcon, Button } from 'react-native-elements';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View
} from 'react-native';
import { fbMe } from './store/userReducer';
import { connect } from 'react-redux';

const LogIn = props => {
  const { container, img, txt, btn, text } = styles;

  return (
    <View style={container}>
      <View style={img}>
        <Image source={require('../assets/002.png')} />
      </View>
      <View style={txt}>
        <Text style={text}> Fortune </Text>
        <Text style={text}> Cokie </Text>
        <Text> ~ no cookie left behind ~ </Text>
      </View>
      <View style={btn}>
        <Button
          raised
          icon={{ name: 'facebook', type: 'entypo' }}
          backgroundColor="#3c9bed"
          borderRadius="7%"
          fontFamily="Arial Rounded MT Bold"
          title="sign in with facebook  "
          onPress={() => {
            props.handleSubmit();
            props.navigation.navigate('PayDeposit');
          }}
        />
      </View>
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    handleSubmit() {
      dispatch(fbMe());
    }
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
    backgroundColor: '#F5FCFF'
  },
  img: {
    width: 300,
    height: 300,
    resizeMode: 'cover'
  },
  txt: {
    width: 250,
    height: 50
  },
  btn: {
    with: 180,
    height: 70,
    padding: 10
  },
  text: {
    fontFamily: 'Arial Rounded MT Bold',
    fontSize: 17
  }
});
