import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import { storage } from './store/firestoreAuth';
import { ImagePicker, Permissions } from 'expo';
import { connect } from 'react-redux';
import { updateIcon, fetchAllUsers } from './store/userReducer';

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
        base64: true,
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
    const { container, rowContainer } = styles;
    const me = this.props.me;
    let image = me.icon;
    return (
      <View style={container}>
        <View>
          <Image
            style={{
              height: 280,
              width: 300,
              top: 0,
              borderRadius: 30,
            }}
            source={{
              uri: image,
            }}
          />
        </View>

        <View>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              fontSize: 25,
            }}
          >
            {me.name}
          </Text>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              fontSize: 15,
            }}
          >
            Deposit: ${me.deposit ? <Text>{me.deposit} </Text> : null}
          </Text>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              fontSize: 15,
            }}
          >
            Age: {me.age ? <Text>{me.age} </Text> : null}
          </Text>
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeIcon: (user, newIcon) => dispatch(updateIcon(user, newIcon)),
    waitingCookie: (selfSex, interest) =>
      dispatch(fetchAllUsers(selfSex, interest)),
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
    backgroundColor: '#F5FCFF',
    padding: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 500,
  },
});
