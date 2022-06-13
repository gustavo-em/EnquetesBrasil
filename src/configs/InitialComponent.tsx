import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {LoginContextContainer} from './hooks/useLogin';
import {TabConfigs} from './Tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Poll} from '../screens/Poll';
import {KeyboardAvoidingView, StatusBar} from 'react-native';
import {colors} from './layout';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const NavigationConfigs = ({children}: any) => {
  return <NavigationContainer>{children}</NavigationContainer>;
};

const TabNavigation = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.white100} barStyle="dark-content" />
      <NavigationConfigs>
        <LoginContextContainer>
          <TabConfigs />
        </LoginContextContainer>
      </NavigationConfigs>
    </>
  );
};

export const InitialComponent = () => {
  return (
    <>
      <SafeAreaProvider>
        <TabNavigation />
      </SafeAreaProvider>
    </>
  );
};
