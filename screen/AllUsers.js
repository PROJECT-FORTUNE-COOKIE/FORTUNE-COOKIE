import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchAllUsers } from './store/userReducer';

class AllUsers extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     users: []
  //   };
  // }

  componentDidMount() {
    this.props.allUsers();
  }

  render() {
    console.log(this.props.allUsers, 'users from firebase>>>>>>> ');
    // const users = this.state.users;
    return (
      <ScrollView>
        <List>
          <Text>list of all Users</Text>
          {/* {users.map(user => (
            <ListItem
              key={user.birthday}
              roundAvatar
              // avatar={{ uri: user.image[0] }}
              title={`${user.name} `}
              subtitle={user.neighborhood}
              // onPress={() => this.onLearnMore(user)}
            />
          ))} */}
        </List>
      </ScrollView>
    );
  }
}

// const mapState = state => {
//   console.log('-----------state from all user', state);
//   return {
//     allUsers: state.allUsers
//   };
// };

const mapDispatch = dispatch => {
  return {
    allUsers: () => dispatch(fetchAllUsers())
  };
};

export default connect(
  null,
  mapDispatch
)(AllUsers);
