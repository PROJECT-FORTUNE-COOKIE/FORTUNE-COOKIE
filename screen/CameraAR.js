import React, { Component } from 'react';
import { Tile, List, ListItem, Button } from 'react-native-elements';
import { Text, View, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Constants, Location } from 'expo';
import { creatingMatchesArray, updateUserLocation } from './store/userReducer';
import { connect } from 'react-redux';

import { AR } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';

class CameraAR extends Component {
  constructor(props) {
    super(props);
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
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings();

    this._getLocationAsync();
    console.log('-------------updated---------------');
    Location.watchPositionAsync(
      {
        enableHighAccuracy: false,
        distanceInterval: 5,
        timeInterval: 3000,
      },
      newLocation => {
        this.setState({
          location: newLocation,
        });
        console.log('----------new location--------------', newLocation);
      }
    );
    // this.props.createMatchesArrayForAR(
    //   this.props.current.id,
    //   this.state.location
    // );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.location !== this.state.location) {
      let userId = this.props.current;
      //let coordinates = text.coords;
      let lat = this.state.location.coords.latitude;
      let long = this.state.location.coords.longitude;
      let data = {
        userId,
        lat,
        long,
      };
      this.props.updateUserLocation(data);
      if (this.state.location) {
        this.props.createMatchesArrayForAR(
          this.props.current.id,
          this.state.location
        );
      }
    }
  }

  render() {
    // You need to add the `isArEnabled` & `arTrackingConfiguration` props.
    // `isArRunningStateEnabled` Will show us the play/pause button in the corner.
    // `isArCameraStateEnabled` Will render the camera tracking information on the screen.
    // `arTrackingConfiguration` denotes which camera the AR Session will use.
    // World for rear, Face for front (iPhone X only)
    // if (this.props.nearbyMatchesArr.length && this.props.nearbyMatchesArr) {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
        arTrackingConfiguration={AR.TrackingConfigurations.World}
      />
    );
    // } else {
    //   return null;
    // }
  }

  // When our context is built we can start coding 3D things.
  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene();
    // This will create a camera texture and use it as the background for our scene
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // Now we make a camera that matches the device orientation.
    // Ex: When we look down this camera will rotate to look down too!
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    // const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    //var geometry = new THREE.CircleGeometry(0.1, 32);
    // // Simple color material
    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
    });

    // // Combine our geometry and material
    //this.cube = new THREE.Mesh(geometry, material);
    //this.circle = new THREE.Mesh(geometry, material);

    var x = 0,
      y = 0;

    var heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    var geometry = new THREE.ShapeGeometry(heartShape);
    // this.heart = new THREE.Mesh(geometry, material);
    // this.heart1 = new THREE.Mesh(geometry, material);
    // this.heart2 = new THREE.Mesh(geometry, material);

    const matchesArr = this.props.nearbyMatchesArr;
    console.log('%%%%%%MATCHES ARRAY IN&&&&&&&: ', matchesArr);
    if (matchesArr.lenght) {
      var heartArr = matchesArr.map(match => {
        return new THREE.Mesh(geometry, material);
      });
      console.log('%%%%%%HEART ARRAY IN&&&&&&&: ', heartArr);
      heartArr.forEach(heart => {
        x = -40;
        return () => {
          heart.position.z = -40;
          heart.position.x = x;
          x += 20;
        };
      });
      heartArr.forEach(heart => {
        this.scene.add(heart);
      });
    }

    // // Place the box 0.4 meters in front of us.
    //this.cube.position.z = -0.4;
    // this.heart.position.z = -40;
    // this.heart1.position.z = -40;
    // this.heart2.position.z = -40;
    // this.heart1.position.x = -10;
    // this.heart2.position.x = 10;

    // for(let x = 0; x < heartArr.length; x+=15) {

    // }

    // // Add the cube to the scene
    //this.scene.add(this.cube);

    // this.scene.add(this.heart);
    // this.scene.add(this.heart1);
    // this.scene.add(this.heart2);
    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    this.scene.add(new THREE.AmbientLight(0xffffff));

    // Create this cool utility function that let's us see all the raw data points.
    this.points = new ThreeAR.Points();
    // Add the points to our scene...
    this.scene.add(this.points);
  };

  // When the phone rotates, or the view changes size, this method will be called.
  onResize = ({ x, y, scale, width, height }) => {
    // Let's stop the function if we haven't setup our scene yet
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  // Called every frame.
  onRender = () => {
    // This will make the points get more rawDataPoints from Expo.AR
    this.points.update();
    // Finally render the scene with the AR Camera
    this.renderer.render(this.scene, this.camera);
  };
}

const mapState = state => {
  return {
    current: state.users.current,
    nearbyMatchesArr: state.users.nearbyMatchesArr,
  };
};

mapDispatch = dispatch => {
  return {
    updateUserLocation: data => {
      dispatch(updateUserLocation(data));
    },
    createMatchesArrayForAR: (userId, location) => {
      dispatch(creatingMatchesArray(userId, location));
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(CameraAR);
