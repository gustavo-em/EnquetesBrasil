import React, {useState} from 'react';
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Alert,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {getData, KEY_USER, storeData} from '../../configs/AsyncStorage';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {ScrollView} from 'react-native-gesture-handler';

const Container = styled.View`
  flex: 1;
  position: relative;
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

export const Cadastro = () => {
  //deixar botao carregando enquanto ta pegando usuario do storage
  //const [initializing, setInitializing] = useState(true);
  const {login, setLogin} = useLogin();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  function SignIn() {
    if (email == '' && senha == '' && nome == '') {
      Alert.alert('Campo vazio');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async res => {
        const user = {
          nome,
          email: res.user.email as string,
          senha,
          uid: res.user.uid as string,
          ids_polls_voted: [],
        };

        // Add to storage to auto-login
        await storeData(user);
        // Add user account information in Firestore to be retrieved later.
        await firestore().collection('users').doc(res.user.uid).set(user);
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Formato de email n??o aceito');
        } else if (error.code === 'auth/operation-not-allowed') {
          Alert.alert('Email ou senha inv??lidos');
        } else if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email em uso');
        } else {
          Alert.alert('Algo deu errado, coloque email e senha corretos');
        }
      });
  }

  if (!login) {
    return (
      <>
        <Container>
          <ScrollView
            contentContainerStyle={{minHeight: 800}}
            automaticallyAdjustKeyboardInsets
            automaticallyAdjustContentInsets>
            <KeyboardAvoidingView behavior="padding">
              <ImageBackground
                source={require('../../assets/bg.jpg')}
                style={{width: 400, height: 1000, position: 'absolute'}}
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
                placeholder="Nome"
                icon="smile"
                value={nome}
                onChangeText={text => setNome(text)}
                type={'default'}
              />
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
                Cadastrar
              </ButtonLogin>
            </KeyboardAvoidingView>
          </ScrollView>
        </Container>
      </>
    );
  } else {
    return null;
  }
};
