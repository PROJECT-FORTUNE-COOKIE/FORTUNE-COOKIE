import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { Icon } from 'react-native-elements';
import SingleUser from '../screen/SingleUser';
import LogIn from '../screen/LogIn';
import SignUp from '../screen/SignUp';
import AllUsers from '../screen/AllUsers';
import SelectedMatches from '../screen/SelectedMatches';
import UserSetting from '../screen/UserSetting';
import EditDetail from '../screen/EditDetail';

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
  SeletedMatches: {
    screen: SelectedMatches,
    navigationOptions: {
      tabLabel: 'Matched',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="heart" type="feather" color={tintColor} />
      ),
    },
  },
  GEO: {
    screen: AllUsers, //<<<<<------need to changed later on
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
