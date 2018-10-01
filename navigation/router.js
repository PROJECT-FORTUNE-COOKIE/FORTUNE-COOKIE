import React, { Component } from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { Icon } from 'react-native-elements';
import SingleUser from '../screen/SingleUser';
import LogIn from '../screen/LogIn';
import SignUp from '../screen/SignUp';
import AllUsers from '../screen/AllUsers';
import CameraAR from '../screen/CameraAR';
import UserSetting from '../screen/UserSetting';
import Geolocation from '../screen/Chat';
import Chat from '../screen/Chat';
import MatchesList from '../screen/MatchesList';
import EditDetail from '../screen/EditDetail';

//----------route testing --------------
import { connect } from 'react-redux';
import { fetchAllUsers } from '../screen/store/userReducer';
//--------------------------------------
export const MenuTab = createBottomTabNavigator({
  SingleUser: {
    screen: SingleUser,
    navigationOptions: {
      tabLabel: 'Me',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="star" type="feather" color={tintColor} />
      ),
    },
  },

  AllUsers: {
    screen: AllUsers,
    navigationOptions: {
      tabLabel: 'All user',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="search" type="feather" color={tintColor} />
      ),
    },
  },

  MatchesList: {
    screen: MatchesList,
    navigationOptions: {
      tabLabel: 'MatchesList',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="align-justify" type="feather" color={tintColor} />
      ),
    },
  },

  Chat: {
    screen: Chat,
    navigationOptions: {
      tabLabel: 'Chat',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="message-circle" type="feather" color={tintColor} />
      ),
    },
  },

  CameraAR: {
    screen: CameraAR,
    navigationOptions: {
      tabLabel: 'CameraAR',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="camera" type="feather" color={tintColor} />
      ),
    },
  },
  GEO: {
    screen: Geolocation,
    navigationOptions: {
      tabLabel: 'GEO',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="compass" type="feather" color={tintColor} />
      ),
    },
  },
  UserSetting: {
    screen: UserSetting,
    navigationOptions: {
      tabLabel: 'UserSetting',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="plus" type="feather" color={tintColor} />
      ),
    },
  },
  // FaceTime: {
  //   screen: FaceTime,
  //   navigationOptions: {
  //     tabLabel: 'FaceTime',
  //     tabBarIcon: ({ tintColor }) => (
  //       <Icon name="sunrise" type="feather" color={tintColor} />
  //     ),
  //   },
  // },
  // EditDetail: {
  //   screen: EditDetail,
  //   navigationOptions: {
  //     tabLabel: 'EditDetail',
  //     tabBarIcon: ({ tintColor }) => (
  //       <Icon name="wind" type="feather" color={tintColor} />
  //     ),
  //   },
  // },
});

export const Root = createStackNavigator({
  LogIn: {
    screen: LogIn,
  },
  SingleUser: {
    screen: MenuTab,
  },
  SignUp: {
    screen: SignUp,
  },
});

class RootRoute extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    return <Root />;
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(fetchAllUsers());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default connect(
  null,
  mapDispatch
)(RootRoute);
