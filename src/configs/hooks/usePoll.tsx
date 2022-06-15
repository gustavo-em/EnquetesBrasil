import React, {createContext, useContext, useState} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {getData} from '../AsyncStorage';
import {ILogin, ILoginContext, useLogin} from './useLogin';
const PollsContext = createContext(null);

type IResponses = {
  cor: String;
  index: number;
  label: String;
  votos: number;
};
export type IPoll = {
  category: String;
  colorBackground: String;
  colorBackgroundQuestion: String;
  id: String;
  imgURL: String;
  question: String;
  responses: IResponses[];
  users_voted: String[];
};

export const PollContainerContext = ({children}: any) => {
  const [polls, setPolls] = useState<IPoll[] | false>(false);
  const [pollsWithoutVoted, setPollsWithoutVoted] = useState<IPoll[] | []>([]);
  const {login} = useLogin() as ILoginContext;

  async function onResult(QuerySnapshot: FirebaseFirestoreTypes.QuerySnapshot) {
    const pollsFirebase: IPoll[] = [];
    //Polls que o usuário não votou ainda
    const pollToShow: IPoll[] = [];

    var user = await firestore().collection('users').doc(login.uid).get();
    var userdata = user.data() as ILogin;
    QuerySnapshot.forEach(
      (documentSnapshot: {id: string | undefined; data: () => any}) => {
        //Att polls
        pollsFirebase.push({
          ...documentSnapshot.data(),
        });

        //Att polls voted (if yes, length is 1 )
        const userAlreadyVotedInThisPoll = userdata?.ids_polls_voted.filter(
          votedByUser => {
            if (votedByUser.id_poll == documentSnapshot.data().id)
              return votedByUser;
            return false;
          },
        );

        if (userAlreadyVotedInThisPoll?.length == 0) {
          pollToShow.push({
            ...documentSnapshot.data(),
          });
        }
      },
    );
    setPolls(pollsFirebase);
    setPollsWithoutVoted(pollToShow);
  }

  function onError(error: any) {
    console.error(error);
  }

  React.useEffect(() => {
    const subscriber = firestore()
      .collection('polls')
      .onSnapshot(onResult, onError);
    return () => {
      subscriber();
    };
  }, []);

  return (
    <PollsContext.Provider
      value={{polls, setPolls, pollsWithoutVoted, setPollsWithoutVoted}}>
      {children}
    </PollsContext.Provider>
  );
};

type IPollsContext = {
  polls: IPoll[];
  setPolls: Function;
  pollsWithoutVoted: IPoll[];
  setPollsWithoutVoted: Function;
};

export const usePolls = () => {
  const loginContext = useContext(PollsContext);
  return loginContext as unknown as IPollsContext;
};
