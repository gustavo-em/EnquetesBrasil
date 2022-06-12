import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import React from 'react';
export type IUser = {
  nome?: string;
  email?: string;
  senha?: string;
  uid?: string;
  ids_polls_voted?: Object[];
};

export const KEY_USER = 'user';
export const storeData = async (value: IUser) => {
  try {
    const jsonValue = JSON.stringify(value);

    return await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    Alert.alert('Erro ao criar Storage');
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');

    return jsonValue != null ? (JSON.parse(jsonValue) as IUser) : null;
  } catch (e) {
    Alert.alert('Erro no storage');
  }
};
