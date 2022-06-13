import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createContext, useContext, useState} from 'react';
import {Login} from '../../screens/login/Login';
import {Cadastro} from '../../screens/login/Cadastro';
import {KeyboardAvoidingView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {getData} from '../AsyncStorage';
const LoginContext = createContext(null);

type ILoginContext = {
  login?: ILogin;
  setLogin: Function;
};

type ILogin = {
  email: string;
  nome: string;
  senha: string;
  uid: string;
  ids_polls_voted: object[];
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

  async function onResult(QuerySnapshot: any) {
    console.log('atualizou users');
    const userStorage = await getData();
    var logado = false;
    QuerySnapshot.forEach(
      (documentSnapshot: {id: string | undefined; data: () => any}) => {
        if (documentSnapshot.id === userStorage?.uid) {
          logado = true;
          console.log('setandologin');
          setLogin(documentSnapshot.data());
          return console.log('user firestore login', documentSnapshot.data());
        }
      },
    );
    if (!logado) {
      setLogin(false);
    }
  }

  function onError(error: any) {
    console.error(error);
  }

  React.useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(onResult, onError);
    return () => {
      //subscriber();
      console.log('return effect USElogin');
    };
  }, []);
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
