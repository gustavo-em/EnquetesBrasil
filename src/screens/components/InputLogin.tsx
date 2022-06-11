import React from 'react';
import {Text, TextInput} from 'react-native';
import styled from 'styled-components/native';
import {colors, colorsOfProject} from '../../configs/layout';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const InputTextLogin = styled.TextInput`
  background-color: ${colors.white100};
  padding: 10px;
  height: 60px;
  font-size: 18px;

  border: 3px solid ${colorsOfProject.primary200};
  border-radius: 15px;

  width: 80%;
  align-items: center;
  justify-content: center;
  color: ${colors.black100};
  font-family: 'Roboto-Regular';
`;

const Wrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const WrapperIcon = styled.View`
  position: absolute;
  z-index: 1;
  left: 1px;
  padding: 5px;
`;

export const InputLogin = ({icon, placeholder, onChangeText, value}: any) => {
  return (
    <Wrapper>
      <WrapperIcon>
        <FontAwesome5
          name={icon}
          size={25}
          color={colorsOfProject.primary100}
        />
      </WrapperIcon>
      <InputTextLogin
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}></InputTextLogin>
    </Wrapper>
  );
};
