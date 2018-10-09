import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';

class WelcomePage extends Component {
  // componentDidMount() {
  //   this.props.checkIfNewUser();
  // }

  render() {
    const { container, image } = styles;

    return (
      <View style={container}>
        <Text
          style={{
            fontFamily: 'AvenirNext-Regular',
            fontSize: 23
          }}
        >
          WELCOME to Fortune Cookie
        </Text>

        <Image style={image} source={require('../assets/fortune.png')} />

        <Button
          small
          backgroundColor="#3c9bed"
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
    );
  }
}

const mapStateToProps = state => {
  return {
    newUser: state.users.newUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkIfNewUser: () => dispatch(checkingIfNewUser())
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
    backgroundColor: '#F5FCFF'
  },

  image: {
    width: 400,
    height: 400,
    resizeMode: 'cover'
  }
});
