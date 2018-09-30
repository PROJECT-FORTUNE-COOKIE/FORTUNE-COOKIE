import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Avatar } from 'react-native-elements';
import { Permissions } from 'expo-permissions';
import { Constants, Location } from 'expo';

export default class Geolocation extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render() {
    text = this.state.location;

    if (text) {
      console.log('text: ', text);
      let coordinates = text.coords;

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
