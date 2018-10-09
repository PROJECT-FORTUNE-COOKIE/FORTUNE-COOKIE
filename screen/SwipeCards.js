import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder
} from 'react-native';
import { connect } from 'react-redux';
import { updateAcceptedMatch, updateRejectMatch } from './store';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeCards extends Component {
  constructor() {
    super();
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });

    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    });

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });
  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            let oldIndx = this.state.currentIndex;
            const likedUser = this.props.all.splice(oldIndx, 1);
            const current = this.props.current;
            this.props.updateAcceptedMatches(current, likedUser[0]);
            this.setState(
              {
                currentIndex: this.state.currentIndex + 1
              },
              () => {
                this.position.setValue({ x: 0, y: 0 });
              }
            );
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            let oldIndx = this.state.currentIndex;
            const dislikedUser = this.props.all.splice(oldIndx, 1);
            const current = this.props.current;
            this.props.updateAcceptedMatches(current, dislikedUser[0]);
            this.setState(
              {
                currentIndex: this.state.currentIndex + 1
              },
              () => {
                this.position.setValue({ x: 0, y: 0 });
              }
            );
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start();
        }
      }
    });
  }

  renderUsers = all => {
    return all
      .map((item, i) => {
        if (i < this.state.currentIndex) {
          return null;
        } else if (i == this.state.currentIndex) {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id}
              style={[
                this.rotateAndTranslate,
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: 'absolute'
                }
              ]}
            >
              <Animated.View
                style={{
                  opacity: this.likeOpacity,
                  transform: [{ rotate: '-20deg' }],
                  position: 'absolute',
                  zIndex: 1000
                }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: 'orange',
                    color: 'orange',
                    fontSize: 32,
                    top: 50,
                    left: 40,
                    fontWeight: '800',
                    padding: 10
                  }}
                >
                  Lucky Cookie
                </Text>
              </Animated.View>
              <Animated.View
                style={{
                  opacity: this.dislikeOpacity,
                  transform: [{ rotate: '20deg' }],
                  position: 'absolute',
                  top: 50,
                  right: 40,
                  zIndex: 1000
                }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: 'red',
                    color: 'red',
                    fontSize: 32,
                    fontWeight: '800',
                    padding: 10
                  }}
                >
                  awwW
                </Text>
              </Animated.View>
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  color: 'white',
                  fontSize: 25,
                  top: 430,
                  right: 0,
                  fontWeight: '800',
                  padding: 10,
                  zIndex: 2000
                }}
              >
                {item.name} -{item.neighborhood}
              </Text>

              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: 'cover',
                  borderRadius: 20
                }}
                source={{ uri: item.icon }}
              />
            </Animated.View>
          );
        } else {
          return (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: this.nextCardOpacity,
                  transform: [{ scale: this.nextCardScale }],
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: 'absolute'
                }
              ]}
            >
              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: 'cover',
                  borderRadius: 20
                }}
                source={{ uri: item.icon }}
              />
            </Animated.View>
          );
        }
      })
      .reverse();
  };

  render() {
    const all = this.props.all;
    const current = this.props.current;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{this.renderUsers(all)}</View>
        <View style={{ height: 60 }}>footer</View>
      </View>
    );
  }
}

mapDispatch = dispatch => {
  return {
    updateAcceptedMatches: (current, likedUser) => {
      dispatch(updateAcceptedMatch(current, likedUser));
    },
    updateRejectMatches: (current, dislikeUser) => {
      dispatch(updateRejectMatch(current, dislikeUser));
    }
  };
};

export default connect(
  null,
  mapDispatch
)(SwipeCards);
