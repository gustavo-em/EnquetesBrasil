import React, {useState} from 'react';
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Alert,
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
  const [initializing, setInitializing] = useState(true);
  const {login, setLogin} = useLogin();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  async function onAuthStateChanged(user: any) {
    console.log('user', user);
    if (user != null) {
      console.log('vai pegar get data');
      const userStorage = await getData(KEY_USER);
      if (userStorage != null) {
        return setLogin(userStorage);
      } else {
        setLogin(user);
      }
    } else {
      setLogin(user);
    }
    if (initializing) setInitializing(false);
  }

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
        };
        // Add user account information in Firestore to be retrieved later.
        await firestore().collection('users').doc(res.user.uid).set(user);
        // Add to storage to auto-login
        await storeData(user).then(r => console.log('gravou storage', r));

        //setLogin(user)
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Formato de email não aceito');
        } else if (error.code === 'auth/operation-not-allowed') {
          Alert.alert('Email ou senha inválidos');
        } else if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email em uso');
        } else {
          Alert.alert('Algo deu errado, coloque email e senha corretos');
        }
      });
  }
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!login) {
    return (
      <>
        <Container>
          <ImageBackground
            source={require('../../assets/bg.jpg')}
            style={{width: 400, height: 1000, position: 'absolute'}}
          />
          <ContainerIMG>
            <IMG
              start={{x: 0.5, y: 1}}
              end={{x: 1, y: 0}}
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
          />
          <InputLogin
            placeholder="Email"
            icon="user"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <InputLogin
            placeholder="Senha"
            icon="lock"
            value={senha}
            onChangeText={text => setSenha(text)}
          />

          <ButtonLogin
            onPress={SignIn}
            icon={'arrow-right'}
            colorIcon={colorsOfProject.primary}>
            Cadastrar
          </ButtonLogin>
        </Container>
      </>
    );
  }
};
