import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import { connect } from 'react-redux';
import { addUserToAcceptedMatches, fetchAllUsers } from './store/userReducer';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

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
})

class SwipeCards extends Component {
	constructor(props) {
		super(props);


		this.position = new Animated.ValueXY();
		this.state = {
			currentIndex: 0
		};

		// adjust sizes for swiping animation
		this.rotate = this.position.x.interpolate({
			inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
			outputRange: [ '-10deg', '0deg', '10deg' ],
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
    //make card "disappear" once swiped

		this.likeOpacity = this.position.x.interpolate({
			inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
			outputRange: [ 0, 0, 1 ],
			extrapolate: 'clamp'
    });

		this.dislikeOpacity = this.position.x.interpolate({
			inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
			outputRange: [ 1, 0, 0 ],
			extrapolate: 'clamp'
		});

		this.nextCardOpacity = this.position.x.interpolate({
			inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
			outputRange: [ 1, 0, 1 ],
			extrapolate: 'clamp'
		});
		this.nextCardScale = this.position.x.interpolate({
			inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
			outputRange: [ 1, 0.8, 1 ],
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
						this.setState((state) => ({
              currentIndex: state.currentIndex + 1 }), () => {
							this.position.setValue({ x: 0, y: 0 });
						});
					//----------DISPATCH THUNK
			//		const { userId, matchId } = this.props.newMatchData
			const currentUser = this.props.users.find(user => user.name == this.props.current.name)

			const pref = currentUser.seeking
			const genderAvail = this.props.users.filter((user) => user.seeking == pref)
			console.log('-------------UPDATED ACCEPTED-------------', currentUser)

			const availableMatches = genderAvail.filter((item) => {
				return (currentUser.acceptedMatches.indexOf(item.id) == -1) && (currentUser.name !== item.name)
					})
					let id = this.props.current.id


					let currentMatches = currentUser.acceptedMatches.slice();

					console.log('--------------CURRENT MATCHES-------------', currentMatches)

					currentMatches = currentMatches.push(availableMatches.id)
					const newMatch = {
						userId: id,
						matchId: currentMatches
					}

					 this.props.addUserToAcceptedMatches(newMatch)

					});
				} else if (gestureState.dx < -120) {
					Animated.spring(this.position, {
						toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
					}).start(() => {
						this.setState((state) => ({
               currentIndex: state.currentIndex + 1 }), () => {
							this.position.setValue({ x: 0, y: 0 });
						});
				//---------DISPATCH THUNK---------------
					});
				} else {
					Animated.spring(this.position, {
						toValue: { x: 0, y: 0 },
						friction: 4
					}).start()
        }
      }
		})
  }

	renderUsers = () => {


		const currentUser = this.props.users.find(user => user.name == this.props.current.name)

		const pref = currentUser.seeking
		const genderAvail = this.props.users.filter((user) => user.seeking == pref)

		const availableMatches = genderAvail.filter((item) => {
			return (currentUser.acceptedMatches.indexOf(item.id) == -1) &&
		(currentUser.rejectedMatches.indexOf(item.id) == -1) && (currentUser.name !== item.name)
				})

		return availableMatches.map((item, i) => {

			if (i === this.state.currentIndex) {
					return (
						<Animated.View
							key={item.name}
              {...this.PanResponder.panHandlers}
							style={[
								this.rotateAndTranslate,
								{ height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
							<Animated.View
								style={{
									opacity: this.likeOpacity,
									transform: [ { rotate: '-30deg' } ],
									position: 'absolute',
									top: 50,
									left: 40,
									zIndex: 1000
								}}>
								<Text
									style={styles.yes}>LIKE</Text>

							</Animated.View>

							<Animated.View
								style={{
									opacity: this.dislikeOpacity,
									transform: [ { rotate: '30deg' } ],
									position: 'absolute',
									top: 50,
									right: 40,
									zIndex: 1000
								}}>
								<Text
									style={styles.no}>
									DISLIKE
								</Text>
							</Animated.View>

              <Text style={{ fontSize: 26, fontWeight: '300', color: '#444' }}>
									{item.name}, {item.birthday}
								</Text>
							<Image
								style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
								source={{uri: item.images[0]}} />
						</Animated.View>
          )}

     else if (i < this.state.currentIndex) {
          return null;
       }
      else {
					return (
						<Animated.View key={item.name}
							style={[
								{
									opacity: this.nextCardOpacity,
									transform: [ { scale: this.nextCardScale } ],
									height: SCREEN_HEIGHT - 120,
									width: SCREEN_WIDTH,
									padding: 10,
									position: 'absolute'
								}
							]}>
							<Animated.View
								style={{
									opacity: 0,
									transform: [ { rotate: '-30deg' } ],
									position: 'absolute',
									top: 50,
									left: 40,
									zIndex: 1000
								}}>
								<Text
									style={styles.yes}>
									LIKE
								</Text>
							</Animated.View>

							<Animated.View
								style={{
									opacity: 0,
									transform: [ { rotate: '30deg' } ],
									position: 'absolute',
									top: 50,
									right: 40,
									zIndex: 1000
								}}>
								<Text
									style={styles.no}>
									DISLIKE
								</Text>
							</Animated.View>

	          	<Text style={styles.textInfo}>
									{item.name}, {item.birthday}
								</Text>
							<Image source={{uri: item.images[0]}}
								style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }} />
                </Animated.View>
					)}
			})
			.reverse()
		}

	componentDidMount() {
		this.props.fetchAllUsers()
	}

	render() {


		return (

			<View style={{flex: 1 }}>
				<View style={{ height: 20 }} />

				<View style={{ flex: 1 }}>{this.renderUsers()}</View>
				<View style={{ height: 20 }} />
			</View>
		);
	}

}

const mapDispatch = dispatch => {
	return {
	fetchAllUsers: () => {
		dispatch(fetchAllUsers())
	},
	addUserToAcceptedMatches: newMatch => {
		dispatch(addUserToAcceptedMatches(newMatch))
	}
}
}

const mapState = state => {
	return {
	users: state.users.all,
	current: state.users.current,
	newMatchData: state.users.newMatchData
}
}

export default connect(mapState, mapDispatch)(SwipeCards)
