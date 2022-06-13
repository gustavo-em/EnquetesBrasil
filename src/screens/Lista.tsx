import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Alert, Text, Button} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import MasonryList from '@react-native-seoul/masonry-list';
import styled from 'styled-components/native';
import {colors, colorsOfProject} from '../configs/layout';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import RadioButtonRN from 'radio-buttons-react-native';
import {ButtonLogin} from './components/ButtonLogin';

import {Chart} from './components/Chart';
import Modal from 'react-native-modal';
import {useLogin} from '../configs/hooks/useLogin';
type IPoll = {
  id: string;
  imgURL: string;
  question: string;
  category: string;
  colorBackground: string;
  colorBackgroundQuestion: string;
  responses: String[];
  users_voted: String[];
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
  padding: 35px;
  padding-bottom: 200px;
  margin-top: 10px;
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

const ViewModal = styled.View`
  width: 80%;
  height: 200px;
  background-color: ${colors.white100};
  border-radius: 10px;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
`;

const ButtonModal = styled.TouchableOpacity`
  border-radius: 10px;
  width: 100px;
  height: 50px;
  background: ${colors.green100};

  justify-content: center;
  align-items: center;
`;

const TextModal = styled.Text`
  font-size: 20px;
  color: ${colors.black100};
  font-family: 'Roboto-Bold';
`;

const WrapperUsersVoted = styled.View`
  height: 50px;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 10px;
  padding-top: 10px;
`;

const TextUsersVoted = styled.Text`
  font-size: 15px;
  color: ${colors.white100};
  font-family: 'Roboto-Regular';
`;

type IOption = {
  cor: string;
  label: string;
  votos: number;
};

export const Lista = ({navigation}: any) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [pollsFirestore, setPollsFirestore] = useState<IPoll | []>([]);
  const [choosing, setChoosing] = useState<IPoll | false>(false);
  const [optionSelected, setOptionSelect] = useState<IOption | false>(false);
  const {login, setLogin} = useLogin();

  const modalizeRef = useRef<Modalize>(null);
  const toggleModal = () => setModalVisible(!isModalVisible);

  function choosePoll(item: any) {
    const keys = item.responses.map((value, index, array) => value.label);
    const values = item.responses.map((value, index, array) => value.votos);
    const colors = item.responses.map((value, index, array) => value.cor);

    setChoosing({...item, charts: [keys, values, colors]});

    modalizeRef.current?.open();
  }

  async function getPolls() {
    const pollsShow: [] = [];
    await firestore()
      .collection('polls')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const userAlreadyVotedInThisPoll = login?.ids_polls_voted.filter(
            votedByUser => {
              if (votedByUser.id_poll == documentSnapshot.data().id)
                return votedByUser;
              return false;
            },
          );
          if (userAlreadyVotedInThisPoll?.length == 0) {
            pollsShow.push({
              ...documentSnapshot.data(),
            });
          }
        });
        setPollsFirestore(pollsShow);
      });
  }

  async function voteInOption() {
    console.log('votu', optionSelected);

    if (optionSelected == false) {
      toggleModal();
      setTextModal('Selecione uma opção para conseguir votar');
      return;
    }

    const newResponses = choosing.responses.map((value, index, array) => {
      if (value.index == optionSelected.index) {
        return {
          ...value,
          votos: ++value.votos,
        };
      }
      return value;
    });
    console.log(login);

    //Add new poll voted para usuario
    firestore()
      .collection('users')
      .doc(login.uid)
      .update({
        ids_polls_voted: [
          ...login.ids_polls_voted,
          {
            id_poll: Number(choosing.id),
            option: JSON.stringify(optionSelected),
            question: JSON.stringify(choosing),
          },
        ],
      })
      .then(() => {
        //Att poll
        firestore()
          .collection('polls')
          .doc(choosing.id as string)
          .update({
            responses: newResponses,
            users_voted: [...choosing.users_voted, login?.nome],
          })
          .then(() => {
            //navigation.navigate('+');
            modalizeRef.current?.close();
            toggleModal();
            setTextModal(
              'Obrigado por votar! \nVocê pode acompanhar a enquete na aba ao lado.',
            );
          });
      });
  }

  React.useEffect(() => {
    getPolls();
  }, []);

  const renderItem = ({item}: any) => {
    const randomBool = Math.random() < 0.5;
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
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left">
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ViewModal>
            <Text style={{fontSize: 24, color: '#000'}}>{textModal}</Text>

            <ButtonModal onPress={toggleModal}>
              <TextModal>OK</TextModal>
            </ButtonModal>
          </ViewModal>
        </View>
      </Modal>

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
        adjustToContentHeight={true}
        ref={modalizeRef}
        modalTopOffset={100}
        modalStyle={{
          flex: 1,
          backgroundColor: colorsOfProject.secundary,
        }}
        onOpen={() => {
          console.log('abriumodal');
          setOptionSelect(false);
        }}>
        <WrapperModal>
          {choosing ? (
            <Chart
              keysChart={choosing.charts[0]}
              valuesChart={choosing.charts[1]}
              colorsChart={choosing.charts[2]}
            />
          ) : null}
          <TextModalQuestion>{choosing.question}</TextModalQuestion>
          {choosing.users_voted ? (
            <WrapperUsersVoted>
              {choosing.users_voted.map((user, index, array) => {
                return (
                  <TextUsersVoted key={user}>
                    {user}
                    {index == array.length - 1 ? '' : ', '}
                  </TextUsersVoted>
                );
              })}
              <TextUsersVoted>.. votaram nessa enquete.</TextUsersVoted>
            </WrapperUsersVoted>
          ) : (
            <Text>Ninguem votou ainda</Text>
          )}

          <WrapperRadio>
            <RadioButtonRN
              data={choosing.responses}
              selectedBtn={(e: IOption) => setOptionSelect(e)}
              box={true}
              activeColor={colorsOfProject.primary}
              circleSize={30}
              deactiveColor={colors.black100}
              textStyle={{
                color: colors.white100,
                fontSize: 26,
                fontFamily: 'Roboto-Regular',
                padding: 5,
              }}
              duration={1000}
              boxDeactiveBgColor={colorsOfProject.secundary100}
            />
          </WrapperRadio>

          <ButtonLogin
            icon={'arrow-right'}
            background={colors.green100}
            colorIcon={colorsOfProject.secundary}
            fontSize={'24px'}
            marginTop={'0px'}
            onPress={voteInOption}>
            Votar
          </ButtonLogin>
        </WrapperModal>
      </Modalize>
    </>
  );
};
