import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import firebase from 'firebase';
import {
  Slider,
  List,
  ListItem,
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements';

class EditDetail extends Component {
  render() {
    return (
      <ScrollView>
        <FormLabel>Name</FormLabel>
        <FormInput onChangeText={someFunction} />
        <FormValidationMessage>Error message</FormValidationMessage>

        <FormLabel>Location</FormLabel>
        <FormInput onChangeText={someFunction} />
        <FormValidationMessage>Error message</FormValidationMessage>

        <FormLabel>About Me</FormLabel>
        <FormInput onChangeText={someFunction} />
        <FormValidationMessage>Error message</FormValidationMessage>

        <View
          style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}
        >
          {/* User Preference, -> lucky cookie's age, gender ...etc */}
          <Slider
            value={this.state.value}
            onValueChange={value => this.setState({ value })}
          />
          <Text>Value: {this.state.value}</Text>
        </View>
      </ScrollView>
    );
  }
}

export default EditDetail;
