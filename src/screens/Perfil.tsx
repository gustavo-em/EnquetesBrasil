import React from 'react';
import {Alert, Button, Text} from 'react-native';
import {useLogin} from '../configs/hooks/useLogin';
import auth from '@react-native-firebase/auth';
import {storeData} from '../configs/AsyncStorage';

export const Perfil = () => {
  const {login, setLogin} = useLogin();
  console.log(login);

  function logout() {
    auth()
      .signOut()
      .then(async () => {
        await storeData({});
        setLogin(false);
      });
  }
  return (
    <>
      <Text>Perfil: {login?.nome}</Text>
      <Button title="Sair" onPress={logout}></Button>
    </>
  );
};
