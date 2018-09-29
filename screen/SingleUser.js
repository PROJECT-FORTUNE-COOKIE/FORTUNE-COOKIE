import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';

export default class SingleUser extends Component {
  render() {
    const { container } = styles;
    return (
      <ScrollView>
        <View style={container}>
          <View style={{ flex: 3 }}>
            <Avatar
              xlarge
              rounded
              title="FC"
              onPress={() => console.log('Works!')}
              activeOpacity={0.7}
            />
          </View>
          <View style={{ flex: 2, flexDirection: 'row' }}>
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
          <View style={{ flex: 1 }}>
            <Text>SingleUser Detail </Text>
            <Text>-- view detail </Text>
            <Text>-- button to go checkout matches </Text>
            <Text>-- button to change personal settings</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
