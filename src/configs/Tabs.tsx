import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {colors, colorsOfProject} from './layout';
import styled from 'styled-components/native';
import {Lista} from '../screens/Lista';
import {MaisVotados} from '../screens/MaisVotados';

import {Perfil} from '../screens/Perfil';

const ButtonTab = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.focused ? colorsOfProject.secundary : 'transparent'};
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  border-radius: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
`;

const ButtonTabPrincipal = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colorsOfProject.secundary};
  border-radius: 50px;

  width: 95px;
  height: 95px;
  position: absolute;
  top: -30px;
  border: ${props => (props.focused ? '7px' : '3px')} solid
    ${colorsOfProject.primary};
`;

const Tab = createBottomTabNavigator();
export const TabConfigs = () => {
  const INITIAL_ROUTE = 'Lista';
  return (
    <Tab.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 5,
          left: 5,
          right: 5,
          elevation: 0,
          backgroundColor: 'transparent',
          borderRadius: 15,
          height: 90,
          borderColor: 'transparent',
        },
      }}>
      <Tab.Screen
        name="+"
        component={MaisVotados}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTab focused={focused}>
              <FontAwesome5
                name={'star'}
                size={30}
                color={colorsOfProject.primary}
              />
            </ButtonTab>
          ),
        }}
      />
      <Tab.Screen
        name="Lista"
        component={Lista}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTabPrincipal focused={focused}>
              <FontAwesome5
                name={'list'}
                size={30}
                color={colorsOfProject.primary}
              />
            </ButtonTabPrincipal>
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTab focused={focused}>
              <FontAwesome5
                name={'user'}
                size={30}
                color={colorsOfProject.primary}
              />
            </ButtonTab>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
