import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createContext, useContext, useState} from 'react';
import {Login} from '../../screens/login/Login';
import {Cadastro} from '../../screens/login/Cadastro';
const LoginContext = createContext(null);

type ILoginContext = {
  login?: ILogin;
  setLogin: Function;
};

type ILogin = {
  email: string;
  nome: string;
  senha: string;
};
const Stack = createNativeStackNavigator();

export const LoginStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
};
export const LoginContextContainer = ({children}: any) => {
  const [login, setLogin] = useState(false);
  return (
    <LoginContext.Provider value={{login, setLogin}}>
      {login ? children : <LoginStack />}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const loginContext = useContext(LoginContext);
  return loginContext as unknown as ILoginContext;
};
