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

class WelcomePage extends Component {
  // componentDidMount() {
  //   this.props.checkIfNewUser();
  // }

  render() {
    const { container, image } = styles;

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
            if (this.props.newUser === true) {
              this.props.navigation.navigate('PayDeposit');
            } else {
              this.props.navigation.navigate('SingleUser');
            }
          }}
        />
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
