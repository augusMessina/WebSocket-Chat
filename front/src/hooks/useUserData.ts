import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useContext, useState } from "react";

type QueryResponse = {
  getUserData: {
    id: string;
    username: string;
    chats: [
      {
        id: string;
        name: string;
        modal: string;
        unreadMessages: number;
      }
    ];
    mailbox: [
      {
        id_passed: string;
        modal: string;
        name: string;
      }
    ];
    invitSent: [
      {
        id_passed: string;
        modal: string;
        chatID: string;
      }
    ];
    friendList: [
      {
        id: string;
        username: string;
      }
    ];
  };
};

type SubResponse = {
  subNotifs: {
    id_passed: string;
    modal: string;
  };
};

const GET_USER_DATA = gql`
  query GetUserData($token: String!) {
    getUserData(token: $token) {
      id
      username
      chats {
        id
        name
        modal
        unreadMessages
      }
      mailbox {
        id_passed
        modal
        name
      }
      friendList {
        id
        username
      }
      invitSent {
        id_passed
        modal
        chatID
      }
    }
  }
`;

const SUB_NOTIFS = gql`
  subscription SubNotifs($token: String!) {
    subNotifs(token: $token) {
      id_passed
      modal
    }
  }
`;

export default function useUserData() {
  const { JWT } = useContext(JWTContext);

  const [chats, setChats] = useState<
    | {
        id: string;
        name: string;
        modal: string;
        unreadMessages: number;
      }[]
    | undefined
  >();

  const [friends, setFriends] = useState<
    | {
        id: string;
        username: string;
        invited: boolean;
      }[]
    | undefined
  >();

  const [mailbox, setMailbox] = useState<
    {
      id_passed: string;
      name: string;
      modal: string;
    }[]
  >();

  const [invitSent, setInvitSent] = useState<
    {
      id_passed: string;
      modal: string;
      chatID: string;
    }[]
  >();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { data, loading, error, refetch } = useQuery<QueryResponse>(
    GET_USER_DATA,
    {
      variables: {
        token: JWT,
      },
      onCompleted: (data) => {
        setChats(data?.getUserData.chats);
        setFriends(
          data.getUserData.friendList.map((friend) => ({
            id: friend.id,
            username: friend.username,
            invited: false,
          }))
        );
        setMailbox(data.getUserData.mailbox);
        setInvitSent(data.getUserData.invitSent);
        setIsLoaded(true);
      },
      fetchPolicy: "network-only",
    }
  );

  const sub = useSubscription<SubResponse>(SUB_NOTIFS, {
    onData: (data) => {
      console.log("notif received");
      if (data.data.data) {
        const myData = data.data.data;

        if (myData.subNotifs.modal === "MSG") {
          setChats(
            chats?.map((chat) => {
              if (chat.id === myData.subNotifs.id_passed) {
                return {
                  id: chat.id,
                  name: chat.name,
                  modal: chat.modal,
                  unreadMessages: chat.unreadMessages + 1,
                };
              } else {
                return chat;
              }
            })
          );
        }
      }
    },
    variables: {
      token: JWT,
    },
  });

  return {
    username: data?.getUserData.username,
    id: data?.getUserData.id,
    invitSent,
    setInvitSent,
    chats,
    setChats,
    mailbox,
    friends,
    setFriends,
    loading,
    error,
    refetchData: refetch,
    isLoaded,
  };
}
