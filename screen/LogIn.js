import React from 'react';
import { Button } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground
} from 'react-native';
import { fbMe } from './store/userReducer';
import { connect } from 'react-redux';

const BG_IMAGE = require('../assets/NEW-BACKGROUND.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const LogIn = props => {
  const { container, txt, btn, headText, subText, bgImage } = styles;

  return (
    <View style={container}>
      <ImageBackground source={BG_IMAGE} style={bgImage} />

      <View style={txt}>
        <Text style={headText}>Fortune Cookie</Text>
        <Text style={subText}>no cookie left behind</Text>
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
    fontSize: 45,
    left: 15
  },
  subText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 25,
    left: 60
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
