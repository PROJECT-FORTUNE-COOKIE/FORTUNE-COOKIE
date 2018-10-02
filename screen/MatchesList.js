import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchAllMatches } from './store/userReducer';

class MatchesList extends Component {
  componentDidMount() {
    console.log('state in MatchesList component: ', this.props);
    const userId = this.props.users.current.userId;
    this.props.fetchMatches(userId);
  }

  render() {
    const matches = this.props.users.matches;

    if (matches === null) {
      return (
        <View>
          <Text>One moment please...</Text>
        </View>
      );
    }

    return (
      <ScrollView>
        <List>
          {matches.length &&
            matches.map(match => (
              <ListItem
                key={match.id}
                roundAvatar
                avatar={{ uri: user.images[0] }}
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
    users: state.users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMatches: userId => dispatch(fetchAllMatches(userId)),
  };
};

export default connect(
  mapState,
  mapDispatchToProps
)(MatchesList);