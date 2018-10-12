import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Icon } from 'react-native-elements';
import { storage } from './store/firestoreAuth';
import { ImagePicker, Permissions } from 'expo';
import { connect } from 'react-redux';
import { updateIcon, fetchAllUsers } from './store/userReducer';

const BG_IMAGE = require('../assets/backgroundIMG.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class SingleUser extends Component {
  componentDidMount() {
    let interest = 'male';
    let selfSex = this.props.me.identifyAs;
    if (this.props.me.seeking !== interest) {
      interest = 'female';
    }
    this.props.waitingCookie(selfSex, interest);
  }

  onChooseImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        base64: true
      })
        .then(newPostImage => {
          if (!newPostImage.cancelled) {
            this.uploadImage(newPostImage.uri, 'myIcon')
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
    console.log('BLOB_BLOB_BLOB: ', blob);
    const referenceAddress = `${this.props.me.id}/${imageName}`;

    //----------create storage reference ------

    var ref = storage.child(referenceAddress);
    ref.put(blob);
    const strURL = ref.getDownloadURL().then(url => {
      return url;
    });
    const waited = await strURL;
    waited.toString();
    this.props.changeIcon(this.props.me, waited);
  };

  render() {
    const { container, rowContainer, text, img, bgImage } = styles;
    const me = this.props.me;
    let image = me.icon;
    return (
      <View style={container}>
        <ImageBackground source={BG_IMAGE} style={bgImage} />
        <View style={img}>
          <Image
            style={{
              height: 280,
              width: 300,
              borderRadius: 30
            }}
            source={{
              uri: image
            }}
          />
        </View>

        <View style={text}>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              fontSize: 25
            }}
          >
            {me.name}
          </Text>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              fontSize: 15
            }}
          >
            Deposit: ${me.deposit ? <Text>{me.deposit} </Text> : null}
          </Text>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              fontSize: 15
            }}
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
          <Icon
            reverse
            name="settings"
            type="feather"
            onPress={() => this.props.navigation.navigate('UserSetting')}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    me: state.users.current,
    meToo: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeIcon: (user, newIcon) => dispatch(updateIcon(user, newIcon)),
    waitingCookie: (selfSex, interest) =>
      dispatch(fetchAllUsers(selfSex, interest))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleUser);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  rowContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 460
  },
  img: {
    position: 'absolute',
    top: 50
  },
  text: {
    position: 'absolute',
    top: 370
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
