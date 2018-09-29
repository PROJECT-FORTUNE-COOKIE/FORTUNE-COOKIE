import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import firebase from 'firebase';

export default class SingleUser extends Component {
  render() {
    const { container, rowContainer } = styles;
    return (
      <View style={container}>
        <View>
          <Avatar
            xlarge
            rounded
            title="FC"
            onPress={() => console.log('Works!')}
            activeOpacity={0.7}
          />
        </View>
        <View style={rowContainer}>
          <Icon
            reverse
            name="edit"
            type="feather"
            onPress={() => console.log('Works!')}
          />
          <Icon
            reverse
            name="settings"
            type="feather"
            onPress={() => console.log('Works!')}
          />
        </View>
        <View>
          <Text>SingleUser Detail </Text>
          <Text>-- view detail </Text>
          <Text>-- button to go checkout matches </Text>
          <Text>-- button to change personal settings</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 65,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
    padding: 60,
  },
});
