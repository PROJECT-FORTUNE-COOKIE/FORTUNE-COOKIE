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

const heart = new THREE.MeshPhongMaterial({
  color: 0xff00ff,
  specular: 0x555555,
  shininess: 100,
});

class CameraAR extends Component {}
