/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
// import {Navigation} from 'react-native-navigation';
// import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

// Navigation.registerComponent('com.myApp.WelcomeScreen', () =>
//   gestureHandlerRootHOC(App),
// );

const Root = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <App />
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => Root);
