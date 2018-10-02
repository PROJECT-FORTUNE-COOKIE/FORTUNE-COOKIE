import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchAllMatches } from './store/userReducer';

class MatchesList extends Component {
  componentDidMount() {
    const userId = this.props.current.id;
    console.log('userId: ', userId);
    this.props.fetchMatches(userId);
  }

  render() {
    const matches = this.props.matches;
    console.log(
      'state: ----------------------------------------------------------------------- ',
      matches
    );
    // return (
    //   <View>
    //     <Text>One moment please...</Text>
    //   </View>
    // );

    return (
      <ScrollView>
        <List>
          {matches.length &&
            matches.map(match => (
              <ListItem
                key={match.id}
                roundAvatar
                avatar={{ uri: match.images[0] }}
                title={`${match.name} `}
                subtitle={match.neighborhood}
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
    current: state.users.current,
    matches: state.users.matches,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMatches: userId => {
      dispatch(fetchAllMatches(userId));
    },
  };
};

export default connect(
  mapState,
  mapDispatchToProps
)(MatchesList);
