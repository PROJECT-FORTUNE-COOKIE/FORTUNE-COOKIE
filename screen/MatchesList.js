import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchAllMatches, getSelectedMatch } from './store/userReducer';

class MatchesList extends Component {
  componentDidMount() {
    const userId = this.props.current.id;
    console.log('userId: ', userId);
    this.props.fetchMatches(userId);
    this.chatWith = this.chatWith.bind(this);
  }

  chatWith(matchId) {
    this.props.setSelectedMatch(matchId);
    this.props.navigation.navigate('ChatWithMatch');
  }

  render() {
    const matches = this.props.matches;
    //console.log('state: ----- ', matches);

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
                onPress={() => this.chatWith(match.id)}
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
    setSelectedMatch: matchId => {
      dispatch(getSelectedMatch(matchId));
    },
  };
};

export default connect(
  mapState,
  mapDispatchToProps
)(MatchesList);
