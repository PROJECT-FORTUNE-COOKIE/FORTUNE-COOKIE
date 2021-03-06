import React, { Component } from 'react';
import { Tile, List, ListItem, Button } from 'react-native-elements';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Constants, Location } from 'expo';
import { connect } from 'react-redux';
import AssetUtils from 'expo-asset-utils';
import Expo, { AR } from 'expo';
import ExpoTHREE, {
  AR as ThreeAR,
  THREE,
  loadAsync,
  loadTextureAsync,
  loadObjAsync
} from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';

class NewArCam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: this.props.location,
      errorMessage: null
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
      height
    });

    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff));
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);

    await this.setupScene();
  };

  setupScene = async () => {
    let heartsArr = [];
    let newHeart;
    let x = -40;
    var geometry = new THREE.CircleGeometry(5, 32);

    //---

    let remoteUrl = 'https://data.whicdn.com/images/106885273/large.jpg';
    let texture = await ExpoTHREE.loadAsync(remoteUrl);
    newHeart = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ map: texture })
    );
    // newHeart = new THREE.Mesh(
    //   geometry,
    //   new THREE.MeshPhongMaterial({ map: texture })
    // );
    newHeart.position.z = -45;
    newHeart.position.x = x;
    heartsArr.push(newHeart);
    //-------beginning of new char  ------------------
    remoteUrl =
      'https://i.dailymail.co.uk/i/newpix/2018/04/02/19/4ABDA36800000578-5570667-image-a-5_1522694631802.jpg';
    texture = await ExpoTHREE.loadAsync(remoteUrl);
    newHeart = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ map: texture })
    );

    newHeart.position.z = -45;
    x += 20;
    newHeart.position.x = x;

    heartsArr.push(newHeart);
    //------------------end of a new char ------------------
    //-------beginning of new char  ------------------
    remoteUrl =
      'https://pbs.twimg.com/profile_images/771566790874845187/aFEY1zdY_400x400.jpg';
    texture = await ExpoTHREE.loadAsync(remoteUrl);
    newHeart = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ map: texture })
    );

    newHeart.position.z = -45;
    x += 20;
    newHeart.position.x = x;

    heartsArr.push(newHeart);
    //------------------end of a new char ------------------

    //-------beginning of new char  ------------------
    remoteUrl = 'https://i.ebayimg.com/images/g/pOMAAOSwWdZZZsJN/s-l300.jpg';
    texture = await ExpoTHREE.loadAsync(remoteUrl);
    newHeart = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ map: texture })
    );

    newHeart.position.z = -45;
    x += 20;
    newHeart.position.x = x;

    heartsArr.push(newHeart);
    //------------------end of a new char ------------------

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
