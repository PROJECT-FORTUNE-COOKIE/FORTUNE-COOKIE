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
import Geolocation from '../screen/Geolocation';
import MatchesList from '../screen/MatchesList';
import EditDetail from '../screen/EditDetail';
import ChatWithMatch from '../screen/ChatWithMatch';
import PayDeposit from '../screen/PayDeposit';

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

  CameraAR: {
    screen: CameraAR,
    navigationOptions: {
      tabLabel: 'CameraAR',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="camera" type="feather" color={tintColor} />
      ),
    },
  },

  PayDeposit: {
    screen: PayDeposit,
    navigationOptions: {
      tabLabel: 'PayDeposit',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="attach-money" type="FontAwesome5" color={tintColor} />
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
  EditDetail: {
    screen: EditDetail,
  },
  UserSetting: {
    screen: UserSetting,
  },
  ChatWithMatch: {
    screen: ChatWithMatch,
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
