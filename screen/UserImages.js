import React, { Component } from 'react';
import {
  ScrollView,
  Button,
  View,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { storage } from './store/firestoreAuth';
import { ImagePicker, Permissions } from 'expo';
import { connect } from 'react-redux';

class SingleUser extends Component {
  constructor() {
    super();
    this.state = {
      imageCurrent: '',
      images: []
    };
  }
  onChooseImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      })
        .then(newPostImage => {
          if (!newPostImage.cancelled) {
            this.uploadImage(newPostImage.uri, 'test')
              .then(() => {
                console.log('good');
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(err => console.log(err));
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = storage.child(`${this.props.me.id}/${Math.random()}`);
    //let imgLocation = ref.location.path_;
    this.setState({
      imageCurrent: uri
    });
    return ref.put(blob);
  };

  // pickImages = () => {
  //   const img = storage.child(this.state.imageCurrent);
  //   // const iconImg = img
  //   //   .getMetadata()
  //   //   .then(metadata => {
  //   //     console.log(metadata);
  //   //     return metadata;
  //   //   })
  //   //   .catch(error => {
  //   //     console.log(error);
  //   //   });
  // };

  render() {
    console.log('------------state---', this.state);
    const { container, rowContainer } = styles;
    const me = this.props.me;
    const image = this.state.imageCurrent;
    return (
      <View style={container}>
        <View>
          <Avatar
            xlarge
            rounded
            title="FC"
            source={{
              uri: image
            }}
            // onPress={() => this.pickImages()}
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
          <Icon
            reverse
            name="camera"
            type="feather"
            onPress={() => this.onChooseImage()}
          />
          {/* <Button title="camera" onPress={() => this.onChooseImage()} /> */}
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
    me: state.users.current
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
    padding: 65
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
    padding: 60
  }
});