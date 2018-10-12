import React, { Component } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Picker,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Button, FormLabel, FormInput, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  fetchCurrentUser,
  fetchingOtherInfo,
  updateIdentifySeeking,
} from './store/userReducer';

const BG_IMAGE = require('../assets/backgroundIMG.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class EditDetail extends Component {
  constructor() {
    super();
    this.state = {
      checkIdentifyMale: false,
      checkIdentifyFemale: false,
      checkSeekingMale: false,
      checkSeekingFemale: false,
      blurb: '',
      neighborhood: '',
      birthday: '',
      charity: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCharity = this.updateCharity.bind(this);
  }

  updateCharity = charity => {
    this.setState({ charity: charity });
  };

  componentDidMount() {
    this.props.fetchUser();
    if (this.props.current.id) {
      this.props.fetchOtherInfo(this.props.current.id);
    }
  }

  handleSubmit = () => {
    const userId = this.props.current.id;
    const identifyAs = this.state.checkIdentifyMale ? 'male' : 'female';
    const seeking = this.state.checkSeekingMale ? 'male' : 'female';
    const blurb = this.state.blurb;
    const neighborhood = this.state.neighborhood;
    const birthday = this.state.birthday;
    this.props.handleIdentifySeeking(
      userId,
      blurb,
      neighborhood,
      birthday,
      identifyAs,
      seeking
    );
    this.props.navigation.navigate('SingleUser');
  };

  render() {
    const {
      rowContainer,
      container,
      txt,
      btn,
      headText,
      subText,
      checkbox,
    } = styles;
    const info = this.props.otherinfo;
    const boolValMale = this.state.checkIdentifyMale;
    const boolValFemale = this.state.checkIdentifyFemale;

    const boolSeekMale = this.state.checkSeekingMale;
    const boolSeekFemale = this.state.checkSeekingFemale;

    return (
      <View style={container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage} />
        <View style={txt}>
          <Text style={headText}>USER DETAILS + SETTINGS</Text>
          <Text style={subText}>Deposit: ${this.props.deposit}</Text>
          <FormLabel>blurb</FormLabel>
          <FormInput
            placeholder="write your blurb! make it fun!"
            onChangeText={blurb =>
              this.setState({
                blurb,
              })
            }
            value={info.blurb}
          />
          <FormLabel>neighborhood</FormLabel>
          <FormInput
            placeholder="neighborhood"
            onChangeText={neighborhood =>
              this.setState({
                neighborhood,
              })
            }
            value={info.neighborhood}
          />
          <FormLabel>birthday</FormLabel>
          <FormInput
            placeholder="birthday"
            onChangeText={birthday =>
              this.setState({
                birthday,
              })
            }
            value={info.birthday}
          />
          <FormLabel>I am: </FormLabel>
          <View style={rowContainer}>
            <CheckBox
              title="male"
              size={12}
              checked={boolValMale}
              style={checkbox}
              onPress={() =>
                this.setState({
                  checkIdentifyMale: !boolValMale,
                })
              }
            />

            <CheckBox
              title="female"
              size={12}
              checked={boolValFemale}
              onPress={() =>
                this.setState({
                  checkIdentifyFemale: !boolValFemale,
                })
              }
            />
          </View>
          <FormLabel>I am seeking: </FormLabel>
          <View style={rowContainer}>
            <CheckBox
              title="male"
              size={12}
              checked={boolSeekMale}
              onPress={() =>
                this.setState({
                  checkSeekingMale: !boolSeekMale,
                })
              }
            />

            <CheckBox
              title="female"
              size={12}
              checked={boolSeekFemale}
              onPress={() =>
                this.setState({
                  checkSeekingFemale: !boolSeekFemale,
                })
              }
            />
          </View>
          <FormLabel>Select charity for donation: </FormLabel>
          <Text style={{ flex: 1, fontSize: 15, alignSelf: 'auto' }}>
            {' '}
            {this.state.charity}
          </Text>
          <Picker
            size={20}
            selectedValue={this.state.charity}
            onValueChange={this.updateCharity}
            style={{ flex: 1, alignContent: 'flex-start' }}
            itemStyle={{ height: 44, alignItems: 'flex-start', fontSize: 18 }}
          >
            <Picker.Item
              label="Planned Parenthood"
              value="Planned Parenthood"
            />
            <Picker.Item
              label="Doctors Without Borders"
              value="Doctors Without Borders"
            />
            <Picker.Item
              label="Habitat for Humanity"
              value="Habitat for Humanity"
            />
            <Picker.Item label="Goodwill" value="Goodwill" />
          </Picker>
          <View style={btn}>
            <Button
              small
              title="~all done~"
              onPress={() => {
                this.handleSubmit();
              }}
            />
          </View>{' '}
        </View>
      </View>
    );
  }
}

const mapState = state => {
  return {
    current: state.users.current,
    deposit: state.users.deposit,
    otherinfo: state.users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchCurrentUser()),
    fetchOtherInfo: userId => dispatch(fetchingOtherInfo(userId)),
    handleIdentifySeeking: (
      userId,
      blurb,
      neighborhood,
      birthday,
      identifyAs,
      seeking
    ) =>
      dispatch(
        updateIdentifySeeking(
          userId,
          blurb,
          neighborhood,
          birthday,
          identifyAs,
          seeking
        )
      ),
  };
};

export default connect(
  mapState,
  mapDispatchToProps
)(EditDetail);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  txt: {
    width: 350,
    position: 'absolute',
    top: 35,
    height: 250,
    zIndex: 1,
  },
  btn: {
    width: 200,
    height: 70,
    padding: 10,
    position: 'absolute',
    top: 480,
    zIndex: 2,
    borderWidth: 0,
    borderRadius: 5,
    left: 50,
  },
  headText: {
    fontFamily: 'Arial Rounded MT Bold',
    fontSize: 17,
    left: 70,
  },
  subText: {
    top: 10,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    left: 140,
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: 'red',
  },
});
