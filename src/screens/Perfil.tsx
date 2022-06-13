import React from 'react';
import {Alert, Button, Text} from 'react-native';
import {useLogin} from '../configs/hooks/useLogin';
import auth from '@react-native-firebase/auth';
import {storeData} from '../configs/AsyncStorage';
import styled from 'styled-components/native';
import {colors, colorsOfProject} from '../configs/layout';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Wrapper = styled.View`
  flex: 1;
  padding: 20px;
`;

const WrapperHeader = styled.View`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 36px;
  color: ${colorsOfProject.secundary};
  font-family: 'Roboto-Bold';
  justify-content: space-between;
  align-items: center;
`;

const WrapperCard = styled.View`
  width: 100%;
  height: auto;
  background-color: ${colorsOfProject.secundary};
  border-radius: 10px;
  padding: 10px;
`;

const DadoTitle = styled.Text`
  font-size: 24px;
  color: ${colors.white100};
  font-family: 'Roboto-Bold';
`;

const DadoDesc = styled.Text`
  font-size: 20px;
  color: ${colors.white100};
  font-family: 'Roboto-Regular';
  opacity: 0.7;
`;

const ButtonLeave = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: ${colorsOfProject.secundary};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
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
      <Wrapper>
        <WrapperHeader>
          <Title>Perfil</Title>
          <ButtonLeave onPress={logout}>
            <FontAwesome5
              name={'sign-out-alt'}
              color={colorsOfProject.primary}
              size={25}
            />
          </ButtonLeave>
        </WrapperHeader>
        <WrapperCard>
          <DadoTitle>
            Nome: <DadoDesc>{login?.nome}</DadoDesc>
          </DadoTitle>
          <DadoTitle>
            Email: <DadoDesc>{login?.email}</DadoDesc>
          </DadoTitle>
        </WrapperCard>
      </Wrapper>
    </>
  );
};
