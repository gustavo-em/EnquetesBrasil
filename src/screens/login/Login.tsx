import React from 'react';
import {Text, ImageBackground} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../configs/layout';
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
export const Login = () => {
  return (
    <>
      <Container>
        <ImageBackground
          source={require('../../assets/bg.jpg')}
          style={{width: 400, height: 1000, position: 'absolute'}}
        />
        <ContainerIMG>
          <IMG colors={[colors.porple100, 'transparent']}></IMG>
        </ContainerIMG>

        <Text>oii</Text>
      </Container>
    </>
  );
};
