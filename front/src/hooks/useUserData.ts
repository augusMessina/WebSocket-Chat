import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
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
      }
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
        setIsLoaded(true);
      },
    }
  );

  return {
    username: data?.getUserData.username,
    id: data?.getUserData.id,
    invitSent: data?.getUserData.invitSent,
    chats,
    setChats,
    mailbox: data?.getUserData.mailbox,
    friends,
    setFriends,
    loading,
    error,
    refetchData: refetch,
    isLoaded,
  };
}
