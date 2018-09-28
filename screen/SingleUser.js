import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Tile, List, ListItem, Button, Avatar } from 'react-native-elements';

class SingleUser extends Component {
  render() {
    return (
      <ScrollView>
        <Avatar
          xlarge
          rounded
          title="CR"
          onPress={() => console.log('Works!')}
          activeOpacity={0.7}
        />
        <Text>SingleUser Detail </Text>
        <Text>-- view detail </Text>
        <Text>-- button to go checkout matches </Text>
        <Text>-- button to change personal settings</Text>
      </ScrollView>
    );
  }
}

export default SingleUser;
