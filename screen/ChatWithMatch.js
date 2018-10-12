import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';
import {
  fetchingMatchMessages,
  fetchingUserMessages,
  addingNewMessageToServer
} from './store/userReducer';

class ChatWithMatch extends Component {
  componentDidMount() {
    const userId = this.props.current.id;
    const matchId = this.props.selectedMatch.id;
    this.props.fetchMatchMessages(userId, matchId);
    this.props.fetchUserMessages(userId, matchId);
  }

  onSend(message, userId, matchId, userName) {
    this.props.addMessageToServer(message, userId, matchId, userName);
  }

  render() {
    let userName = this.props.current.name;
    let matchId = this.props.selectedMatch.id;

    let messagesToMatch = this.props.messagesToMatch;
    let messagesToUser = this.props.messagesToUser;
    let allMessages = messagesToMatch.concat(messagesToUser);
    allMessages = allMessages.sort(function(a, b) {
      a = new Date(a.createdAt);
      b = new Date(b.createdAt);
      return a > b ? -1 : a < b ? 1 : 0;
    });

    let userObj = {
      _id: this.props.current.id,
      avatar: this.props.current.icon
    };

    return (
      <GiftedChat
        messages={allMessages}
        onSend={message => this.onSend(message, userObj, matchId, userName)}
        user={userObj}
      />
    );
  }
}

const mapState = state => {
  return {
    current: state.users.current,
    selectedMatch: state.users.selectedMatch,
    newMessage: {},
    messagesToMatch: state.users.messagesToMatch,
    messagesToUser: state.users.messagesToUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMatchMessages: (userId, matchId) => {
      dispatch(fetchingMatchMessages(userId, matchId));
    },
    fetchUserMessages: (userId, matchId) => {
      dispatch(fetchingUserMessages(userId, matchId));
    },
    addMessageToServer: (message, userId, matchId, userName) => {
      dispatch(addingNewMessageToServer(message, userId, matchId, userName));
    }
  };
};

export default connect(
  mapState,
  mapDispatchToProps
)(ChatWithMatch);
