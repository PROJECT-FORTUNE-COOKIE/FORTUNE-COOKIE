import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Image, Text, View } from 'react-native';
import { fbMe } from './store/userReducer';
import { connect } from 'react-redux';

const LogIn = props => {
  const { container, img, txt, btn, headText, subText } = styles;

  return (
    <View style={container}>
      <View style={img}>
        <Image source={require('../assets/Cookie.png')} />
      </View>
      <View style={txt}>
        <Text style={headText}> Fortune </Text>
        <Text style={headText}> Cookie </Text>
        <Text style={subText}> ' no cookie left behind </Text>
      </View>
      <View style={btn}>
        <Button
          raised
          icon={{ name: 'facebook', type: 'entypo' }}
          backgroundColor="#3c9bed"
          fontFamily="Arial Rounded MT Bold"
          title="sign in with facebook  "
          onPress={() => {
            props.handleSubmit();
            props.navigation.navigate('WelcomePage');
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
    width: 180,
    height: 400,
    position: 'absolute',
    top: 230,
    zIndex: 0
  },
  txt: {
    width: 350,
    position: 'absolute',
    top: 50,
    height: 250,
    zIndex: 1
  },
  btn: {
    width: 280,
    height: 70,
    padding: 10,
    position: 'absolute',
    top: 480,
    zIndex: 2
  },
  headText: {
    fontFamily: 'Arial Rounded MT Bold',
    fontSize: 60
  },
  subText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 25
  }
});
