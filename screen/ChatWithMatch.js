import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';

class ChatWithMatch extends Component {
  componentDidMount() {}

  // onSend(messages = []) {
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, messages),
  //   }));
  // }

  render() {
    console.log('STATE---THIS.PROPS: ', this.props);

    return (
      <GiftedChat
        messages={this.props.selectedMessages}
        // onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

const mapState = state => {
  return {
    current: state.users.current,
    selectedMatch: state.users.selectedMatch,
    //selectedMessages: state.users.selectedMessages,
    selectedMessages: [
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello developer2',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: 'GOODBYE',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ],
    newMessage: {},
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapState,
  mapDispatchToProps
)(ChatWithMatch);
