import React, {useMemo, useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StatusBar} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import MasonryList from '@react-native-seoul/masonry-list';
import styled from 'styled-components/native';
import {colors, colorsOfProject} from '../configs/layout';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import RadioButtonRN from 'radio-buttons-react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {ButtonLogin} from './components/ButtonLogin';
import {PieChart} from 'react-native-svg-charts';
import {MaisVotados} from './MaisVotados';
type IPoll = {
  id: string;
  imgURL: string;
  question: string;
  category: string;
  colorBackground: string;
  colorBackgroundQuestion: string;
  responses: String[];
};

const WrapperPoll = styled.View`
  flex: 1;
  margin: 10px;
`;

const WrapperImage = styled.ImageBackground`
  flex: 1;
  justify-content: space-between;
  align-self: stretch;
  border-radius: 15px;
  overflow: hidden;
  align-items: baseline;
`;

const Linear = styled(LinearGradient)`
  width: 100%;
  height: 1000px;
  position: absolute;
  border-radius: 15px;
  height: ${props => (props.bool ? '250px' : '320px')};
`;

const TextPoll = styled.Text`
  color: ${colors.white100};
  font-family: 'Roboto-Bold';
  font-size: 22px;
  background-color: rgba(0, 0, 0, 0.8);
  margin: 20px;
  position: absolute;
  bottom: 1px;
  border-radius: 15px;
  padding: 5px;
`;

const WrapperModal = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const TextModalQuestion = styled.Text`
  color: ${colors.white100};
  font-family: 'Roboto-Bold';
  font-size: 30px;
  background-color: rgba(0, 0, 0, 0.8);

  border-radius: 15px;
  padding: 15px;
`;

const WrapperRadio = styled.View`
  width: 100%;
  height: auto;
  margin: 20px;
  align-items: stretch;
  flex: 1;
  justify-content: space-evenly;
`;

export const Lista = ({navigation}: any) => {
  const [pollsFirestore, setPollsFirestore] = useState<IPoll | []>([]);
  const [choosing, setChoosing] = useState<IPoll | false>(false);

  const modalizeRef = useRef<Modalize>(null);

  function choosePoll(item: any) {
    setChoosing(item);
    item.responses.map(opcao => {
      console.log('OP', opcao);
    });

    modalizeRef.current?.open();
  }

  async function getPolls() {
    const polls = await firestore().collection('polls').get();
    const pollsShow: [] = [];

    polls.forEach(poll => {
      pollsShow.push({
        ...poll.data(),
      });
    });
    setPollsFirestore(pollsShow);
  }
  React.useEffect(() => {
    getPolls();
  }, []);

  const renderItem = ({item}: any) => {
    const randomBool = Math.random() < 0.5;
    console.log(item);
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            choosePoll(item);
          }}>
          <WrapperPoll key={item.id}>
            <WrapperImage
              source={{uri: item.imgURL}}
              style={{
                height: randomBool ? 250 : 320,
              }}>
              <TextPoll>{item.question}</TextPoll>
            </WrapperImage>
            <Linear
              bool={randomBool}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              colors={[
                item.colorBackground,
                'transparent',
                'transparent',
              ]}></Linear>
          </WrapperPoll>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <MasonryList
        keyExtractor={item => item.id}
        ListHeaderComponent={<View />}
        contentContainerStyle={{
          paddingHorizontal: 24,
          alignSelf: 'stretch',
        }}
        numColumns={2}
        data={pollsFirestore}
        renderItem={renderItem}
      />

      <Modalize
        ref={modalizeRef}
        modalTopOffset={80}
        modalStyle={{
          flex: 1,
          backgroundColor: colorsOfProject.secundary,
        }}>
        <WrapperModal>
          <TextModalQuestion>{choosing.question}</TextModalQuestion>
          <WrapperRadio>
            <RadioButtonRN
              data={choosing.responses}
              selectedBtn={e => console.log(e)}
              box={true}
              activeColor={colorsOfProject.primary}
              circleSize={30}
              deactiveColor={colorsOfProject.secundary100}
              textStyle={{
                color: colors.white100,
                fontSize: 26,
                fontFamily: 'Roboto-Regular',
                padding: 5,
              }}
              duration={1000}
            />
          </WrapperRadio>

          <ButtonLogin
            icon={'arrow-right'}
            background={colors.green100}
            colorIcon={colorsOfProject.secundary}
            fontSize={'24px'}
            marginTop={'0px'}>
            Votar
          </ButtonLogin>
        </WrapperModal>
      </Modalize>
    </>
  );
};
