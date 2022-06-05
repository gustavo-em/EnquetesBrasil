import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {Text, View} from 'react-native';
import {Categorias} from '../screens/Categorias';
import {Lista} from '../screens/Lista';
import {MaisVotados} from '../screens/MaisVotados';
import {Criar} from '../screens/Criar';
import {Perfil} from '../screens/Perfil';
const Tab = createBottomTabNavigator();

const NavigationConfigs = ({children}: any) => {
  return <NavigationContainer>{children}</NavigationContainer>;
};

const TabConfigs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Caregorias" component={Categorias} />
      <Tab.Screen name="Lista" component={Lista} />
      <Tab.Screen name="+" component={MaisVotados} />
      <Tab.Screen name="Criar" component={Criar} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
};

const TabNavigation = () => {
  return (
    <NavigationConfigs>
      <TabConfigs />
    </NavigationConfigs>
  );
};

export const InitialComponent = () => {
  return <TabNavigation />;
};
