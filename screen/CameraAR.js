import React, { Component } from 'react';
import { Tile, List, ListItem, Button } from 'react-native-elements';
import { Text, View, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Constants, Location } from 'expo';
import { creatingMatchesArray, updateUserLocation } from './store/userReducer';
import { connect } from 'react-redux';
import NewArCam from './newArCam';
import { AR } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';

class CameraAR extends Component {
  constructor() {
    super();
    this.state = {
      location: null,
      errorMessage: null,
      matchesArr: []
    };
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.location !== this.state.location) {
      let userId = this.props.current;
      let lat = this.state.location.coords.latitude;
      let long = this.state.location.coords.longitude;
      let data = {
        userId,
        lat,
        long
      };
      this.props.updateUserLocation(data);

      this.props.createMatchesArrayForAR(
        this.props.current.id,
        this.state.location
      );
    }
  }

  render() {
    if (this.props.nearbyMatchesArr.length > 0) {
      return <NewArCam matches={this.props.nearbyMatchesArr} />;
    }
    return <Text>WAITING....</Text>;
  }
}

const mapState = state => {
  return {
    current: state.users.current,
    nearbyMatchesArr: state.users.nearbyMatchesArr
  };
};

mapDispatch = dispatch => {
  return {
    updateUserLocation: data => {
      dispatch(updateUserLocation(data));
    },
    createMatchesArrayForAR: (userId, location) => {
      dispatch(creatingMatchesArray(userId, location));
    }
  };
};

export default connect(
  mapState,
  mapDispatch
)(CameraAR);
