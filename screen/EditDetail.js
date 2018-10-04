import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Icon,
  FormLabel,
  FormInput,
  CheckBox,
  FormValidationMessage
} from 'react-native-elements';

class EditDetail extends Component {
  constructor() {
    super();
    this.state = {
      blurb: '',
      neighborhood: '',
      identifyAs: '',
      seeking: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.update(this.state);
  };

  render() {
    const { rowContainer } = styles;
    return (
      <ScrollView>
        <FormLabel>blurb</FormLabel>
        <FormInput placeholder="enter blurb?" />

        <FormLabel>neighborhood</FormLabel>
        <FormInput placeholder="my neighborhood" />

        <View style={rowContainer}>
          <Text>Identify As: </Text>
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
          <Text>Interest In: </Text>
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

export default EditDetail;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around'
  }
});
