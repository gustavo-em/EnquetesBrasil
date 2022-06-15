import React from 'react';
import {FlatList, Text} from 'react-native';
import styled from 'styled-components/native';
import {useLogin} from '../configs/hooks/useLogin';
import {colors, colorsOfProject} from '../configs/layout';
const Wrapper = styled.View`
  flex: 1;
  padding: 20px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 36px;
  color: ${colorsOfProject.secundary};
  font-family: 'Roboto-Bold';
`;

const WrapperCard = styled.View`
  width: 100%;
  height: auto;
  background-color: ${colorsOfProject.secundary};
  border-radius: 10px;
  padding: 10px;
`;

const Card = styled.View`
  width: auto;
  height: 200px;
  background-color: ${props =>
    props.backgroundResp ? props.backgroundResp : colorsOfProject.secundary};
  border-radius: 15px;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const TitleCard = styled.Text`
  font-size: 24px;
  color: ${colors.white100};
  font-family: 'Roboto-Bold';
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
`;
const TitleQuestion = styled.Text`
  font-size: 20px;
  color: ${colors.white100};
  font-family: 'Roboto-Regular';
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 5px;
`;

const WrapperImage = styled.ImageBackground`
  flex: 1;
  justify-content: space-between;
  align-self: stretch;
  border-radius: 15px;
  overflow: hidden;
  align-items: baseline;
  padding: 10px;
`;
export const MaisVotados = () => {
  const {login, setLogin} = useLogin();
  return (
    <>
      <Wrapper>
        <Title>Enquetes já votadas por {login.nome}</Title>
        {!login?.ids_polls_voted ||
        login.ids_polls_voted.length == undefined ? (
          <Text style={{fontSize: 20, color: colors.black100}}>
            Ainda não votou
          </Text>
        ) : (
          <WrapperCard>
            <FlatList
              data={login?.ids_polls_voted}
              renderItem={({item}) => {
                const opt = JSON.parse(item.option);
                const question = JSON.parse(item.question);
                return (
                  <Card key={item.id_poll} backgroundResp={opt.cor}>
                    <TitleQuestion>{question.question}</TitleQuestion>
                    <WrapperImage
                      source={{uri: question.imgURL}}
                      style={{
                        height: 'auto',
                      }}>
                      <TitleCard>
                        Resposta:{' '}
                        <Text style={{color: opt.cor}}>{opt.label}</Text>
                      </TitleCard>
                      <TitleCard>{opt.votos} Votos até agora</TitleCard>
                    </WrapperImage>
                  </Card>
                );
              }}
            />
          </WrapperCard>
        )}
      </Wrapper>
    </>
  );
};
