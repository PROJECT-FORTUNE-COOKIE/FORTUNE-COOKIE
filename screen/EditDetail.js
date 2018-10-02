import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import {
  Slider,
  Icon,
  List,
  ListItem,
  FormLabel,
  FormInput,
  CheckBox,
  FormValidationMessage,
  Button
} from 'react-native-elements';

class EditDetail extends Component {
  render() {
    const { rowContainer } = styles;
    return (
      <ScrollView>
        <FormLabel>blurb</FormLabel>
        <FormInput placeholder="enter blurb?" />

        <FormLabel>neighborhood</FormLabel>
        <FormInput placeholder="my neighborhood" />

        <View style={rowContainer}>
          <Text>Gender: </Text>
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
          <Icon reverse name="check-circle" type="feather" />
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
