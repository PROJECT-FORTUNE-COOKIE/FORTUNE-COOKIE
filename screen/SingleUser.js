import React, { Component } from 'react';
import {
  ScrollView,
  Button,
  View,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import { connect } from 'react-redux';
import CameraAR from './CameraAR';

class SingleUser extends Component {
  onChooseImage = async () => {
    //console.log('--------------pressed ------------');
    let result = await ImagePicker.launchCameraAsync();

    if (!resule.cancelled) {
      this.uploadImage(result.uri, 'test')
        .then(() => {
          Alert.alert('Success');
        })
        .catch(error => {
          Alert.alert(error);
        });
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('images/' + imageName);
    return ref.put(blob);
  };
  render() {
    const { container, rowContainer } = styles;
    const me = this.props.me;

    return (
      <View style={container}>
        <View>
          <Avatar
            xlarge
            rounded
            title="FC"
            onPress={() => this.props.navigation.navigate('SingleUser')}
            activeOpacity={0.7}
          />
        </View>
        <View style={rowContainer}>
          <Icon
            reverse
            name="edit"
            type="feather"
            onPress={() => this.props.navigation.navigate('EditDetail')}
          />
          <Button title="camera" onPress={() => <CameraAR />} />
          <Icon
            reverse
            name="settings"
            type="feather"
            onPress={() => this.props.navigation.navigate('UserSetting')}
          />
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>{me.name}</Text>
          {me.deposit ? <Text>{me.deposit} </Text> : null}
          {me.birthday ? <Text>{me.age} </Text> : null}
          {me.age ? <Text>{me.age} </Text> : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    me: state.users.current,
  };
};

export default connect(mapStateToProps)(SingleUser);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 65,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
    padding: 60,
  },
});
