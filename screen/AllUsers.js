import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

class AllUsers extends Component {
  render() {
    const users = this.props.users;
    return (
      <ScrollView>
        <List>
          {users.map(user => (
            <ListItem
              key={user.birthday}
              roundAvatar
              // avatar={{ uri: user.image[0] }}
              title={`${user.name} `}
              subtitle={user.neighborhood}
              // onPress={() => this.onLearnMore(user)}
            />
          ))}
        </List>
      </ScrollView>
    );
  }
}

const mapState = state => {
  return {
    users: state.users.all
  };
};

export default connect(mapState)(AllUsers);
