import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Avatar } from 'react-native-elements';
import { Permissions } from 'expo-permissions';
import { Constants, Location } from 'expo';
import { updateUserLocation } from './store/userReducer';

class Geolocation extends Component {
  constructor(props) {
    super(props)
  this.state = {
    location: null,
    errorMessage: null,
  };
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    };
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    }


  componentDidMount() {
    this._getLocationAsync()

  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.location !== this.state.location) {
  //     this._getLocationAsync()
  //   }
  //   console.log('---------------HERE ABACK HERE DATA-----------', data)
  // }


  render() {
    text = this.state.location;

    if (text) {

      let userId = this.props.current
      let coordinates = text.coords;
      let lat = this.state.location.coords.latitude
      let long = this.state.location.coords.longitude
      let data = {
        userId,
        lat,
        long
      }

      this.props.updateUserLocation(data)

      return (
        <View style={styles.container}>
          {/* <Text style={styles.paragraph}>{text}</Text> */}
          <Text>Coordinates</Text>
          <Text>Accuracy: {coordinates.accuracy}</Text>
          <Text>Altitude: {coordinates.altitude}</Text>
          <Text>Altitude Accuracy: {coordinates.altitudeAccuracy}</Text>
          <Text>Heading: {coordinates.heading}</Text>
          <Text>Latitude: {coordinates.latitude}</Text>
          <Text>Longitude: {coordinates.longitude}</Text>
          <Text>Speed: {coordinates.speed}</Text>
          <Text>Timestamp: {text.timestamp}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>One moment please...</Text>
        </View>
      );
    }
  }
}

const mapState = state => {
  return {
    current: state.users.current
  }
}
//need to get current location + listen for updates in change to location

mapDispatch = dispatch => {
  return {
    updateUserLocation: (data) => {
      dispatch(updateUserLocation(data))
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default connect(mapState, mapDispatch)(Geolocation)
