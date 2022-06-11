import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';
import {colors, colorsOfProject} from '../../configs/layout';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const ButtonLoginWrapper = styled.View`
  height: 70px;
  width: 80%;
  background-color: ${props =>
    props.background ? props.background : colorsOfProject.secundary};
  border-radius: 15px;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
`;

const Wrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: ${props => (props.marginTop ? props.marginTop : '20px')}; ;
`;

const WrapperText = styled.Text`
  font-size: ${props => (props.fontSize ? props.fontSize : '18px')};
  font-family: 'Roboto-Bold';
  color: ${colors.white100};
`;
export const ButtonLogin = ({
  children,
  onPress,
  icon,
  colorIcon,
  background,
  fontSize,
  marginTop,
}: any) => {
  return (
    <>
      <TouchableWithoutFeedback onPress={onPress}>
        <Wrapper marginTop={marginTop}>
          <ButtonLoginWrapper background={background}>
            <WrapperText fontSize={fontSize}>{children}</WrapperText>
            <FontAwesome5 name={icon} size={25} color={colorIcon} />
          </ButtonLoginWrapper>
        </Wrapper>
      </TouchableWithoutFeedback>
    </>
  );
};
