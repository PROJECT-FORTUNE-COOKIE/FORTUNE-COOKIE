import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import SwipeCards from './SwipeCards';

class AllUsers extends Component {
  render() {
const users = this.props.users;
const current = this.props.current;
const newMatchData = this.props.newMatchData;
    return (
      // <ScrollView>
      //   <List>
      //     {users.map(user => (
      //       <ListItem
      //         key={user.birthday}
      //         roundAvatar
      //         // avatar={{ uri: user.image[0] }}
      //         title={`${user.name} `}
      //         subtitle={user.neighborhood}
      //         // onPress={() => this.onLearnMore(user)}
      //       />
      //     ))}
      //   </List>
      // </ScrollView>

      <SwipeCards users={users} current={current} newMatchData = {newMatchData} />
    );
  }
}

const mapState = state => {
  return {
    users: state.users.all,
    current: state.users.current,
    newMatchData: state.users.newMatchData
  };
};

export default connect(mapState)(AllUsers);
