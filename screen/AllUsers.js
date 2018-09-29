import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
//-----------------settings for firebase----------------
import { firebaseConfig } from '../secret';
const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
//----------------end of setting for firebase ------------

class AllUsers extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
  // function navigate to selected matches
  // onLearnMore = (user) => {
  //   this.props.navigation.navigate('Details', { ...user });
  // };

  componentDidMount() {
    db.collection('Users')
      .get()
      .then(querySnapshot => {
        let datas = [];
        querySnapshot.forEach(doc => {
          datas.push(doc.data());
        });
        this.setState({
          users: datas
        });
      });
  }

  render() {
    console.log(this.state.users, 'users from firebase ');
    const users = this.state.users;
    return (
      <ScrollView>
        <List>
          <Text>list of all Users</Text>
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

export default AllUsers;
