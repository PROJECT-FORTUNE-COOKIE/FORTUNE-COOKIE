// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up tart working on your app!</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// });

import React, { Component } from 'react';
import RootRoute from './navigation/router';
import { Provider } from 'react-redux';
import store from './screen/store';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootRoute />
      </Provider>
    );
  }
}
