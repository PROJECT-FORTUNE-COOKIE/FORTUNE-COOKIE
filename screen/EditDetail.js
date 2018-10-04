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
  Button,
} from 'react-native-elements';

class EditDetail extends Component {
  render() {
    const { rowContainer } = styles;
    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>USER DETAILS + SETTINGS</Text>
        </View>

        <FormLabel>blurb</FormLabel>
        <FormInput placeholder="write you blurb! make it fun!" />

        <FormLabel>neighborhood</FormLabel>
        <FormInput placeholder="neighborhood" />

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
          <Icon reverse name="check-circle" type="feather" />
        </View>
      </ScrollView>
    );
  }
}

export default EditDetail;

// const mapState = state => {
//   return {
//     current: state.users.current,

//     },
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {};
// };

// export default connect(
//   mapState,
//   mapDispatchToProps
// )(EditDetail);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
  },
});
