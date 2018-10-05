import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Icon,
  FormLabel,
  FormInput,
  CheckBox,
  FormValidationMessage,
} from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchCurrentUser } from './store/userReducer';

class EditDetail extends Component {
  constructor() {
    super();
    // this.state = {
    //   blurb: '',
    //   neighborhood: '',
    //   identifyAs: '',
    //   seeking: '',
    // };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    //event.preventDefault();
    //this.props.update(this.state);
    this.props.navigation.navigate('SingleUser');
  };

  render() {
    const { rowContainer } = styles;
    console.log('THIS>PROPS>>>>>>>>>: ', this.props);
    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>USER DETAILS + SETTINGS</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          {/* <Text>Deposit: ${this.props.current.deposit}</Text> */}
        </View>

        <FormLabel>blurb</FormLabel>
        <FormInput placeholder="write you blurb! make it fun!" />

        <FormLabel>neighborhood</FormLabel>
        <FormInput placeholder="neighborhood" />

        <FormLabel>birthday</FormLabel>
        <FormInput placeholder="birthday" />

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
          <Icon
            name="check-circle"
            type="feather"
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchCurrentUser()),
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
