import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  CheckBox,
  FormValidationMessage
} from 'react-native-elements';
import { connect } from 'react-redux';
import {
  fetchCurrentUser,
  changingBlurb,
  changingBirthday,
  changingNeighborhood,
  fetchingOtherInfo,
  updateIdentifyAs
} from './store/userReducer';

class EditDetail extends Component {
  constructor() {
    super();
    this.state = {
      checkIdentifyMale: false,
      checkIdentifyFemale: false,
      checkSeekingMale: false,
      checkSeekingFemale: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser();
    if (this.props.current.id) {
      this.props.fetchOtherInfo(this.props.current.id);
    }
  }

  handleSubmit = () => {
    this.props.navigation.navigate('WelcomePage');
  };

  render() {
    const { rowContainer } = styles;
    const userId = this.props.current.id;
    const info = this.props.otherinfo;
    const boolValMale = this.state.checkIdentifyMale;
    const boolValFemale = this.state.checkIdentifyFemale;

    const boolSeekMale = this.state.checkSeekingMale;
    const boolSeekFemale = this.state.checkSeekingFemale;

    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 30 }}>USER DETAILS + SETTINGS</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>Deposit: ${this.props.deposit}</Text>
        </View>

        <FormLabel>blurb</FormLabel>
        <FormInput
          placeholder="write your blurb! make it fun!"
          onChangeText={blurb => this.props.changeBlurb(blurb, userId)}
          value={info.blurb}
        />

        <FormLabel>neighborhood</FormLabel>
        <FormInput
          placeholder="neighborhood"
          onChangeText={neighborhood =>
            this.props.changeNeighborhood(neighborhood, userId)
          }
          value={info.neighborhood}
        />

        <FormLabel>birthday</FormLabel>
        <FormInput
          placeholder="birthday"
          onChangeText={birthday => this.props.changeBirthday(birthday, userId)}
          value={info.birthday}
        />

        <FormLabel>I am: </FormLabel>
        <CheckBox
          title="male"
          checked={boolValMale}
          onPress={() =>
            this.setState({
              checkIdentifyMale: !boolValMale
            })
          }
        />

        <CheckBox
          title="female"
          checked={boolValFemale}
          onPress={() =>
            this.setState({
              checkIdentifyFemale: !boolValFemale
            })
          }
        />

        <FormLabel>I am seeking: </FormLabel>
        <CheckBox
          title="male"
          checked={boolSeekMale}
          onPress={() =>
            this.setState({
              checkSeekingMale: !boolSeekMale
            })
          }
        />

        <CheckBox
          title="female"
          checked={boolSeekFemale}
          onPress={() =>
            this.setState({
              checkSeekingFemale: !boolSeekFemale
            })
          }
        />

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button
            small
            title="~all done~"
            onPress={() => {
              this.handleSubmit();
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapState = state => {
  return {
    current: state.users.current,
    deposit: state.users.deposit,
    otherinfo: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchCurrentUser()),
    //fetchDeposit: () => dispatch(fetchDeposit())
    fetchOtherInfo: userId => dispatch(fetchingOtherInfo(userId)),
    changeBlurb: (blurb, userId) => dispatch(changingBlurb(blurb, userId)),
    changeNeighborhood: (neighborhood, userId) =>
      dispatch(changingNeighborhood(neighborhood, userId)),
    changeBirthday: (birthday, userId) =>
      dispatch(changingBirthday(birthday, userId)),
    handleIdentifyChange: (userId, checkValue, gender) =>
      dispatch(updateIdentifyAs(userId, checkValue, gender))
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
    alignContent: 'space-around'
  }
});
