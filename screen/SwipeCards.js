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
import { addUserToAcceptedMatches, fetchAllUsers } from './store/userReducer';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeCards extends Component {
  constructor(props) {
		super(props);

		this.state = {

      currentMatch: {}
    }

		this.position = new Animated.ValueXY();

		let tracker;

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
								this.position.setValue({ x: 0, y: 0 });
              })
							// const currentUser = this.props.users.find(
							// 	user => user.name == this.props.current.name
							// );
				// 			const genderAvail = this.props.users.filter(match => {
				// 				return (
				// 					(currentUser.seeking === match.identifyAs ? match : null)
				// 				)})

				// const availableMatches = genderAvail.filter(item => {
				// 	return
				// (currentUser.acceptedMatches.indexOf(item.id) < 0) &&
				// (currentUser.rejectedMatches.indexOf(item.id) < 0) &&
				// (currentUser.name !== item.name)
								// })

            let id = this.props.current.id;
            // let currentMatches = currentUser.acceptedMatches.slice();
						// currentMatches = currentMatches.push(availableMatches.id);

            let newMatch = {
              userId: id,
              matchId: currentMatches
						};

						console.log('---------------tracker--------', newMatch.matchId)

					this.props.addUserToAcceptedMatches(currentUser, newMatch)

        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
                this.position.setValue({ x: 0, y: 0 });
              })
            //---------DISPATCH THUNK---------------
          }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start();
					};
				}
		})
	}

  renderUsers = () => {
      const currentUser = this.props.users.find(
      user => user.name == this.props.current.name
		);
		const genderAvail = this.props.users.filter(match => {
			return (
				(currentUser.seeking === match.identifyAs) ?  match : null
			)
		})
		const availMatches = genderAvail.filter(item => {
			return (
				(currentUser.acceptedMatches.indexOf(item.id) < 0) &&
				(currentUser.rejectedMatches.indexOf(item.id) < 0) &&
				(currentUser.name !== item.name))
			})

    return availMatches.map((item, i) => {
        if (item) {
      // const arr = []
      //     for(let i = 0; i < availMatches.length; i++){
      //       arr.push(availMatches[i])
      //     }
      //     this.setState = {
      //       matchId: this.state.matchId + arr[0]
      //     }

          return (
            <Animated.View
              key={item.name}
              {...this.PanResponder.panHandlers}
              style={[
                this.rotateAndTranslate,
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: 'absolute'
                }
              ]}>
              <Animated.View
                style={{
                  opacity: this.likeOpacity,
                  transform: [{ rotate: '-30deg' }],
                  position: 'absolute',
                  top: 50,
                  left: 40,
                  zIndex: 1000
                }}
              >
                <Text style={styles.yes}>LIKE</Text>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: this.dislikeOpacity,
                  transform: [{ rotate: '30deg' }],
                  position: 'absolute',
                  top: 50,
                  right: 40,
                  zIndex: 1000
                }}>
                <Text style={styles.no}>DISLIKE</Text>
              </Animated.View>

              <Image
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  resizeMode: 'cover',
                  borderRadius: 20
                }}
                source={{ uri: this.state.matchId.images[0] }}
              />
            </Animated.View>
					)
				}

				return null;
		})
	}


  render() {


    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 20 }} />
        <View style={{ flex: 1 }}>{this.renderUsers()}</View>
        <View style={{ height: 20 }} />
      </View>
		)};
}

const mapDispatch = dispatch => {
  return {
    addUserToAcceptedMatches: (user, newMatch) => {
      dispatch(addUserToAcceptedMatches(user, newMatch));
    }
  };
};

const mapState = state => {
  return {
    users: state.users.all,
    current: state.users.current,
    newMatchData: state.users.newMatchData
  };
};

export default connect(
  mapState,
  mapDispatch
)(SwipeCards);

const styles = StyleSheet.create({
  yes: {
    borderWidth: 3,
    borderColor: 'green',
    color: 'green',
    fontSize: 32,
    fontWeight: '800',
    padding: 10
  },
  no: {
    borderWidth: 3,
    borderColor: 'red',
    color: 'red',
    fontSize: 32,
    fontWeight: '800',
    padding: 10
  },
  textInfo: {
    fontSize: 20,
    fontWeight: '300',
    color: '#444'
  }
});
