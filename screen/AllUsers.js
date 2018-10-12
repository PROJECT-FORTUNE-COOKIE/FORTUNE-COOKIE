import React, { Component } from 'react';
import { connect } from 'react-redux';
import SwipeCards from './SwipeCards';

class AllUsers extends Component {
  render() {
    const all = this.props.all;
    const current = this.props.current;

    let result = all.filter(user => {
      let currentId = current.id;
      currentId.toString();
      return user.acceptedMatches.indexOf(currentId) === -1;
    });

    return <SwipeCards all={result} current={current} />;
  }
}

const mapState = state => {
  const id = state.users.current.id;
  return {
    all: state.users.all.filter(user => {
      return id !== user.id;
    }),
    current: state.users.current
  };
};

export default connect(mapState)(AllUsers);
