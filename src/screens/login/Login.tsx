import React, {useState} from 'react';
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, colorsOfProject} from '../../configs/layout';
import auth from '@react-native-firebase/auth';
import {useLogin} from '../../configs/hooks/useLogin';
import Desenho from '../../assets/LogoSplash.svg';
import {InputLogin} from '../components/InputLogin';
import {ButtonLogin} from '../components/ButtonLogin';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import {getData, IUser, storeData, type} from '../../configs/AsyncStorage';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';

const Container = styled.View`
  flex: 1;
  position: relative;
  height: 1000px;
`;

const IMG = styled(LinearGradient)`
  width: 100%;
  height: 1000px;
  position: absolute;
`;

const ContainerIMG = styled.View`
  position: relative;
`;

const WrapperSvg = styled.View`
  width: 100%;
  height: 300px;
  align-items: center;
  justify-content: center;
`;

const WrapperTextCadastro = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const TextCadastro = styled.Text`
  color: ${colors.black100};
  font-family: 'Roboto-Regular';
  font-size: 24px;
`;

export const Login = () => {
  const navigate = useNavigation();
  const {login, setLogin} = useLogin();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function SignIn() {
    if (email == '' && senha == '') {
      Alert.alert('Campo vazio');
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, senha)
      .then(async res => {
        const userFirestore = await firestore()
          .collection('users')
          .doc(res.user.uid)
          .get();
        // Add to storage to auto-login
        await storeData(userFirestore.data() as IUser);
        setLogin(userFirestore.data() as IUser);
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Formato de email não aceito');
        } else if (error.code === 'auth/operation-not-allowed') {
          Alert.alert('Email ou senha inválidos');
        } else {
          Alert.alert('Algo deu errado, coloque email e senha corretos');
        }
      });
  }

  if (!login) {
    return (
      <>
        <StatusBar
          backgroundColor={colorsOfProject.primary}
          barStyle="dark-content"
        />
        <Container>
          <ScrollView
            contentContainerStyle={{minHeight: 800}}
            automaticallyAdjustKeyboardInsets
            automaticallyAdjustContentInsets>
            <KeyboardAvoidingView behavior="padding">
              <ImageBackground
                source={require('../../assets/bg.jpg')}
                style={{width: 400, height: 1500, position: 'absolute'}}
              />
              <ContainerIMG>
                <IMG
                  start={{x: 1, y: 0}}
                  end={{x: 0.5, y: 0.5}}
                  colors={[colorsOfProject.primary, 'transparent']}></IMG>
              </ContainerIMG>

              <WrapperSvg>
                <Desenho width={200} height={200} />
              </WrapperSvg>
              <InputLogin
                placeholder="Email"
                icon="user"
                value={email}
                onChangeText={text => setEmail(text)}
                type={'email-address'}
              />
              <InputLogin
                placeholder="Senha"
                icon="lock"
                value={senha}
                onChangeText={text => setSenha(text)}
                type={'visible-password'}
              />
              <ButtonLogin
                onPress={SignIn}
                icon={'arrow-right'}
                colorIcon={colorsOfProject.primary}>
                Entrar
              </ButtonLogin>
              <ButtonLogin
                onPress={() => navigate.navigate('Cadastro')}
                icon={'plus'}
                colorIcon={colorsOfProject.primary}
                background={colorsOfProject.secundary100}>
                Criar Conta
              </ButtonLogin>
            </KeyboardAvoidingView>
          </ScrollView>
        </Container>
      </>
    );
  }
};
