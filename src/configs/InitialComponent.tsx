import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Categorias} from '../screens/Categorias';
import {Lista} from '../screens/Lista';
import {MaisVotados} from '../screens/MaisVotados';
import {Criar} from '../screens/Criar';
import {Perfil} from '../screens/Perfil';
import {colors} from './layout';
import {Text} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styled from 'styled-components/native';
import {LoginContextContainer} from './hooks/useLogin';

const ButtonTab = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.focused ? colors.white100 : 'transparent'};
  padding: 10px;
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
  background-color: ${colors.white100};
  border-radius: 50px;

  width: 95px;
  height: 95px;
  position: absolute;
  top: -30px;
  border: 3px solid ${colors.porple100};
`;

const Tab = createBottomTabNavigator();
const TabConfigs = () => {
  const INITIAL_ROUTE = '+';
  const icon = <FontAwesome5 name={'comments'} />;
  return (
    <Tab.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 5,
          right: 5,
          elevation: 0,
          backgroundColor: colors.black100,
          borderRadius: 15,
          height: 90,
        },
      }}>
      <Tab.Screen
        name="Caregorias"
        component={Categorias}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTab focused={focused}>
              <FontAwesome5 name={'cubes'} size={30} color={colors.porple100} />
            </ButtonTab>
          ),
        }}
      />
      <Tab.Screen
        name="Lista"
        component={Lista}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTab focused={focused}>
              <FontAwesome5 name={'list'} size={30} color={colors.porple100} />
            </ButtonTab>
          ),
        }}
      />
      <Tab.Screen
        name="+"
        component={MaisVotados}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTabPrincipal>
              <FontAwesome5
                name={'check-double'}
                size={30}
                color={colors.porple100}
              />
            </ButtonTabPrincipal>
          ),
        }}
      />
      <Tab.Screen
        name="Criar"
        component={Criar}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTab focused={focused}>
              <FontAwesome5 name={'plus'} size={30} color={colors.porple100} />
            </ButtonTab>
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({focused}) => (
            <ButtonTab focused={focused}>
              <FontAwesome5 name={'user'} size={30} color={colors.porple100} />
            </ButtonTab>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const NavigationConfigs = ({children}: any) => {
  return <NavigationContainer>{children}</NavigationContainer>;
};

const TabNavigation = () => {
  return (
    <NavigationConfigs>
      <LoginContextContainer>
        <TabConfigs />
      </LoginContextContainer>
    </NavigationConfigs>
  );
};

export const InitialComponent = () => {
  return <TabNavigation />;
};
