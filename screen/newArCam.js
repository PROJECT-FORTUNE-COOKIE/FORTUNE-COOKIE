import React, { Component } from 'react';
import { Tile, List, ListItem, Button } from 'react-native-elements';
import { Text, View, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Constants, Location } from 'expo';
import { creatingMatchesArray, updateUserLocation } from './store/userReducer';
import { connect } from 'react-redux';

import { AR } from 'expo';
import ExpoTHREE, {
  AR as ThreeAR,
  THREE,
  loadAsync,
  loadTextureAsync,
} from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';

class NewArCam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: this.props.location,
      errorMessage: null,
    };
    this.onContextCreate = this.onContextCreate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onRender = this.onRender.bind(this);
  }

  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings();
  }

  render() {
    console.log(
      'OOOO___---------------____THIS.STATE______00000: ',
      this.props.matches
    );

    if (this.props.matches.length < 1) {
      return <Text>LOADING</Text>;
    }
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

    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff));
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);

    await this.setupScene();
  };

  setupScene = async () => {
    // const someRemoteUrl =
    //   'https://www.biography.com/.image/t_share/MTE5NDg0MDU0ODczNDc0NTc1/ben-affleck-9176967-2-402.jpg';
    // const texture = await ExpoTHREE.loadAsync(someRemoteUrl);
    // this.box = new THREE.Mesh(
    //   new THREE.CubeGeometry(1, 1, 1),
    //   new THREE.MeshPhongMaterial({ map: texture })
    // );
    // this.scene.add(this.box);
    //------

    let heartsArr = [];
    let newHeart;
    var geometry = new THREE.CircleGeometry(5, 32);
    console.log('00000----THIS.PROPS.MATCHS-----777777: ', this.props.matches);

    //---
    for (let i = 0, x = -40; i < this.props.matches.length; i++, x += 20) {
      const remoteUrl =
        'https://firebasestorage.googleapis.com/v0/b/project-fortune-cookie.appspot.com/o/1875650202513626%2FmyIcon?alt=media&token=2d58969a-7270-42f6-b7e3-6abe0552b360.jpg';
      const texture = await ExpoTHREE.loadAsync(remoteUrl);
      //const texture = Asset.fromModule(require(remoteUrl));
      // const texture = await loadTextureAsync({
      //   asset: require('https://firebasestorage.googleapis.com/v0/b/project-fortune-cookie.appspot.com/o/1875650202513626%2FmyIcon?alt=media&token=2d58969a-7270-42f6-b7e3-6abe0552b360'),
      // });
      newHeart = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ map: texture })
      );
      newHeart.position.z = -45;
      newHeart.position.x = x;
      heartsArr.push(newHeart);
    }
    heartsArr.forEach(heart => {
      return this.scene.add(heart);
    });

    this.points = new ThreeAR.Points();
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

export default NewArCam;
