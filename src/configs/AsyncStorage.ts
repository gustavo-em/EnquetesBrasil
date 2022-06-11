import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import React from 'react';
export type IUser = {
  nome?: string;
  email?: string;
  senha?: string;
  uid?: string;
};

export const KEY_USER = 'user';
export const storeData = async (value: IUser) => {
  try {
    const jsonValue = JSON.stringify(value);
    console.log('jsonstringy', jsonValue);
    return await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    Alert.alert('Erro ao criar Storage');
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    console.log('jsonstrongify', jsonValue);
    return jsonValue != null ? (JSON.parse(jsonValue) as IUser) : null;
  } catch (e) {
    Alert.alert('Erro no storage');
  }
};
