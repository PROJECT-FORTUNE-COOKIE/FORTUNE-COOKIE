import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import {
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';

const BG_IMAGE = require('../assets/ROW-BACK.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class WelcomePage extends Component {
  render() {
    const { container, txt, btn, headText, subText } = styles;

    return (
      <View style={container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage} />

        <View style={txt}>
          <Text style={headText}>Welcome!</Text>

          <Text style={subText}>
            Fortune Cookie requires users to keep a deposit of $5 on their
            account. If you do not message at least 3 matches in a week, your $5
            will be given to charity and you will be required to make another
            deposit to continue on the app. If you decide to sign out, any
            deposit money will be return to you!
          </Text>
        </View>

        <View style={btn}>
          <Button
            small
            raised
            backgroundColor="#edc797"
            fontFamily="Arial Rounded MT Bold"
            title="~fortune favors the brave~"
            onPress={() => {
              if (this.props.newUser === true) {
                this.props.navigation.navigate('PayDeposit');
              } else {
                this.props.navigation.navigate('SingleUser');
              }
            }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    newUser: state.users.newUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkIfNewUser: () => dispatch(checkingIfNewUser()),
  };
};

export default connect(
  mapStateToProps,
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
  txt: {
    width: 350,
    position: 'absolute',
    top: 70,
    height: 250,
    zIndex: 1,
  },
  btn: {
    width: 280,
    height: 70,
    padding: 10,
    position: 'absolute',
    top: 480,
    zIndex: 2,
    borderWidth: 0,
    borderRadius: 5,
  },
  headText: {
    fontFamily: 'Arial Rounded MT Bold',
    fontSize: 40,
    left: 80,
  },
  subText: {
    top: 175,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 17,
    left: 0,
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
});
