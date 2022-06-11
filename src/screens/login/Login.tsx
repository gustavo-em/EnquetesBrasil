import React, {useState} from 'react';
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, colorsOfProject} from '../../configs/layout';
import auth from '@react-native-firebase/auth';
import {useLogin} from '../../configs/hooks/useLogin';
import Desenho from '../../assets/LogoSplash.svg';
import {InputLogin} from '../components/InputLogin';
import {ButtonLogin} from '../components/ButtonLogin';
import {useNavigation} from '@react-navigation/native';

import {getData, IUser, storeData} from '../../configs/AsyncStorage';
import firestore from '@react-native-firebase/firestore';

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
  const [initializing, setInitializing] = useState(true);
  const {login, setLogin} = useLogin();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function onAuthStateChanged(user: any) {
    console.log('user', user);
    if (user != null) {
      const userStorage = await getData();
      if (userStorage != null) {
        const userFirestore = await firestore()
          .collection('users')
          .doc(userStorage.uid)
          .get();
        const dataUserFirestore = userFirestore.data() as IUser;
        console.log('datauserfirestore', dataUserFirestore);
        if (dataUserFirestore.email === userStorage.email) {
          return setLogin(userStorage);
        } else {
          Alert.alert('Imcompatibilidade com storage e firestore');
        }
      } else {
        setLogin(user);
      }
    } else {
      setLogin(user);
    }

    if (initializing) setInitializing(false);
  }

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

        const userFirestoreData = userFirestore.data() as IUser;
        const user = {
          nome: userFirestoreData.nome,
          email: res.user.email as string,
          senha,
          uid: res.user.uid as string,
        };
        // Add to storage to auto-login
        await storeData(user).then(r => console.log('gravou storage', r));
        setLogin(user);
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
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!login) {
    return (
      <>
        <StatusBar
          backgroundColor={colorsOfProject.primary}
          barStyle="dark-content"
        />
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
            Entrar
          </ButtonLogin>
          <ButtonLogin
            onPress={() => navigate.navigate('Cadastro')}
            icon={'plus'}
            colorIcon={colorsOfProject.primary}
            background={colorsOfProject.secundary100}>
            Criar Conta
          </ButtonLogin>
        </Container>
      </>
    );
  }
};
