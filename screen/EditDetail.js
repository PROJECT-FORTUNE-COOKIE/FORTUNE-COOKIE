import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, Picker } from 'react-native';
import { Button, FormLabel, FormInput, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  fetchCurrentUser,
  fetchingOtherInfo,
  updateIdentifySeeking,
} from './store/userReducer';

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
    this.updateCharity = this.updateCharity.bind(this)
  }

  updateCharity = (charity) => {
    this.setState({ charity: charity })
 }

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
    const { rowContainer } = styles;
    const info = this.props.otherinfo;
    const boolValMale = this.state.checkIdentifyMale;
    const boolValFemale = this.state.checkIdentifyFemale;

    const boolSeekMale = this.state.checkSeekingMale;
    const boolSeekFemale = this.state.checkSeekingFemale;

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
        <CheckBox
          title="male"
          checked={boolValMale}
          onPress={() =>
            this.setState({
              checkIdentifyMale: !boolValMale,
            })
          }
        />

        <CheckBox
          title="female"
          checked={boolValFemale}
          onPress={() =>
            this.setState({
              checkIdentifyFemale: !boolValFemale,
            })
          }
        />

        <FormLabel>I am seeking: </FormLabel>
        <CheckBox
          title="male"
          checked={boolSeekMale}
          onPress={() =>
            this.setState({
              checkSeekingMale: !boolSeekMale,
            })
          }
        />

        <CheckBox
          title="female"
          checked={boolSeekFemale}
          onPress={() =>
            this.setState({
              checkSeekingFemale: !boolSeekFemale,
            })
          }
        />
        <View>
        <FormLabel>Select charity for donation: </FormLabel>

        <Text style={{flex: 1, fontSize: 18, alignSelf: 'auto' }}>     {this.state.charity}
        </Text>
            <Picker selectedValue = {this.state.charity} onValueChange = {this.updateCharity}
            style={{flex: 1, alignContent: 'flex-start'}} itemStyle={{height: 44, alignItems: 'flex-start', fontSize: 18}}>
               <Picker.Item label = "Planned Parenthood" value = "Planned Parenthood" />
               <Picker.Item label = "Doctors Without Borders" value = "Doctors Without Borders" />
               <Picker.Item label = "Habitat for Humanity" value = "Habitat for Humanity" />
               <Picker.Item label = "Goodwill" value = "Goodwill" />
            </Picker>

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
  }
});
