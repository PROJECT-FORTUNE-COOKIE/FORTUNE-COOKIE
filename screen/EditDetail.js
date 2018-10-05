import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  CheckBox,
  FormValidationMessage,
} from 'react-native-elements';
import { connect } from 'react-redux';
import {
  fetchCurrentUser,
  changingBlurb,
  changingBirthday,
  changingNeighborhood,
  fetchingOtherInfo,
} from './store/userReducer';

class EditDetail extends Component {
  constructor() {
    super();
    //this.handleChange = this.handleChange.bind(this);
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
    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>USER DETAILS + SETTINGS</Text>
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

        <View style={rowContainer}>
          <Text>I identify as: </Text>
          <CheckBox
            center
            title="male"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            // checked={this.state.checked}
          />
          <CheckBox
            center
            title="female"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            // checked={this.state.checked}
          />
        </View>

        <View style={rowContainer}>
          <Text>I am interested in: </Text>
          <CheckBox
            center
            title="male"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            // checked={this.state.checked}
          />
          <CheckBox
            center
            title="female"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            // checked={this.state.checked}
          />
        </View>

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

//export default EditDetail;

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
    //fetchDeposit: () => dispatch(fetchDeposit())
    fetchOtherInfo: userId => dispatch(fetchingOtherInfo(userId)),
    changeBlurb: (blurb, userId) => dispatch(changingBlurb(blurb, userId)),
    changeNeighborhood: (neighborhood, userId) =>
      dispatch(changingNeighborhood(neighborhood, userId)),
    changeBirthday: (birthday, userId) =>
      dispatch(changingBirthday(birthday, userId)),
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
});
