import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';

class AllUsers extends Component {
  // function navigate to selected matches
  // onLearnMore = (user) => {
  //   this.props.navigation.navigate('Details', { ...user });
  // };

  render() {
    return (
      <ScrollView>
        <List>
          <Text>list of all Users</Text>
          {/* {users.map((user) => (
            <ListItem
              key={user.login.username}
              roundAvatar
              avatar={{ uri: user.picture.thumbnail }}
              title={`${user.name.first.toUpperCase()} ${user.name.last.toUpperCase()}`}
              subtitle={user.email}
              onPress={() => this.onLearnMore(user)}
            />
          ))} */}
        </List>
      </ScrollView>
    );
  }
}

export default AllUsers;
